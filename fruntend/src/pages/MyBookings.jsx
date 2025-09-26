import { useEffect, useState, useCallback } from 'react'
import api from '../utils/apiService.js'
import { useAuth } from '../store/authContext.jsx'

export default function MyBookings() {
  const [data, setData] = useState({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const { isAdmin } = useAuth() // FIX: previously undefined reference

  const categorize = (bookings = []) => {
    const now = new Date()
    const upcoming = []
    const past = []
    bookings.forEach(b => {
      const depRaw = b?.trip?.departureTime
      if (!depRaw) return // skip if trip missing (defensive)
      const dep = new Date(depRaw)
      if (dep.getTime() > now.getTime()) upcoming.push(b); else past.push(b)
    })
    // Sort: upcoming soonest first, past most recent first
    upcoming.sort((a, b) => new Date(a.trip.departureTime) - new Date(b.trip.departureTime))
    past.sort((a, b) => new Date(b.trip.departureTime) - new Date(a.trip.departureTime))
    return { upcoming, past }
  }

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const mine = await api.myBookings()
      if (mine?.upcoming && mine?.past) setData(mine)
      else setData(categorize(Array.isArray(mine) ? mine : []))
    } catch (err) {
      setError('Failed to load bookings')
      console.error('Error loading bookings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  const handleCancel = async (booking) => {
    if (!window.confirm('Cancel this booking?')) return
    setCancelling(booking._id)
    try {
      // If admin we can delete; if user we attempt status update to cancelled (endpoint restricted though) so fallback message
      if (isAdmin && isAdmin()) {
        await api.deleteBooking(booking._id)
      } else {
        try {
          await api.updateBooking(booking._id, { status: 'cancelled' })
        } catch (e) {
          alert('Unable to cancel booking (permissions).')
        }
      }
      await loadBookings()
    } catch (e) {
      console.error(e)
      alert(e.message || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const TicketLink = ({ booking }) => (
    <div className="flex flex-wrap gap-3 mt-3 items-center">
      <button
        onClick={async () => {
          try {
            setDownloading(booking._id)
            const blob = await api.getTicketPdfBlob(booking._id)
            const url = window.URL.createObjectURL(blob)
            // Open in new tab while also triggering download filename
            const a = document.createElement('a')
            a.href = url
            a.download = `ticket-${booking._id.slice(-8)}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            // Optional: open in new tab
            window.open(url, '_blank', 'noopener,noreferrer')
            setTimeout(() => URL.revokeObjectURL(url), 5000)
          } catch (e) {
            console.error('Ticket download failed', e)
            alert(e.message || 'Failed to download ticket')
          } finally {
            setDownloading(null)
          }
        }}
        disabled={downloading === booking._id}
        className="text-blue-600 hover:text-blue-800 disabled:opacity-50 text-sm font-medium"
      >
        {downloading === booking._id ? 'Downloading…' : '📄 Ticket Dawnlode '}
      </button>
      {booking.status === 'pending' && (
        <button 
          onClick={() => handleCancel(booking)}
          disabled={cancelling === booking._id}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 text-sm font-medium"
        >
          {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
        </button>
      )}
    </div>
  )

  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-500">#{booking._id.slice(-8)}</div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      
      <div className="font-semibold text-lg mb-1">
        {booking.trip?.from} → {booking.trip?.to}
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {booking.trip?.transportType}
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Departure:</span>
          <span>{new Date(booking.trip?.departureTime).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Arrival:</span>
          <span>{new Date(booking.trip?.arrivalTime).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Seats:</span>
          <span className="font-medium">{booking.seatCodes?.join(', ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total:</span>
          <span className="font-semibold text-blue-600">${booking.totalAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Booked:</span>
          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <TicketLink booking={booking} />
    </div>
  )

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading your bookings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your travel bookings and download tickets</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold">Upcoming Bookings</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {data.upcoming?.length || 0}
          </span>
        </div>
        
        {data.upcoming?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.upcoming.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-2">✈️</div>
            <p className="text-gray-600">No upcoming bookings</p>
            <p className="text-sm text-gray-500">Book your next trip to see it here!</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold">Past Bookings</h3>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
            {data.past?.length || 0}
          </span>
        </div>
        
        {data.past?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.past.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-600">No past bookings</p>
            <p className="text-sm text-gray-500">Your completed trips will appear here</p>
          </div>
        )}
      </section>
    </div>
  )
}


