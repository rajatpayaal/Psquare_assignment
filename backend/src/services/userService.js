// jwt aur user model ko import karte hain
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');

// naya user register karne ka function
const registerUser = async ({ name, email, password, phone, role ='user'}) => {
    const exists = await User.findOne({ email }); // check karo ki email already registered hai ya nahi
    if (exists) throw new ApiError(409, 'Email already registered'); // agar email registered hai toh error throw karo
    const user = new User({ name, email, password, phone, role }); // naya user create karo
    await user.save(); // user ko database mein save karo
    return user;
};

// user login karne ka function
const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }); // email ke basis par user ko find karo
    if (!user) throw new ApiError(401, 'Invalid credentials'); // agar user nahi mila toh error throw karo
    const ok = await user.comparePassword(password); // password verify karo
    if (!ok) throw new ApiError(401, 'Invalid credentials'); // agar password galat hai toh error throw karo
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // jwt token generate karo
    return { token };
};

const Booking = require('../models/Booking');

// user ka profile fetch karne ka function
const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password'); // user ko id ke basis par fetch karo
    if (!user) throw new ApiError(404, 'User not found'); // agar user nahi mila toh error throw karo
    // user ke stats calculate karo
    const bookings = await Booking.find({ user: userId });
    const totalBookings = bookings.length; // total bookings count karo
    const totalSpent = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0); // total spent calculate karo
    return { ...user.toObject(), stats: { totalBookings, totalSpent, loyaltyPoints: user.loyaltyPoints || 0 } };
};

// user ka profile update karne ka function
const updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId); // user ko id ke basis par fetch karo
    if (!user) throw new ApiError(404, 'User not found'); // agar user nahi mila toh error throw karo
    
    // check karo ki email update ho raha hai aur woh already registered hai ya nahi
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) throw new ApiError(409, 'Email already registered');
    }
    
    // sirf provided fields ko update karo
    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            user[key] = updateData[key];
        }
    });
    
    await user.save(); // updated user ko save karo
    return user.select('-password');
};

// default admin user create karne ka function
const seedAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminPhone = process.env.ADMIN_PHONE || '0000000000';

    const exists = await User.findOne({ email: adminEmail }); // check karo ki admin user already exist karta hai ya nahi
    if (!exists) {
        const adminUser = new User({ name: adminName, email: adminEmail, password: adminPassword, phone: adminPhone, role: 'admin' });
        await adminUser.save(); // admin user ko save karo
        console.log('Default admin user created:', adminEmail);
    } else {
        console.log('Default admin user already exists:', adminEmail);
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, seedAdminUser };

// password change karne ka function
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId); // user ko id ke basis par fetch karo
    if (!user) throw new ApiError(404, 'User not found'); // agar user nahi mila toh error throw karo
    const match = await user.comparePassword(oldPassword); // old password verify karo
    if (!match) throw new ApiError(401, 'Old password incorrect'); // agar old password galat hai toh error throw karo
    user.password = newPassword; // naya password set karo (yeh pre-save hook ke through hash hoga)
    await user.save(); // user ko save karo
    return true;
};

module.exports.changePassword = changePassword;