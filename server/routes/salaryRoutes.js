const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.post('/', salaryController.createSalary);
router.get('/intern/salary/:internId', salaryController.getSalariesByIntern);
router.put('/status/:salaryId', salaryController.updateSalaryStatus);
router.get('/', salaryController.getAllSalaries);

module.exports = router;