// filepath: c:\Users\msi\Documents\travelbooking\backend\src\models\User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    isActive: { type: Boolean, default: true },
    loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password helper
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);