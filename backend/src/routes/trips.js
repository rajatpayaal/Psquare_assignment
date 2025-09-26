// filepath: c:\Users\msi\Documents\travelbooking\backend\src\routes\trips.js
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');

// Route to create a new trip (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), validate({
    from: { in: 'body', rules: ['required', 'string'] },
    to: { in: 'body', rules: ['required', 'string'] },
    departureTime: { in: 'body', rules: ['required', 'date'] },
    arrivalTime: { in: 'body', rules: ['required', 'date'] },
    transportType: { in: 'body', rules: [{ enum: ['Flight', 'Train', 'Bus'] }] },
    pricePerSeat: { in: 'body', rules: ['required', 'number', { min: 0 }] },
    totalSeats: { in: 'body', rules: ['required', 'number', { min: 1 }] },
}), tripController.createTrip);

// Route to get all trips (public)
router.get('/', validate({
    from: { in: 'query', rules: [] },
    to: { in: 'query', rules: [] },
    date: { in: 'query', rules: [] },
}), tripController.getAllTrips);

// Route to get a trip by ID (public)
router.get('/:tripId', tripController.getTripById);

// Route to update a trip by ID (admin only)
router.put('/:tripId', authMiddleware, roleMiddleware(['admin']), tripController.updateTrip);

// Route to delete a trip by ID (admin only)
router.delete('/:tripId', authMiddleware, roleMiddleware(['admin']), tripController.deleteTrip);

module.exports = router;