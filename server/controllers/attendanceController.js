const Attendance = require('../models/Attendance');
const User = require('../models/User');
const xlsx = require('xlsx');

// Add single attendance
exports.markAttendance = async (req, res) => {
    try {
        const { intern, date, status, checkIn, checkOut, remarks } = req.body;
        const attendance = await Attendance.create({
            intern,
            date,
            status,
            checkIn,
            checkOut,
            remarks
        });
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const { month } = req.query;
        let query = {};

        if (month) {
            const startDate = new Date(`${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const records = await Attendance.find(query).populate('intern');
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send notification (placeholder)
exports.sendNotification = async (req, res) => {
    try {
        // example: notify interns with "absent" or "late" status
        const today = new Date().toISOString().split('T')[0];
        const absentees = await Attendance.find({
            date: today,
            status: { $in: ['absent', 'short_leave', 'half_day'] }
        }).populate('intern', 'email name');

        // loop over absentees and trigger email/SMS (placeholder)
        res.json({ message: 'Notification sent (placeholder)', absentees });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const excelTimeToString = (excelTime) => {
    if (typeof excelTime === 'number') {
        const totalMinutes = Math.round(excelTime * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    if (typeof excelTime === 'string' && excelTime.trim() !== '') {
        return excelTime; // Assume already "HH:mm"
    }
    return null;
};

// Bulk Upload Attendance via Excel
exports.bulkUploadAttendance = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);

        const errors = [];
        const inserted = [];

        for (let row of rows) {
            const { 'Intern Email': email, 'Date (YYYY-MM-DD)': date, 'Status': status, 'Check In': checkIn, 'Check Out': checkOut, 'Remarks': remarks } = row;

            const user = await User.findOne({ email });
            if (!user) {
                errors.push({ email, error: 'User not found' });
                continue;
            }

            try {
                const dateObj = new Date(date);
                if (isNaN(dateObj.getTime())) {
                    errors.push({ email, error: 'Invalid date format' });
                    continue;
                }

                const checkInStr = excelTimeToString(checkIn);
                const checkOutStr = excelTimeToString(checkOut);

                const existing = await Attendance.findOne({ intern: user._id, date: dateObj });

                if (existing) {
                    await Attendance.updateOne({ intern: user._id, date: dateObj }, {
                        status,
                        checkIn: checkInStr,
                        checkOut: checkOutStr,
                        remarks
                    });
                } else {
                    await Attendance.create({
                        intern: user._id,
                        date: dateObj,
                        status,
                        checkIn: checkInStr,
                        checkOut: checkOutStr,
                        remarks
                    });
                }
                inserted.push(email);
            } catch (err) {
                errors.push({ email, error: err.message });
            }
        }

        res.json({ insertedCount: inserted.length, failed: errors });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};