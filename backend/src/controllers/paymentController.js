// filepath: c:\Users\msi\Documents\travelbooking\backend\src\controllers\paymentController.js
const { asyncHandler, ok } = require('../utils/helpers');
const paymentService = require('../services/paymentService');

// Create a new payment
exports.createPayment = asyncHandler(async (req, res) => {
    const { bookingId, method, cardDetails, walletProvider } = req.body;
    const payment = await paymentService.createPayment({ userId: req.userId, bookingId, method, cardDetails, walletProvider });
    return ok(res, { message: 'Payment successful', payment }, 201);
});

// Retrieve payment details by booking ID
exports.getPaymentByBookingId = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const payment = await paymentService.getPaymentByBookingId(bookingId);
    return ok(res, payment);
});