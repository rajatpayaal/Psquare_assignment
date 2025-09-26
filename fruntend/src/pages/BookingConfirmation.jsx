import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/apiService.js';
import { useAuth } from '../store/authContext.jsx';
import Toast from '../components/Toast.jsx';

// TODO: integrate actual Toast component once created
export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const resp = await api.getBooking(bookingId); // API returns { success, data }
        const data = resp?.data || resp?.booking || resp; // fallback just in case
        if (!data || !data._id) throw new Error('Booking not found');
        setBooking(data);
      } catch (err) {
        setError(err.message || 'Failed to load booking details');
        console.error('Error loading booking:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  const downloadTicket = async () => {
    if (!booking) return;
    if (booking.paymentStatus !== 'paid') {
      setError('Payment not completed. Please complete the payment to download the ticket.');
      return;
    }
    setDownloading(true);
    setError('');
    try {
      const url = api.ticketPdfUrl(bookingId);
      // Use fetch with explicit blob handling and auth header
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch ticket');
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ticket-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      setSuccessMsg('Ticket downloaded successfully');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to download ticket');
    } finally {
      setDownloading(false);
    }
  };

  const viewTicket = () => {
    navigate(`/ticket/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading booking confirmation...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Home
        </button>
      </div>
    );
  }

  const dep = booking.trip?.departureTime ? new Date(booking.trip.departureTime) : null;
  const arr = booking.trip?.arrivalTime ? new Date(booking.trip.arrivalTime) : null;
  const durationMs = dep && arr ? (arr - dep) : 0;
  const durH = Math.floor(durationMs / 3600000);
  const durM = Math.floor((durationMs % 3600000) / 60000);
  const statusLabel = (booking.status || '').charAt(0).toUpperCase() + (booking.status || '').slice(1);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Booking Confirmation</h1>
          <p className="text-gray-500 text-sm">Reference • {booking._id.toUpperCase()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadTicket}
            disabled={downloading || booking.paymentStatus !== 'paid'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
          >
            {downloading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>}
            {!downloading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            My Bookings
          </button>
        </div>
      </div>

      {/* Ticket Layout */}
      <div className="bg-white rounded-xl shadow border overflow-hidden grid md:grid-cols-3 mb-10">
        {/* Route & Times */}
        <div className="p-6 border-r md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500">From</div>
              <div className="text-2xl font-bold text-gray-900">{booking.trip?.from}</div>
              <div className="text-gray-500 text-sm">{dep && dep.toLocaleDateString()}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Duration</div>
              <div className="font-semibold text-gray-800">{durH}h {durM}m</div>
              <div className="w-28 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 my-3" />
              <div className="text-xs text-gray-500">{booking.trip?.transportType}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">To</div>
              <div className="text-2xl font-bold text-gray-900">{booking.trip?.to}</div>
              <div className="text-gray-500 text-sm">{arr && arr.toLocaleDateString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Departure</div>
              <div className="font-medium">{dep && dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div>
              <div className="text-gray-500">Arrival</div>
              <div className="font-medium">{arr && arr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div>
              <div className="text-gray-500">Seats</div>
              <div className="font-medium">{booking.seatCodes?.join(', ')}</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{statusLabel || '—'}</span>
            </div>
          </div>
        </div>

        {/* Passenger & Price */}
        <div className="p-6 flex flex-col justify-between bg-gray-50">
          <div>
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Passenger</div>
              <div className="font-semibold text-gray-900">{user?.name || booking.user?.name || 'Traveler'}</div>
              <div className="text-gray-500 text-xs">{user?.email || booking.user?.email}</div>
            </div>
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total Paid</div>
              <div className="text-2xl font-bold text-green-600">${booking.totalAmount}</div>
            </div>
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Payment</div>
              <div className="font-medium capitalize">{booking.paymentStatus}</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-2">Boarding Code</div>
            <div className="h-14 w-full bg-[repeating-linear-gradient(90deg,theme(colors.gray.800)_0_2px,transparent_2px_4px)] opacity-80 rounded"/>
            <div className="mt-2 text-[10px] tracking-widest text-gray-500">{booking._id.slice(-12).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="prose prose-sm max-w-none text-gray-600">
        <h3 className="text-gray-900 font-semibold mb-2">Terms & Conditions</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ticket is valid only for the specified passenger, date and route.</li>
          <li>Please arrive at least 45 minutes before departure for verification.</li>
          <li>Changes or cancellations may incur additional fees depending on fare rules.</li>
          <li>Digital boarding code must remain readable; damaged codes may require manual verification.</li>
        </ul>
      </div>

      <Toast type="error" message={error} onClose={() => setError('')} />
      <Toast type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
    </div>
  );
}