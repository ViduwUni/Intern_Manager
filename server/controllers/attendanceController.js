const express = require('express');
const Attendance = require('../models/Attendance');

// Create or update attendance
exports.createOrUpdateAttendance = async (req, res) => {
    try {
        const { internId, date, status, checkIn, checkOut } = req.body;
        const attendance = await Attendance.findOneAndUpdate(
            { internId, date },
            { status, checkIn, checkOut },
            { upsert: true, new: true }
        );
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get attendance by intern (calendar)
exports.getAttendanceByIntern = async (req, res) => {
    try {
        const { internId } = req.params;
        const { month, year } = req.query;

        const query = { internId };

        if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59);
            query.date = { $gte: start, $lte: end };
        }

        const data = await Attendance.find(query).sort({ date: 1 });
        const calendarView = {};

        data.forEach((entry) => {
            const dateStr = entry.date.toISOString().split('T')[0];
            calendarView[dateStr] = {
                status: entry.status,
                checkIn: entry.checkIn,
                checkOut: entry.checkOut
            };
        });

        res.json(calendarView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Today marked interns
exports.getTodayMarkedInterns = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const start = new Date(today);
        const end = new Date(today);
        end.setDate(end.getDate() + 1);

        const entries = await Attendance.find({
            date: { $gte: start, $lt: end }
        }).select('internId');

        const markedIds = entries.map(e => e.internId.toString());
        res.json(markedIds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};