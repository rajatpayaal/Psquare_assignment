// filepath: c:\Users\msi\Documents\travelbooking\backend\src\models\Trip.js
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    code: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
}, { _id: false });

const tripSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    transportType: { type: String, enum: ['Flight', 'Train', 'Bus'], default: 'Flight' },
    pricePerSeat: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    seats: { type: [seatSchema], default: [] },
    imageUrl: { type: String }
}, { timestamps: true });

tripSchema.methods.getAvailableSeatCodes = function() {
    return this.seats.filter(s => !s.isBooked).map(s => s.code);
};

module.exports = mongoose.model('Trip', tripSchema);