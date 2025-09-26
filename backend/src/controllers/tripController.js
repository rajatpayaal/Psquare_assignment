const { asyncHandler, ok } = require('../utils/helpers');
const tripService = require('../services/tripService');

// Create a new trip
exports.createTrip = asyncHandler(async (req, res) => {
    const trip = await tripService.createTrip(req.body);
    return ok(res, { message: 'Trip created successfully', trip }, 201);
});

// Get all trips
exports.getAllTrips = asyncHandler(async (req, res) => {
    const { from, to, date } = req.query;
    const trips = await tripService.listTrips({ from, to, date });
    // Wrap trips array in an object so ok() spreads a plain object not array indices
    return ok(res, { trips });
});

// Get a trip by ID
exports.getTripById = asyncHandler(async (req, res) => {
    const trip = await tripService.getTripById(req.params.tripId || req.params.id);
    return ok(res, trip);
});

// Update a trip
exports.updateTrip = asyncHandler(async (req, res) => {
    const trip = await tripService.updateTrip(req.params.tripId || req.params.id, req.body);
    return ok(res, { message: 'Trip updated successfully', trip });
});

// Delete a trip
exports.deleteTrip = asyncHandler(async (req, res) => {
    await tripService.deleteTrip(req.params.tripId || req.params.id);
    return ok(res, { message: 'Trip deleted successfully' });
});