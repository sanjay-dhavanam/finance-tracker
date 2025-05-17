const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUser);
router.get('/username/:username', userController.getUserByUsername);

module.exports = router;