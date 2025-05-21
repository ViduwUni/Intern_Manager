const express = require('express');
const router = express.Router();
const internController = require('../controllers/internController');

router.post('/', internController.createIntern);
router.get('/', internController.getInterns);
router.put('/:id', internController.updateIntern);
router.get('/me', internController.getMyInternProfile);

module.exports = router;