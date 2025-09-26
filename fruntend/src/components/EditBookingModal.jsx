import React, { useEffect, useState } from 'react';
import api from '../utils/apiService';

/**
 * EditBookingModal
 * Allows admin to modify booking status, paymentStatus, seat codes and QR verification flag.
 */
export default function EditBookingModal({ bookingId, onClose, onUpdated, initialBooking }) {
  const [booking, setBooking] = useState(initialBooking || null);
  const [seatCodes, setSeatCodes] = useState('');
  const [status, setStatus] = useState('Confirmed');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [qrVerified, setQrVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load full booking if not provided
  useEffect(() => {
    const load = async () => {
      if (!bookingId || booking) return;
      setLoading(true);
      try {
        const data = await api.getBooking(bookingId);
        setBooking(data?.data || data); // handle possible shapes
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId, booking]);

  // Initialize form from booking
  useEffect(() => {
    if (booking) {
      setSeatCodes(Array.isArray(booking.seatCodes) ? booking.seatCodes.join(',') : booking.seatCodes || '');
      setStatus(booking.status || 'Confirmed');
      setPaymentStatus(booking.paymentStatus || 'paid');
      setQrVerified(!!booking.qrVerified);
    }
  }, [booking]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!bookingId) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        status,
        paymentStatus,
        seatCodes: seatCodes.split(',').map(s => s.trim()).filter(Boolean),
        qrVerified,
      };
      const resp = await api.updateBooking(bookingId, payload);
      const updated = resp?.booking || resp;
      onUpdated && onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow p-6 relative">
        <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {(loading && !booking) ? (
          <div className="py-10 text-center text-gray-500">Loading booking details...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border-gray-300 rounded-md">
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full border-gray-300 rounded-md">
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seat Codes (comma separated)</label>
              <input value={seatCodes} onChange={e => setSeatCodes(e.target.value)} className="w-full border-gray-300 rounded-md" placeholder="1A,1B,2A" />
            </div>
            <div className="flex items-center space-x-2">
              <input id="qrVerified" type="checkbox" checked={qrVerified} onChange={e => setQrVerified(e.target.checked)} />
              <label htmlFor="qrVerified" className="text-sm text-gray-700">QR Verified</label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md text-gray-700">Cancel</button>
              <button disabled={saving} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
