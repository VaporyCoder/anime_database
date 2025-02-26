const express = require('express');
const userController = require('../controllers/userController');
const auth = require("../middleware/auth");

const router = express.Router();

// User routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get("/profile", auth, userController.getProfile);

module.exports = router; // Ensure this is exporting the router