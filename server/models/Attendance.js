const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['present', 'absent', 'short_leave', 'half_day', 'leave'],
        required: true
    },
    checkIn: { type: String },
    checkOut: { type: String },
    remarks: { type: String }
}, { timestamps: true });

attendanceSchema.index({ intern: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);