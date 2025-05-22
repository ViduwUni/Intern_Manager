import { useState } from 'react';
import * as XLSX from 'xlsx';
import API from '../api/api';

const BulkAttendanceUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Parse Excel date number or string into yyyy-mm-dd
    const parseExcelDate = (value) => {
        console.log('Raw Excel Date:', value);
        if (typeof value === 'number') {
            const dateObj = XLSX.SSF.parse_date_code(value);
            if (!dateObj) return null;
            const formatted = `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
            console.log('Parsed numeric date:', formatted);
            return formatted;
        }
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            const iso = date.toISOString().slice(0, 10);
            console.log('Parsed string date:', iso);
            return iso;
        }
        console.log('Invalid date value');
        return null;
    };

    // Convert Excel numeric time or string time to "HH:mm"
    const parseExcelTime = (value) => {
        if (typeof value === 'number') {
            // Excel time is fraction of day
            const totalMinutes = Math.round(value * 24 * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            console.log('Parsed numeric time:', value, '=>', formatted);
            return formatted;
        }
        if (typeof value === 'string') {
            const trimmed = value.trim();
            console.log('String time:', trimmed);
            return trimmed;
        }
        return '';
    };

    const validateRow = (row) => {
        const requiredFields = ['Intern Email', 'Date (YYYY-MM-DD)', 'Status'];
        const validStatuses = ['present', 'absent', 'short_leave', 'half_day', 'leave'];
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (let field of requiredFields) {
            if (!row[field]) {
                console.log(`Missing field ${field}:`, row);
                return `${field} is required`;
            }
        }

        if (!emailRegex.test(row['Intern Email'])) {
            console.log('Invalid Email:', row['Intern Email']);
            return 'Invalid email';
        }

        if (!validStatuses.includes(row['Status'].toLowerCase())) {
            console.log('Invalid Status:', row['Status']);
            return 'Invalid status';
        }

        if (row['Check In']) {
            console.log('Check In:', row['Check In']);
            if (!timeRegex.test(row['Check In'])) return 'Invalid check-in time';
        }

        if (row['Check Out']) {
            console.log('Check Out:', row['Check Out']);
            if (!timeRegex.test(row['Check Out'])) return 'Invalid check-out time';
        }

        return null;
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) return setMessage('Please select a file.');

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                // Normalize date
                const parsedDate = parseExcelDate(row['Date (YYYY-MM-DD)']);
                if (!parsedDate) {
                    return setMessage(`Error in row ${i + 2}: Invalid date format`);
                }
                row['Date (YYYY-MM-DD)'] = parsedDate;

                // Normalize times
                row['Check In'] = parseExcelTime(row['Check In']);
                row['Check Out'] = parseExcelTime(row['Check Out']);

                // Validate row data
                const error = validateRow(row);
                if (error) {
                    console.log('Row causing error:', row);
                    return setMessage(`Error in row ${i + 2}: ${error}`);
                }
            }

            // If all good, send file to backend
            const formData = new FormData();
            formData.append('file', file);
            const res = await API.post('/api/attendance/bulk-upload', formData);
            setMessage(res.data.message || 'Upload successful');
        } catch (err) {
            console.log('Upload error:', err);
            setMessage(err.response?.data?.error || 'Upload failed');
        }
    };

    const handleDownloadTemplate = () => {
        const header = [
            ['Intern Email', 'Date (YYYY-MM-DD)', 'Status', 'Check In', 'Check Out']
        ];
        const sample = [
            ['intern1@email.com', '2025-05-01', 'present', '09:00', '17:00'],
            ['intern2@email.com', '2025-05-01', 'half_day', '09:00', '13:00']
        ];
        const rows = header.concat(sample);
        const csvContent = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'attendance_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h3>Bulk Attendance Upload</h3>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={handleDownloadTemplate}>Download Template</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BulkAttendanceUpload;