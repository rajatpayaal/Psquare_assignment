// filepath: c:\Users\msi\Documents\travelbooking\backend\src\routes\bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');

// Create a new booking (user only)
router.post('/', authMiddleware, roleMiddleware(['user','admin']), validate({
    tripId: { in: 'body', rules: ['required', 'string'] },
    seatCodes: { in: 'body', rules: ['required'] },
}), bookingController.createBooking);

// Retrieve all bookings (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), bookingController.getAllBookings);

// Retrieve a specific booking by ID (user or admin)
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Update / cancel a booking by ID (user for own, admin any)
router.put('/:id', authMiddleware, roleMiddleware(['user','admin']), validate({
    status: { in: 'body', rules: [{ enum: ['pending', 'confirmed', 'cancelled'] }] },
}), bookingController.updateBooking);

// Delete a booking by ID (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), bookingController.deleteBooking);

// Get my bookings (upcoming and past) - allow user & admin (admin sees only their own when using this route)
router.get('/me/list', authMiddleware, roleMiddleware(['user','admin']), bookingController.getMyBookings);

// Get ticket details (admin can view their own tickets; separate admin-wide view could be added later)
router.get('/:id/ticket', authMiddleware, roleMiddleware(['user','admin']), bookingController.getTicket);

// Get ticket PDF (user & admin)
router.get('/:id/ticket.pdf', authMiddleware, roleMiddleware(['user','admin']), bookingController.getTicketPdf);

module.exports = router;