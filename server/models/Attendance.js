const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: [
            'Present',
            'Leave',
            'Half Day',
            'Short Leave',
            'Absent'
        ],
        required: true
    },
    checkIn: {
        type: String
    },
    checkOut: {
        type: String
    }
}, { timestamps: true });

attendanceSchema.index({
    internId: 1,
    date: 1
}, {
    unique: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);