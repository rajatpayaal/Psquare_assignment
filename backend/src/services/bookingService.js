// booking model aur trip model ko import karte hain
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { ApiError } = require('../utils/helpers');

// nayi booking create karne ka function
const createBooking = async ({ userId, tripId, seatCodes }) => {
    const trip = await Trip.findById(tripId); // trip ko database se fetch karo
    if (!trip) throw new ApiError(404, 'Trip not found'); // agar trip nahi mila toh error throw karo
    const available = trip.getAvailableSeatCodes(); // available seats ko fetch karo
    const invalid = seatCodes.filter((s) => !available.includes(s)); // invalid seats ko filter karo
    if (invalid.length) throw new ApiError(400, 'Some seats are not available', { invalid });

    // seats ko update karo aur trip ko save karo
    trip.seats = trip.seats.map((s) => ({ ...s.toObject(), isBooked: s.isBooked || seatCodes.includes(s.code) }));
    await trip.save();
    const totalAmount = seatCodes.length * trip.pricePerSeat; // total amount calculate karo
    const booking = new Booking({ user: userId, trip: trip._id, seatCodes, totalAmount, status: 'pending' });
    await booking.save(); // booking ko save karo
    return booking;
};

// sabhi bookings ko list karne ka function
const listAllBookings = async () => {
    return Booking.find().populate('user trip');
};

// ek specific booking ko id ke basis par fetch karo
const getBookingById = async (id) => {
    const booking = await Booking.findById(id).populate('user trip');
    if (!booking) throw new ApiError(404, 'Booking not found');
    return booking;
};

// booking ko update ya cancel karne ka function
const updateBooking = async (id, payload, actingUser) => {
    const booking = await Booking.findById(id).populate('trip');
    if (!booking) throw new ApiError(404, 'Booking not found');

    // sirf pending bookings ko cancel karne ki permission hai
    if (payload.status && payload.status === 'cancelled') {
        if (booking.status !== 'pending') {
            throw new ApiError(400, 'Only pending bookings can be cancelled');
        }
        // authorization check: user apni booking cancel kar sakta hai, admin kisi bhi booking ko cancel kar sakta hai
        if (actingUser.role !== 'admin' && String(booking.user) !== actingUser.id) {
            throw new ApiError(403, 'Not authorized to cancel this booking');
        }
        // seats ko available status mein wapas karo
        if (booking.trip) {
            const trip = await Trip.findById(booking.trip._id);
            trip.seats = trip.seats.map(s => (
                booking.seatCodes.includes(s.code) ? { ...s.toObject(), isBooked: false } : s
            ));
            await trip.save();
        }
        booking.status = 'cancelled';
        booking.paymentStatus = booking.paymentStatus === 'paid' ? 'paid' : 'unpaid'; // agar payment ho chuka hai toh status paid rakho
        await booking.save();
        return booking;
    }

    // user directly status ko confirmed nahi kar sakta
    if (payload.status && payload.status === 'confirmed' && actingUser.role !== 'admin') {
        throw new ApiError(400, 'Status cannot be set to confirmed manually');
    }

    Object.assign(booking, payload); // payload ke data ko booking mein update karo
    await booking.save();
    return booking;
};

// booking ko delete karne ka function
const deleteBooking = async (id) => {
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) throw new ApiError(404, 'Booking not found');
    return true;
};

// user ki upcoming aur past bookings ko fetch karo
const getMyBookings = async (userId) => {
    const now = new Date();
    const bookings = await Booking.find({ user: userId }).populate('trip');
    const upcoming = bookings.filter((b) => b.trip && b.trip.departureTime > now);
    const past = bookings.filter((b) => b.trip && b.trip.departureTime <= now);
    return { upcoming, past };
};

// admin ya user ke liye bookings fetch karo
const getAllBookings = async (user) => {
    let bookings;

    if (user.role === 'admin') {
        // agar user admin hai toh sabhi bookings fetch karo
        bookings = await Booking.find().populate('user trip');
    } else {
        // agar user admin nahi hai toh sirf apni bookings fetch karo
        bookings = await Booking.find({ user: user.id }).populate('trip');
    }

    return bookings;
};

// ticket ke data ko fetch karo
const getTicketData = async (bookingId, userId) => {
    const booking = await Booking.findOne({ _id: bookingId, user: userId }).populate('trip user');
    if (!booking) throw new ApiError(404, 'Booking not found');
    const trip = booking.trip;
    return {
        bookingId: String(booking._id),
        status: booking.status,
        seatCodes: booking.seatCodes,
        totalAmount: booking.totalAmount,
        bookedAt: booking.createdAt,
        user: {
            id: String(booking.user._id),
            name: booking.user.name,
            email: booking.user.email,
        },
        trip: {
            id: String(trip._id),
            from: trip.from,
            to: trip.to,
            departureTime: trip.departureTime,
            arrivalTime: trip.arrivalTime,
            transportType: trip.transportType,
            pricePerSeat: trip.pricePerSeat,
        },
    };
};

// sabhi functions ko export karo
module.exports = { createBooking, listAllBookings, getBookingById, updateBooking, deleteBooking, getMyBookings, getTicketData,getAllBookings};