Here’s a clean **README.md** draft for your MERN Stack Assignment project (without icons):

---
#admin login : 
# rajat@gmail.com
# rajat@123
# MERN Stack Assignment – HRMS Dashboard

This project is part of the hiring process at **PSQUARE COMPANY**. It demonstrates a full-stack application built using **MongoDB, Express.js, React, and Node.js** with JWT-based authentication, role-based authorization, and trip booking management.

---

## Features

### Authentication & Authorization

* JWT-based login and protected routes.
* Role-based access:

  * **User**: Book trips, manage profile and bookings.
  * **Admin**: Add, edit, and delete trips (optionally manage users/bookings).

### Home Page

* Dynamic display of available trips.
* Search and filter trips by source, destination, and date.
* Booking flow includes trip details, seat selection, checkout/payment, and ticket generation.

### My Bookings Page

* Restricted to logged-in users.
* Sections for upcoming and past bookings.
* Displays trip info, seat numbers, booking status, and option to view/cancel tickets.

### Profile Page

* Accessible only to authenticated users.
* Displays user info (name, email, account creation date).

### Admin Panel

* Restricted to admins.
* Add new trips with source, destination, date/time, seats, and price.
* Manage trips: view, edit, delete.

---

## Technical Stack

* **Frontend**: React (with React Router, Context API/Redux for state management).
* **Backend**: Node.js + Express.js.
* **Database**: MongoDB.
* **Authentication**: JWT.
* **Styling**: Vanilla CSS (for one section) + modern CSS practices for the rest.

---

## Evaluation Criteria

* State management.
* Responsiveness.
* Error handling.
* HTML/CSS structure.
* Routing and navigation.
* Reusability of components.
* Clean folder structure.

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies for both backend and frontend:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Create a `.env` file in both backend and frontend with required configurations:

   * Backend:

     ```
     PORT=5000
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret-key>
     ```
   * Frontend:

     ```
     VITE_API_BASE=http://localhost:5000/api
     ```

4. Run the backend server:

   ```bash
   cd backend
    npm run dev
   ```

5. Run the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

6. Open the application at:

   ```
   http://localhost:5173
   ```

---

Do you want me to also make a **short version README (just summary + setup)** for quick repo viewing, or keep only this detailed one?
