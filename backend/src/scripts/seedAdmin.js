// load environment variables from .env file
require('dotenv').config();
// import mongoose for database connection
const mongoose = require('mongoose');
// import user model to create or check admin user
const User = require('../models/User');

// main function to seed admin user
const run = async () => {
    try {
        // get database uri from environment variables
        const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
        if (!uri) throw new Error('DATABASE_URL or MONGO_URI not set');
        // connect to the database
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // get admin details from environment variables or use defaults
        const email = process.env.ADMIN_EMAIL || 'admin@travelbooking.com';
        const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
        const name = process.env.ADMIN_NAME || 'Admin';
        const phone = process.env.ADMIN_PHONE || '0000000000';

        // check if admin user already exists
        let user = await User.findOne({ email });
        if (!user) {
            // create new admin user if not found
            user = new User({ name, email, password, phone, role: 'admin' });
            await user.save();
            console.log('Admin user created:', email);
        } else {
            console.log('Admin user already exists:', email);
        }
        // disconnect from the database
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        // log error and exit process with failure
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
};

// execute the main function
run();