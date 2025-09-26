// src/components/TripTable.jsx
import React from "react";

export default function TripTable({ trips = [], onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Trip Management</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            All Trips
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            + Add New Trip
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Route</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Departure</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Arrival</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Seats</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(trips) ? trips : Object.values(trips)).map((trip, index) =>
              trip._id || trip.id ? (
                <tr key={trip._id || trip.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">
                    T{String(index + 1).padStart(3, '0')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {trip.transportType || 'Bus'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {trip.from} to {trip.to}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {trip.departureTime ? 
                      new Date(trip.departureTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'
                    }
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {trip.arrivalTime ? 
                      new Date(trip.arrivalTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'
                    }
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    ${trip.pricePerSeat || trip.price || '0'}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>{trip.totalSeats || '0'}</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        {trip.totalSeats - (trip.seats?.filter(seat => seat.isBooked).length || 0)} available
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onEdit && onEdit(trip)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => onDelete && onDelete(trip._id || trip.id)}
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
              ) : null
            )}
            {(Array.isArray(trips) ? trips : Object.values(trips)).filter(trip => trip._id || trip.id).length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 px-4 text-center text-gray-500">
                  No trips found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}