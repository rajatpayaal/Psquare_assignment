const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const tripRoutes = require('./routes/trips');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/helpers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});