// filepath: c:\Users\msi\Documents\travelbooking\backend\src\controllers\userController.js
const { asyncHandler, ok } = require('../utils/helpers');
const userService = require('../services/userService');

// User registration (public)
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    await userService.registerUser({ name, email, password, phone, role });
    return ok(res, { message: 'User registered successfully' }, 201);
});

// User login (public)
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { token } = await userService.loginUser({ email, password });
    return ok(res, { message: 'Login successful', token });
});

// Get user profile (user only)
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.userId);
    return ok(res, user);
});

// Update user profile (user only)
exports.updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateUserProfile(req.userId, req.body);
    return ok(res, updatedUser);
});

// Change password (user only)
exports.changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'Old and new password required' });
    await userService.changePassword(req.userId, oldPassword, newPassword);
    return ok(res, { message: 'Password changed successfully' });
});