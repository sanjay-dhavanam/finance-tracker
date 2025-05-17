const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/:id', userController.getUser);
router.get('/username/:username', userController.getUserByUsername);
router.post('/', userController.createUser);

module.exports = router;