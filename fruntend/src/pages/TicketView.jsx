import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/apiService';

export default function TicketView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.ticket(bookingId); // Fetch ticket data using the API
        if (!response || !response._id) {
          throw new Error('Invalid ticket data');
        }
        setTicket(response); // Set ticket data
      } catch (err) {
        setError('Failed to load ticket details');
        console.error('Error loading ticket:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [bookingId]);

  const downloadTicketPdf = () => {
    const ticketPdfUrl = api.ticketPdfUrl(bookingId); // Generate ticket PDF URL
    const link = document.createElement('a');
    link.href = ticketPdfUrl;
    link.download = `ticket-${bookingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Ticket Details */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Flight Ticket</h2>
              <p className="text-blue-100">Booking ID: #{ticket._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-4xl">✈️</div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{ticket.trip?.from}</div>
              <div className="text-sm text-gray-600">{ticket.trip?.from}</div>
              <div className="text-lg font-semibold text-blue-600 mt-2">
                {new Date(ticket.trip?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">✈</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {Math.round((new Date(ticket.trip?.arrivalTime) - new Date(ticket.trip?.departureTime)) / (1000 * 60 * 60))}h{' '}
                {Math.round(((new Date(ticket.trip?.arrivalTime) - new Date(ticket.trip?.departureTime)) % (1000 * 60 * 60)) / (1000 * 60))}min
              </div>
              <div className="text-xs text-gray-500 mt-1">Flight Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{ticket.trip?.to}</div>
              <div className="text-sm text-gray-600">{ticket.trip?.to}</div>
              <div className="text-lg font-semibold text-blue-600 mt-2">
                {new Date(ticket.trip?.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(ticket.trip?.departureTime).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-medium">{ticket.seatCodes?.join(', ')}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Fare Paid:</span>
              <span className="text-2xl font-bold text-green-600">${ticket.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadTicketPdf}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Ticket PDF
        </button>
        <button
          onClick={() => navigate('/my-bookings')}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Back to My Bookings
        </button>
      </div>
    </div>
  );
}