const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');

const createPayment = async ({ userId, bookingId, method, cardDetails, walletProvider }) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    const payment = new Payment({
        booking: booking._id,
        user: userId,
        method,
        cardDetails,
        walletProvider,
        amount: booking.totalAmount,
        status: 'completed',
        transactionId: `TXN_${Math.random().toString(36).substr(2, 9)}`,
    });
    await payment.save();
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();
    // Loyalty: 1 point per $10 spent (rounded down)
    const user = await User.findById(userId);
    if (user) {
        const points = Math.floor(booking.totalAmount / 10);
        user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
        await user.save();
    }
    return payment;
};

const getPaymentByBookingId = async (bookingId) => {
    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment) throw new ApiError(404, 'Payment not found');
    return payment;
};

module.exports = { createPayment, getPaymentByBookingId };