const Trip = require('../models/Trip');
const { ApiError } = require('../utils/helpers');

const seatCode = (index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    const rowLabel = String.fromCharCode('A'.charCodeAt(0) + row);
    return `${rowLabel}${col + 1}`;
};

const createTrip = async (payload) => {
    const { from, to, departureTime, arrivalTime, transportType, pricePerSeat, totalSeats, imageUrl } = payload;
    const seats = Array.from({ length: totalSeats }).map((_, i) => ({ code: seatCode(i), isBooked: false }));
    const trip = new Trip({ from, to, departureTime, arrivalTime, transportType, pricePerSeat, totalSeats, seats, imageUrl });
    await trip.save();
    return trip;
};

const listTrips = async (filters = {}) => {
    const query = {};
    if (filters.from) query.from = { $regex: new RegExp(`^${filters.from}$`, 'i') };
    if (filters.to) query.to = { $regex: new RegExp(`^${filters.to}$`, 'i') };
    if (filters.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);
        query.departureTime = { $gte: start, $lte: end };
    }
    return Trip.find(query);
};

const getTripById = async (id) => {
    const trip = await Trip.findById(id);
    if (!trip) throw new ApiError(404, 'Trip not found');
    return trip;
};

const updateTrip = async (id, payload) => {
    const trip = await Trip.findByIdAndUpdate(id, payload, { new: true });
    if (!trip) throw new ApiError(404, 'Trip not found');
    return trip;
};

const deleteTrip = async (id) => {
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) throw new ApiError(404, 'Trip not found');
    return true;
};

module.exports = { createTrip, listTrips, getTripById, updateTrip, deleteTrip };