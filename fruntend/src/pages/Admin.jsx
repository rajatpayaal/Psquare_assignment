// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import api from "../utils/apiService"; // unified api service usage
import AdminDashboard from "../components/AdminDashboard";
import TripTable from "../components/TripTable";
import BookingTable from "../components/BookingTable";
import AddTripModal from "../components/AddTripModal";
import EditBookingModal from "../components/EditBookingModal";

export default function Admin() {
  const [overview, setOverview] = useState({ trips: 0, bookings: 0, departures: 0 });
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null); // trip being edited
  const [editingBooking, setEditingBooking] = useState(null); // booking object for modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [lookupId, setLookupId] = useState(""); // booking id search
  const [lookupLoading, setLookupLoading] = useState(false);

  // Load data for trips and bookings
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const tripsResponse = await api.getTrips();
      console.log("Trips raw response:", tripsResponse);
      const bookingsResponse = await api.getAllBookings();
      console.log("Bookings raw response:", bookingsResponse);

      // Extract trips array regardless of wrapping shape
      const tripsData = Array.isArray(tripsResponse?.trips)
        ? tripsResponse.trips
        : Array.isArray(tripsResponse?.data?.trips)
        ? tripsResponse.data.trips
        : Array.isArray(tripsResponse)
        ? tripsResponse
        : [];

      if (!Array.isArray(tripsData)) {
        console.warn("Trips data is not an array after parsing", tripsResponse);
      }

      // Parse bookings data
      const bookingsData = Array.isArray(bookingsResponse.data)
        ? bookingsResponse.data.map((booking) => ({
            // store original booking for editing convenience
            _raw: booking,
            id: booking._id,
            user: booking.user?.name || "Unknown",
            email: booking.user?.email || "Unknown",
            trip: booking.trip
              ? { from: booking.trip.from, to: booking.trip.to, departureTime: booking.trip.departureTime }
              : null,
            departureTime: booking.trip?.departureTime || booking.createdAt || "N/A",
            seatCodes: Array.isArray(booking.seatCodes) ? booking.seatCodes : [],
            status: booking.status || "Unknown",
            paymentStatus: booking.paymentStatus || "Unknown",
            qrVerified: !!booking.qrVerified,
            totalAmount: booking.totalAmount || 0,
          }))
        : [];

      setTrips(tripsData);
      setBookings(bookingsData);

      // Calculate overview
      const totalDepartures = tripsData.length;
      const totalBookings = bookingsData.length;

      setOverview({
        trips: tripsData.length,
        bookings: totalBookings,
        departures: totalDepartures,
      });
    } catch (err) {
      setError(err.message || "Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


// NEW: delete a booking
const handleDeleteBooking = async (bookingId) => {
  if (!window.confirm("Delete this booking?")) return;
  try {
    await api.deleteBooking(bookingId);
    // Optimistic update
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    setOverview(o => ({ ...o, bookings: Math.max(0, o.bookings - 1) }));
  } catch (err) {
    console.error("Failed to delete booking:", err);
    setError(err.message || "Failed to delete booking. Please try again.");
  }
};

  // Begin editing a booking
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowBookingModal(true);
  };

  // Update booking after modal save
  const handleUpdateBooking = (updated) => {
    if (!updated) return;
    setBookings(prev => prev.map(b => (b.id === updated._id || b.id === updated.id ? {
      ...b,
      status: updated.status,
      paymentStatus: updated.paymentStatus,
      seatCodes: updated.seatCodes,
      qrVerified: updated.qrVerified,
      totalAmount: updated.totalAmount || b.totalAmount,
    } : b)));
  };

  // Admin fetch booking by ID
  const handleFetchBookingById = async (e) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLookupLoading(true);
    setError("");
    try {
      const data = await api.getBooking(lookupId.trim());
      const bk = data?.data || data; // unify
      if (!bk?._id) throw new Error("Booking not found");
      // create shape consistent with loadData mapping
      const shaped = {
        _raw: bk,
        id: bk._id,
        user: bk.user?.name || "Unknown",
        email: bk.user?.email || "Unknown",
        trip: bk.trip ? { from: bk.trip.from, to: bk.trip.to, departureTime: bk.trip.departureTime } : null,
        departureTime: bk.trip?.departureTime || bk.createdAt || "N/A",
        seatCodes: Array.isArray(bk.seatCodes) ? bk.seatCodes : [],
        status: bk.status || "Unknown",
        paymentStatus: bk.paymentStatus || "Unknown",
        qrVerified: !!bk.qrVerified,
        totalAmount: bk.totalAmount || 0,
      };
      setBookings(prev => {
        const exists = prev.some(p => p.id === shaped.id);
        if (exists) return prev.map(p => p.id === shaped.id ? shaped : p);
        return [shaped, ...prev];
      });
    } catch (err) {
      setError(err.message || "Failed to fetch booking");
    } finally {
      setLookupLoading(false);
    }
  };

  // Verify QR (set qrVerified true)
  const handleVerifyBooking = async (bookingId) => {
    try {
      const resp = await api.updateBooking(bookingId, { qrVerified: true });
      const updated = resp?.booking || resp;
      handleUpdateBooking(updated);
    } catch (err) {
      console.error('Failed to verify booking QR:', err);
      setError(err.message || 'Failed to verify QR');
    }
  };

  

  // Handle adding a new trip
  const handleAddTrip = async (tripData) => {
    try {
      console.log("Adding trip:", tripData); // Debugging log
      const response = await api.createTrip(tripData);
      console.log("Trip created successfully:", response);
      // Optimistically append new trip if structure matches
      if (response?.trip?._id) {
        setTrips(prev => [...prev, response.trip]);
        setOverview(o => ({ ...o, trips: o.trips + 1, departures: o.departures + 1 }));
      } else {
        // Fallback reload if unsure
        await loadData();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create trip:", err);
      setError(err.message || "Failed to create trip. Please try again.");
    }
  };
  // Handle deleting a trip
  const handleDeleteTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId); // Call the delete API
      loadData(); // Refresh data after deleting a trip
    } catch (err) {
      console.error("Failed to delete trip:", err);
      setError(err.message || "Failed to delete trip. Please try again.");
    }
  };

  // Start editing a trip
  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setShowModal(true);
  };

  // Save trip updates
  const handleUpdateTrip = async (tripId, updates) => {
    try {
      const response = await api.updateTrip(tripId, updates);
      // Response may return updated trip data directly or wrapped
      const updatedTrip = response?.trip || response;
      setTrips(prev => prev.map(t => (t._id === tripId || t.id === tripId ? { ...t, ...updatedTrip } : t)));
      setEditingTrip(null);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update trip:", err);
      setError(err.message || "Failed to update trip. Please try again.");
    }
  };





  
  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="p-6">Loading admin data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AdminDashboard overview={overview} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trips</h2>
        <button
          onClick={() => setShowModal(true)} // Open the modal
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          + Add Trip
        </button>
      </div>
  <TripTable trips={trips} onDelete={handleDeleteTrip} onEdit={handleEditTrip} />
      <h2 className="text-lg font-semibold mt-6 mb-4">Bookings</h2>
      {/* Booking lookup */}
      <form onSubmit={handleFetchBookingById} className="flex items-center gap-2 mb-4">
        <input
          value={lookupId}
          onChange={e => setLookupId(e.target.value)}
          placeholder="Lookup booking ID"
          className="border rounded px-3 py-1 text-sm"
        />
        <button
          type="submit"
          disabled={lookupLoading}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
        >
          {lookupLoading ? 'Searching...' : 'Find'}
        </button>
      </form>
      <BookingTable 
        bookings={bookings} 
        onDelete={handleDeleteBooking}
        onEdit={handleEditBooking}
        onVerify={handleVerifyBooking}
      />
      {showModal && (
        <AddTripModal
          existingTrip={editingTrip}
          onAdd={handleAddTrip}
            // when adding
          onUpdate={handleUpdateTrip}
            // when editing
          onClose={() => { setShowModal(false); setEditingTrip(null); }}
        />
      )}
      {showBookingModal && editingBooking && (
        <EditBookingModal
          bookingId={editingBooking.id}
          initialBooking={editingBooking._raw}
          onUpdated={handleUpdateBooking}
          onClose={() => { setShowBookingModal(false); setEditingBooking(null); }}
        />
      )}
    </div>
  );
}
