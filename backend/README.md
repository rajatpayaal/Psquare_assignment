# Booking Management System

## Overview
This project is a booking management system built with Node.js and Express. It allows users to book trips, manage payments, and handle user registrations. Admins can create and manage trips, while users can view and book available trips.

## Features
- User registration and authentication
- Trip management (create, update, retrieve)
- Booking management (create, update, retrieve)
- Payment processing and management

## Technologies Used
- Node.js
- Express
- MongoDB (with Mongoose)
- dotenv
- bcryptjs

## Project Structure
```
booking-management-system
├── src
│   ├── app.js
│   ├── routes
│   ├── models
│   ├── controllers
│   ├── middlewares
│   ├── config
│   └── utils
├── package.json
├── .env
├── .gitignore
└── README.md
```

## Setup Instructions
1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root with:
   - MONGO_URI (e.g. mongodb://localhost:27017/booking_management_system)
   - JWT_SECRET (strong secret)
   - PORT (default 5000)
   - NODE_ENV (development)
   - ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_PHONE (for default admin)
3. Run the server:
   ```
   npm run dev
   ```
   Or production:
   ```
   npm start
   ```
4. Seed an admin user (optional):
   ```
   npm run seed:admin
   ```

### Admin login
- Endpoint: `POST /api/users/admin/login`
- Body:
  ```json
  { "email": "<ADMIN_EMAIL>", "password": "<ADMIN_PASSWORD>" }
  ```
- Behavior: The route authenticates against the database and requires the user role to be `admin`. If no admin exists yet but the provided credentials match your `.env` defaults, it will create the admin on the fly and then log in.

### Quick test (Windows PowerShell)
1. Start backend:
   ```powershell
   npm run dev
   ```
2. In another PowerShell window, test admin login (replace with your env values):
   ```powershell
   $body = @{ email = "$env:ADMIN_EMAIL"; password = "$env:ADMIN_PASSWORD" } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri "http://localhost:$env:PORT/api/users/admin/login" -ContentType 'application/json' -Body $body
   ```
3. Use the returned token for admin endpoints (example: list bookings):
   ```powershell
   $token = (Invoke-RestMethod -Method Post -Uri "http://localhost:$env:PORT/api/users/admin/login" -ContentType 'application/json' -Body $body).token
   Invoke-RestMethod -Method Get -Headers @{ Authorization = "Bearer $token" } -Uri "http://localhost:$env:PORT/api/bookings"
   ```

## API Usage
### User Routes
- **POST /api/users/register**: Register a new user
- **POST /api/users/login**: User login
- **GET /api/users/profile**: Get user profile (requires authentication)

### Trip Routes
- **GET /api/trips?from=&to=&date=**: List trips with filters
- **POST /api/trips**: Create a new trip (admin only)
- **PUT /api/trips/:tripId**: Update trip (admin only)
- **DELETE /api/trips/:tripId**: Delete trip (admin only)
- **GET /api/trips/:tripId**: Retrieve a specific trip by ID

### Booking Routes
- **POST /api/bookings**: Create a new booking (user)
- **GET /api/bookings**: Retrieve all bookings (admin)
- **GET /api/bookings/me/list**: Upcoming & past bookings (user)
- **GET /api/bookings/:id**: Retrieve a specific booking by ID
- **GET /api/bookings/:id/ticket**: Ticket JSON (user)
- **GET /api/bookings/:id/ticket.pdf**: Ticket PDF (user)

### Payment Routes
- **POST /api/payments**: Process a new payment
- **GET /api/payments/by-booking/:bookingId**: Retrieve payment by booking

### Health
- **GET /api/health**: Health check

## License
This project is licensed under the MIT License.