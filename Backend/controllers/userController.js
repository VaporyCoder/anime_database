const bcrypt = require("bcrypt");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Helper function for error responses
const errorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, error: message });
};

// Signup a new user (Updated for Cloudinary)
exports.signup = async (req, res) => {
  const { username, email, password, phoneNumber, address } = req.body;

  try {
    // Use Cloudinary URL if file was uploaded, otherwise use default
    const profileUrl = req.file?.path || process.env.DEFAULT_AVATAR_URL;
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      profilePicture: profileUrl
    });

    await user.save();
    

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    // Cleanup file on error
    errorResponse(res, 400, err.message);
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 401, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 401, 'Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    errorResponse(res, 500, 'Server error');
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return errorResponse(res, 404, "User not found");
    res.json({ 
      success: true, 
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        address: user.address
      }
    });
  } catch (err) {
    errorResponse(res, 500, 'Server error');
  }
};

// Delete current user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    res.json({ success: true, data: {} });
  } catch (err) {
    errorResponse(res, 500, 'Server error');
  }
};

// Update user profile (Modified for Cloudinary)
exports.updateUser = async (req, res) => {
  try {
    const userToUpdate = req.params.id ? await User.findById(req.params.id) : req.user;
    if (!userToUpdate) return errorResponse(res, 404, 'User not found');

    // Handle file upload
    if (req.file) {
      userToUpdate.profilePicture = req.file.secure_url;
      // Cleanup old image if it's not the default
      if (userToUpdate.profilePicture !== process.env.DEFAULT_AVATAR_URL) {
        // Implement Cloudinary deletion if needed
      }
    }

    // Handle password update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(req.body.password, salt);
    }

    // Regular user updates
    if (!req.user.isAdmin) {
      const allowedUpdates = ['username', 'phoneNumber', 'address'];
      allowedUpdates.forEach(field => {
        if (req.body[field]) userToUpdate[field] = req.body[field];
      });
    } else {
      // Admin updates
      const { username, email, phoneNumber, address, isAdmin } = req.body;
      userToUpdate.username = username || userToUpdate.username;
      userToUpdate.email = email || userToUpdate.email;
      userToUpdate.phoneNumber = phoneNumber || userToUpdate.phoneNumber;
      userToUpdate.address = address || userToUpdate.address;
      userToUpdate.isAdmin = isAdmin !== undefined ? isAdmin : userToUpdate.isAdmin;
    }

    await userToUpdate.save();
    
    // Cleanup temporary file
    res.json({
      success: true,
      data: {
        id: userToUpdate._id,
        username: userToUpdate.username,
        email: userToUpdate.email,
        profilePicture: userToUpdate.profilePicture,
        phoneNumber: userToUpdate.phoneNumber,
        address: userToUpdate.address
      }
    });
  } catch (err) {
    errorResponse(res, 400, err.message);
  }
};

// Admin-specific methods
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ 
      success: true, 
      count: users.length,
      data: users 
    });
  } catch (err) {
    errorResponse(res, 500, 'Server error');
  }
};
exports.adminUpdateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');

    // Admins can update all fields except password
    const { username, email, phoneNumber, address, isAdmin } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

    if (req.file) {
      userToUpdate.profilePicture = req.file.secure_url;
    }
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    errorResponse(res, 400, err.message);
  }
};

exports.adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    res.json({ success: true, data: {} });
  } catch (err) {
    errorResponse(res, 500, 'Server error');
  }
};