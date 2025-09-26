const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');

// Create payment and confirm booking
router.post('/', authMiddleware, validate({
    bookingId: { in: 'body', rules: ['required', 'string'] },
    method: { in: 'body', rules: ['required', { enum: ['card', 'wallet'] }] },
}), paymentController.createPayment);

// Get payment by booking id
router.get('/by-booking/:bookingId', authMiddleware, paymentController.getPaymentByBookingId);

module.exports = router;