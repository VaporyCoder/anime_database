const express = require('express');
const userController = require('../controllers/userController');
const auth = require("../middleware/auth");
const adminCheck = require("../middleware/adminCheck");
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// Public routes
router.post('/signup', upload.single('profilePicture'), userController.signup);
router.post('/login', userController.login);

// Protected routes
router.use(auth);
router.get("/profile", userController.getProfile);
router.patch("/profile", upload.single('profilePicture'), userController.updateUser);
router.delete("/profile", userController.deleteUser);

// Admin routes
router.use(adminCheck);
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.adminDeleteUser);
router.patch('/:id', upload.single('profilePicture'), userController.adminUpdateUser);

// Error handler (must be last)
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal Server Error' 
  });
});

module.exports = router;