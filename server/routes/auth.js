const express = require('express');
const router = express.Router();
const { getAllUsers, register, login, deleteUser, updateUser } = require('../controllers/authController');

router.get('/users', getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

module.exports = router;