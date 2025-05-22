const express = require('express');
const multer = require('multer');
const router = express.Router();
const attendanceCtrl = require('../controllers/attendanceController');

const upload = multer();

router.post('/mark', attendanceCtrl.markAttendance);
router.post('/bulk-upload', upload.single('file'), attendanceCtrl.bulkUploadAttendance);
router.get('/', attendanceCtrl.getAllAttendance);
router.post('/notify', attendanceCtrl.sendNotification);

// FOR TEMPLATE
router.get('/template', (req, res) => {
    const template = [
        ['Intern Email', 'Date (YYYY-MM-DD)', 'Status', 'Check In', 'Check Out', 'Remarks']
    ];
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(template);
    xlsx.utils.book_append_sheet(wb, ws, 'Template');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

module.exports = router;