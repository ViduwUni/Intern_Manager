const express = require('express');
const router = express.Router();
const { createOrUpdateAttendance, getAttendanceByIntern, getTodayMarkedInterns } = require('../controllers/attendanceController');

router.post('/', createOrUpdateAttendance);
router.get('/calendar/:internId', getAttendanceByIntern);
router.get('/today', getTodayMarkedInterns);

module.exports = router;