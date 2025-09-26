// import helpers and booking service
const { asyncHandler, ok } = require('../utils/helpers');
const bookingService = require('../services/bookingService');
const Booking = require('../models/Booking');

// create a new booking
exports.createBooking = asyncHandler(async (req, res) => {
    const { tripId, seatCodes } = req.body;
    const booking = await bookingService.createBooking({ userId: req.userId, tripId, seatCodes });
    return ok(res, { message: 'Booking created. Proceed to payment.', booking }, 201);
});

// retrieve all bookings (admin only)
exports.getAllBookings = asyncHandler(async (req, res) => {
    // check if user is admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    // sabhi bookings ko database se fetch karo
    // user aur 'trip' ki details ko include karo taaki user aur trip ka info dikh sake
    // user se sirf name aur email' ko include karo
    // trip se from, 'to', departureTime', 'arrivalTime, aur transportType' ko include karo
    // bookings ko 'createdAt' ke hisaab se latest se oldest order mein sort karo
    const bookings = await Booking.find()
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'trip', select: 'from to departureTime arrivalTime transportType' })
        .sort({ createdAt: -1 });

    // bookings ko successfully fetch karne ke baad, unhe json format mein response ke roop mein bhejo
    return res.status(200).json({ success: true, data: bookings });
});

// retrieve a specific booking by id (user can view own, admin can view all)
exports.getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Booking ID is required' });

    // populate trip & user so frontend can show full summary
    const booking = await Booking.findById(id)
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'trip', select: 'from to departureTime arrivalTime transportType pricePerSeat' });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // authorization: non admin can only access their own booking
    if (req.userRole !== 'admin' && String(booking.user?._id || booking.user) !== req.userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ success: true, data: booking });
});

// update or cancel a booking by id
exports.updateBooking = asyncHandler(async (req, res) => {
    const actingUser = { id: req.userId, role: req.userRole };
    const updatedBooking = await bookingService.updateBooking(req.params.id, req.body, actingUser);
    return ok(res, { message: 'Booking updated successfully', booking: updatedBooking });
});

// delete a booking by id
exports.deleteBooking = asyncHandler(async (req, res) => {
    await bookingService.deleteBooking(req.params.id);
    return ok(res, { message: 'Booking deleted successfully' });
});

// get my bookings (upcoming and past)
exports.getMyBookings = asyncHandler(async (req, res) => {
    const data = await bookingService.getMyBookings(req.userId);
    return ok(res, data);
});

// get ticket details
exports.getTicket = asyncHandler(async (req, res) => {
    const data = await bookingService.getTicketData(req.params.id, req.userId);
    return ok(res, { ticket: data });
});

// get ticket pdf
exports.getTicketPdf = asyncHandler(async (req, res) => {
    const data = await bookingService.getTicketData(req.params.id, req.userId);
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=ticket-${data.bookingId}.pdf`);
    doc.pipe(res);
    doc.fontSize(20).text('Travel Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Booking ID: ${data.bookingId}`);
    doc.text(`Status: ${data.status}`);
    doc.text(`Booked At: ${new Date(data.bookedAt).toLocaleString()}`);
    doc.moveDown();
    doc.text(`Passenger: ${data.user.name} (${data.user.email})`);
    doc.moveDown();
    doc.text(`From: ${data.trip.from}`);
    doc.text(`To: ${data.trip.to}`);
    doc.text(`Departure: ${new Date(data.trip.departureTime).toLocaleString()}`);
    doc.text(`Arrival: ${new Date(data.trip.arrivalTime).toLocaleString()}`);
    doc.text(`Transport: ${data.trip.transportType}`);
    doc.moveDown();
    doc.text(`Seats: ${data.seatCodes.join(', ')}`);
    doc.text(`Total Paid: $${data.totalAmount}`);
    doc.end();
});