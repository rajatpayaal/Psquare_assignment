import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/apiService.js';
import { useAuth } from '../store/authContext.jsx';

// Mock API service - replace with your actual API
const mockApi = {
  getTrips: () => Promise.resolve({
    trips: [
      {
        _id: 'T001',
        from: 'London',
        to: 'Paris',
        departureTime: '2024-10-01T06:00:00Z',
        arrivalTime: '2024-10-01T16:00:00Z',
        transportType: 'Flight',
        pricePerSeat: 70,
        totalSeats: 50,
        imageUrl: ''
      },
      {
        _id: 'T002',
        from: 'Berlin',
        to: 'Munich',
        departureTime: '2024-10-02T08:30:00Z',
        arrivalTime: '2024-10-02T15:00:00Z',
        transportType: 'Train',
        pricePerSeat: 120,
        totalSeats: 50,
        imageUrl: ''
      },
      {
        _id: 'T003',
        from: 'Rome',
        to: 'Florence',
        departureTime: '2024-10-03T10:00:00Z',
        arrivalTime: '2024-10-03T13:00:00Z',
        transportType: 'Bus',
        pricePerSeat: 45,
        totalSeats: 60,
        imageUrl: ''
      }
    ]
  }),
  getAllBookings: () => Promise.resolve([
    {
      _id: 'B1001',
      user: { name: 'Alice Smith' },
      trip: { from: 'London', to: 'Paris', departureTime: '2024-07-26T06:00:00Z' },
      seatCodes: ['A1', 'A2'],
      status: 'confirmed'
    },
    {
      _id: 'B1002',
      user: { name: 'Bob Johnson' },
      trip: { from: 'Rome', to: 'Florence', departureTime: '2024-07-24T10:00:00Z' },
      seatCodes: ['C5'],
      status: 'pending'
    },
    {
      _id: 'B1003',
      user: { name: 'Charlie Brown' },
      trip: { from: 'Berlin', to: 'Munich', departureTime: '2024-07-30T08:30:00Z' },
      seatCodes: ['F13', 'F14', 'F15'],
      status: 'confirmed'
    }
  ]),
  createTrip: (data) => Promise.resolve(data),
  updateBooking: (id, data) => Promise.resolve(data)
};

