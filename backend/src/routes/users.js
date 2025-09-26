const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const User = require('../models/User');

// User registration (public)
router.post('/register', validate({
    name: { in: 'body', rules: ['required', 'string'] },
    email: { in: 'body', rules: ['required', 'email'] },
    password: { in: 'body', rules: ['required', 'string'] },
    phone: { in: 'body', rules: ['required', 'string'] },
    role: { in: 'body', rules: [{ enum: ['user', 'admin'] }] },
}), userController.register);

// User login (public)
router.post('/login', validate({
    email: { in: 'body', rules: ['required', 'email'] },
    password: { in: 'body', rules: ['required', 'string'] },
}), userController.login);

// Get user profile (user only)
router.get('/profile', authMiddleware, roleMiddleware(['user','admin']), userController.getProfile);

// Update user profile (user only)
router.put('/profile', authMiddleware, roleMiddleware(['user','admin']), validate({
    name: { in: 'body', rules: ['string'] },
    email: { in: 'body', rules: ['email'] },
    phone: { in: 'body', rules: ['string'] },
}), userController.updateProfile);

// Change password
router.post('/change-password', authMiddleware, roleMiddleware(['user','admin']), validate({
    oldPassword: { in: 'body', rules: ['required', 'string'] },
    newPassword: { in: 'body', rules: ['required', 'string'] },
}), userController.changePassword);

// Default admin login (public)
router.post('/admin/login', validate({
    email: { in: 'body', rules: ['required', 'email'] },
    password: { in: 'body', rules: ['required', 'string'] },
}), async (req, res) => {
    try {
        const { email, password } = req.body;

        // try to find an admin with the provided email
        let admin = await User.findOne({ email });

        // if not found but credentials match the default .env admin, bootstrap it
        const isDefaultAdmin = (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD);
        if (!admin && isDefaultAdmin) {
            admin = new User({
                name: process.env.ADMIN_NAME || 'Admin User',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                phone: process.env.ADMIN_PHONE || '0000000000',
                role: 'admin',
            });
            await admin.save();
        }

        // if still not found, invalid credentials
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // ensure role is admin
        if (admin.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied: not an admin account' });
        }

        // verify password against hashed password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // sign token with real user id and role so roleMiddleware works
        const token = jwt.sign({ id: admin._id.toString(), role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ success: true, message: 'Admin login successful', token });
    } catch (err) {
        console.error('Admin login error:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;