// src/components/BookingTable.jsx

import React from "react";
import api from "../utils/apiService";

export default function BookingTable({ bookings = [], onDelete, onEdit, onVerify }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Booking Management</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            All Bookings
          </button>
          <button
            onClick={() => {
              // Bulk verify: mark all unverified as verified
              if (onVerify) {
                bookings.filter(b => !b.qrVerified).forEach(b => onVerify(b._id || b.id));
              }
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Verify All QR
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Booking ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Trip Route</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Seats</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">QR Verified</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id || booking.id} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">
                  B{String(index + 1).padStart(3, '0')}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {booking.user?.name || booking.user || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {booking.trip?.from && booking.trip?.to 
                    ? `${booking.trip.from} to ${booking.trip.to}`
                    : booking.trip || 'N/A'
                  }
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {booking.departureTime 
                    ? new Date(booking.departureTime).toLocaleDateString()
                    : booking.createdAt 
                    ? new Date(booking.createdAt).toLocaleDateString()
                    : 'N/A'
                  }
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {booking.seats?.map(seat => seat.seatNumber).join(', ') || 
                   booking.seatCodes || 
                   'N/A'}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800' // default to confirmed
                  }`}>
                    {booking.status || 'Confirmed'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {booking.qrVerified || booking.status === 'Confirmed' ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit && onEdit(booking)}
                      className="text-gray-400 hover:text-gray-600" 
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onVerify && onVerify(booking._id || booking.id)}
                      className={`text-${booking.qrVerified ? 'green' : 'blue'}-500 hover:text-${booking.qrVerified ? 'green' : 'blue'}-700`}
                      title={booking.qrVerified ? 'QR already verified' : 'Verify QR'}
                      disabled={booking.qrVerified}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete && onDelete(booking._id || booking.id)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 px-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}