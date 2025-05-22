import { useState, useEffect } from 'react';
import API from '../api/api';
import BulkAttendanceUpload from './BulkAttendanceUpload';

const AttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [message, setMessage] = useState('');
    const [interns, setInterns] = useState([]);

    const [formData, setFormData] = useState({
        internId: '',   // Changed to internId
        date: new Date().toISOString().slice(0, 10),
        status: 'present',
        checkIn: '',
        checkOut: ''
    });

    // Fetch attendance when month changes
    useEffect(() => {
        fetchAttendance();
    }, [month]);

    // Fetch interns once on mount
    useEffect(() => {
        fetchInterns();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await API.get(`/api/attendance?month=${month}`);
            setAttendance(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchInterns = async () => {
        try {
            const res = await API.get('/api/interns');  // your route for interns
            setInterns(res.data);
            if (res.data.length > 0) {
                setFormData(prev => ({ ...prev, internId: res.data[0]._id }));
            }
        } catch (err) {
            console.error('Failed to load interns:', err);
        }
    };

    const formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleDateString('en-CA');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                intern: formData.internId,  // sending intern id now
                date: formData.date,
                status: formData.status,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut
            };
            console.log(payload);

            const res = await API.post('/api/attendance/mark', payload);
            setMessage('Attendance marked successfully!');
            fetchAttendance();
            setFormData(prev => ({
                ...prev,
                date: new Date().toISOString().slice(0, 10),
                status: 'present',
                checkIn: '',
                checkOut: ''
            }));
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to mark attendance');
        }
    };

    const getInternName = (id) => {
        const intern = interns.find(i => i._id === id);
        if (!intern) return 'N/A';

        const names = intern.fullName.trim().split(' ');
        return names.slice(-2).join(' ');
    };

    return (
        <div>
            <h2>Intern Attendance</h2>

            <label>Select Month: </label>
            <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
            />

            {interns.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Intern</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((entry, i) => (
                            <tr key={i}>
                                <td>{getInternName(entry.intern && typeof entry.intern === 'object' ? entry.intern._id : entry.intern)}</td>
                                <td>{formatDate(entry.date)}</td>
                                <td>{entry.status}</td>
                                <td>{entry.checkIn || '-'}</td>
                                <td>{entry.checkOut || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <hr />
            <h3>Mark Attendance Manually</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <select
                    name="internId"
                    value={formData.internId}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 10 }}
                >
                    {interns.map(intern => (
                        <option key={intern._id} value={intern._id}>
                            {intern.fullName} ({intern.email})
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 10 }}
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 10 }}
                >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="short_leave">Short Leave</option>
                    <option value="half_day">Half Day</option>
                    <option value="leave">Leave</option>
                </select>
                <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    placeholder="Check In"
                    style={{ marginRight: 10 }}
                />
                <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    placeholder="Check Out"
                    style={{ marginRight: 10 }}
                />
                <button type="submit">Mark Attendance</button>
            </form>

            <BulkAttendanceUpload />
            {message && <p>{message}</p>}
        </div>
    );
};

export default AttendancePage;