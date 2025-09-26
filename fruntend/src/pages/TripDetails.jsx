import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/apiService'; // Import the real API service

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mock authentication - in real app this would come from useAuth()
  const [isAuthenticated] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const tripData = await api.getTrip(id); // Use the real API to fetch trip details
        console.log('Fetched trip data:', tripData);
        setTrip(tripData._doc);
      } catch (err) {
        setError('Failed to load trip details');
        console.error('Error loading trip:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const toggleSeatSelection = (seatCode) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatCode);
      if (isSelected) {
        return prev.filter((code) => code !== seatCode);
      } else {
        return [...prev, seatCode];
      }
    });
    setError(''); // Clear any previous errors
  };

  const confirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      
      const payload = { 
        tripId: id, 
        seatCodes: selectedSeats 
      };
      
      console.log('Submitting booking with payload:', payload);
      const bookingResponse = await api.createBooking(payload); // Use the real API to create a booking
      
      const bookingId = bookingResponse?.booking?._id || bookingResponse?._id;
      console.log('Booking response:', bookingResponse, 'Extracted bookingId:', bookingId);
      if (bookingId) {
        // Navigate to checkout page
        console.log('Navigating to checkout with bookingId:', bookingId);
        navigate(`/checkout/${bookingId}`);
        console.log('Navigating to checkout with bookingId:', bookingId);
      } else {
        throw new Error('Invalid booking response');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Trip not found</p>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const availableSeats = trip.seats || [];
  const totalPrice = selectedSeats.length * trip.pricePerSeat;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Trip Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">{trip.from} → {trip.to}</h1>
          <div className="flex items-center gap-4 text-blue-100">
            <span>{trip.transportType}</span>
            <span>•</span>
            <span>{new Date(trip.departureTime).toLocaleDateString()}</span>
            <span>•</span>
            <span>${trip.pricePerSeat} per seat</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{trip.from}</div>
              <div className="text-lg font-semibold text-blue-600 mt-1">
                {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-600">Departure</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">✈</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatDuration(trip.departureTime, trip.arrivalTime)}
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{trip.to}</div>
              <div className="text-lg font-semibold text-blue-600 mt-1">
                {new Date(trip.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-600">Arrival</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Select Your Seats</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border-2 border-red-300 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-center text-sm text-gray-600 mb-4 font-medium">
            Front of Aircraft
          </div>
          <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
            {availableSeats.map((seat) => (
              <button
                key={seat.code}
                disabled={seat.isBooked}
                onClick={() => toggleSeatSelection(seat.code)}
                className={`
                  aspect-square border-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${seat.isBooked
                    ? 'bg-red-200 border-red-300 text-red-600 cursor-not-allowed opacity-60'
                    : selectedSeats.includes(seat.code)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md'
                  }
                `}
              >
                {seat.code}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        {selectedSeats.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-900 mb-2">Booking Summary</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Selected Seats:</span>
                <div className="font-bold text-blue-900">{selectedSeats.join(', ')}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Number of Passengers:</span>
                <div className="font-bold text-blue-900">{selectedSeats.length}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Total Price:</span>
                <div className="font-bold text-blue-900 text-lg">${totalPrice}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link 
            to="/" 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Back to Search
          </Link>
          <button
            onClick={confirmBooking}
            disabled={selectedSeats.length === 0 || bookingLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {bookingLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout
                <span className="text-sm">({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Trip Information</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Transport Type:</span>
              <span className="font-medium">{trip.transportType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Departure:</span>
              <span className="font-medium">{new Date(trip.departureTime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Arrival:</span>
              <span className="font-medium">{new Date(trip.arrivalTime).toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Price per Seat:</span>
              <span className="font-medium">${trip.pricePerSeat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Seats:</span>
              <span className="font-medium">{availableSeats.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Seats:</span>
              <span className="font-medium text-green-600">{availableSeats.filter(s => !s.isBooked).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}