export default function AdminPanel() {
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Removed unused state variable
  const [showTripModal, setShowTripModal] = useState(false);
  const [activeTab, setActiveTab] = useState('trips');
  const [showDialog, setShowDialog] = useState(true);
  const [form, setForm] = useState({ 
  // Removed unused state variable
    to: '', 
    departureTime: '', 
    arrivalTime: '', 
    transportType: 'Flight', 
    pricePerSeat: '', 
    totalSeats: '', 
    imageUrl: '' 
  });

  const loadTrips = async () => {
    try {
      const tripsData = await mockApi.getTrips();
      setTrips(tripsData.trips || tripsData);
    } catch (err) {
      setError('Failed to load trips');
      console.error('Error loading trips:', err);
    }
  };

  const loadBookings = async () => {
    try {
      const bookingsData = await mockApi.getAllBookings();
      setBookings(bookingsData);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    }
  };

  const load = async () => {
    setLoading(true);
    await Promise.all([loadTrips(), loadBookings()]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!form.from || !form.to || !form.departureTime || !form.arrivalTime || !form.pricePerSeat || !form.totalSeats) {
        setError('Please fill in all required fields');
        return;
      }

      if (new Date(form.departureTime) >= new Date(form.arrivalTime)) {
        setError('Arrival time must be after departure time');
        return;
      }

      if (form.pricePerSeat <= 0 || form.totalSeats <= 0) {
        setError('Price and total seats must be greater than 0');
        return;
      }

      await mockApi.createTrip({
        ...form,
        pricePerSeat: Number(form.pricePerSeat),
        totalSeats: Number(form.totalSeats)
      });
      
      setForm({ 
        from: '', 
        to: '', 
        departureTime: '', 
        arrivalTime: '', 
        transportType: 'Flight', 
        pricePerSeat: '', 
        totalSeats: '', 
        imageUrl: '' 
      });
      setShowTripModal(false);
      loadTrips();
    } catch (err) {
      setError('Failed to create trip');
      console.error('Error creating trip:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const removeTrip = async (id) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await mockApi.deleteTrip(id);
      loadTrips();
    } catch (err) {
      setError('Failed to delete trip');
      console.error('Error deleting trip:', err);
    }
  // Removed unused function

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await mockApi.updateBooking(bookingId, { status });
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Flight': return '✈️';
      case 'Train': return '🚂';
      case 'Bus': return '🚌';
      default: return '🚗';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-lg p-2 mr-3">
                <span className="text-lg font-bold">Argo</span>
              </div>
              <nav className="flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">My Bookings</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
                <a href="#" className="text-blue-600 font-medium">Admin</a>
              </nav>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Admin Access Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Admin Access</h3>
            <p className="text-gray-600 mb-4">
              You are accessing the admin panel. Please proceed with caution as changes here affect the entire system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
              >
                Proceed
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-500 text-white rounded-lg py-2 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Admin Overview</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-2xl">✈️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                <p className="text-sm text-gray-600">Total Trips</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(trip => new Date(trip.departureTime) > new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Upcoming Departures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Management Section */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Trip Management</h2>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  All Trips
                </button>
                <button
                  onClick={() => setShowTripModal(true)}
                  className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  + Add New Trip
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Route</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Departure</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Arrival</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Seats</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip, index) => (
                  <tr key={trip._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">T{String(index + 1).padStart(3, '0')}</td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-2">
                        {getTransportIcon(trip.transportType)}
                        {trip.transportType}
                      </span>
                    </td>
                    <td className="py-4 px-6">{trip.from} to {trip.to}</td>
                    <td className="py-4 px-6">{new Date(trip.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="py-4 px-6">{new Date(trip.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="py-4 px-6">${trip.pricePerSeat}.00</td>
                    <td className="py-4 px-6">{trip.totalSeats}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <span className="text-lg">✏️</span>
                        </button>
                        <button 
                          onClick={() => removeTrip(trip._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Management Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Booking Management</h2>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  All Bookings
                </button>
                <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  📱 Verify QR
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Booking ID</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Trip Route</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Seats</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">QR Verified</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">B{String(index + 1001)}</td>
                    <td className="py-4 px-6">{booking.user?.name || 'Unknown User'}</td>
                    <td className="py-4 px-6">{booking.trip?.from} to {booking.trip?.to}</td>
                    <td className="py-4 px-6">{new Date(booking.trip?.departureTime).toLocaleDateString()}</td>
                    <td className="py-4 px-6">{booking.seatCodes?.join(', ')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {booking.status === 'confirmed' ? (
                        <span className="text-green-600 text-lg">✅</span>
                      ) : (
                        <span className="text-gray-400 text-lg">⭕</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <span className="text-lg">✏️</span>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Trip Details</h3>
            
{error && (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-red-600 text-sm">{error}</p>
  </div>
)}

<form onSubmit={addTrip}>
  <div>
    <label className="block text-sm font-medium mb-1">Price Per Seat</label>
    <input
      type="number"
      min="1"
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="95"
      value={form.pricePerSeat}
      onChange={(e) => setForm({ ...form, pricePerSeat: e.target.value })}
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Total Seats</label>
    <input
      type="number"
      min="1"
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="50"
      value={form.totalSeats}
      onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
      required
    />
  </div>

              <div>
                <label className="block text-sm font-medium mb-1">Transport Type</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.transportType}
                  onChange={(e) => setForm({...form, transportType: e.target.value})}
                >
                  <option value="Flight">Flight</option>
                  <option value="Train">Train</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="flex-1 bg-gray-500 text-white rounded-lg py-2 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
                >
                  {submitting ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Safety Guidelines</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t">
            © 2024 TravelPro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
}