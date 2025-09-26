import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/apiService.js'

export default function Checkout() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  
  const [booking, setBooking] = useState(null)
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [bookingError, setBookingError] = useState('')
  const [paymentError, setPaymentError] = useState('')

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  useEffect(() => { 
    const loadBooking = async () => {
      if (!bookingId) {
        setBookingError('Invalid booking ID');
        setLoading(false);
        return;
      }
  
      try {
        const response = await api.getBooking(bookingId); // api.getBooking already returns response.data
        // Our apiService returns only the payload from backend: { success, data }
        const bookingData = response?.data || response?.booking || response; // fallback for different shapes

        if (!bookingData || !bookingData._id) throw new Error('Booking data not found');

        setBooking(bookingData);
        setFinalAmount(bookingData.totalAmount || 0);
        setBookingError('');
      } catch (err) {
        setBookingError(err.message || 'Failed to load booking details');
        console.error('Error loading booking:', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadBooking();
  }, [bookingId]);
  // Apply coupon code
  const applyCoupon = () => {
    if (!booking) {
      setPaymentError('Booking not loaded yet')
      return
    }
    if (!couponCode.trim()) {
      setPaymentError('Please enter a coupon code')
      return
    }

    const validCoupons = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'SAVE20': { discount: 20, type: 'percentage' },
      'FREERIDE': { discount: 100, type: 'percentage' },
      'FLAT50': { discount: 50, type: 'fixed' }
    }

    const coupon = validCoupons[couponCode.toUpperCase()]
    if (coupon) {
      let discountAmount = coupon.type === 'percentage'
        ? (booking.totalAmount * coupon.discount) / 100
        : coupon.discount

      discountAmount = Math.min(discountAmount, booking.totalAmount)

      setDiscount(discountAmount)
      setFinalAmount(booking.totalAmount - discountAmount)
      setCouponApplied(true)
      setPaymentError('')
    } else {
      setPaymentError('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponApplied(false)
    setDiscount(0)
    if (booking) setFinalAmount(booking.totalAmount)
    setPaymentError('')
  }

  const pay = async () => {
    if (method === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
      setPaymentError('Please fill in all card details')
      return
    }

    setProcessing(true)
    setPaymentError('')
    
    try {
      const paymentData = {
        bookingId,
        method,
        couponCode: couponApplied ? couponCode : null,
        discount,
        finalAmount,
        ...(method === 'card' ? { cardDetails } : { walletProvider: 'PayPal' })
      }
      
      await api.pay(paymentData)
      navigate(`/booking-confirmation/${bookingId}`)
    } catch (err) {
      setPaymentError('Payment failed. Please try again.')
      console.error('Payment error:', err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading booking details...</div>
  }

  if (bookingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{bookingError}</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Home
        </button>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Booking not found</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Complete Your Booking</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Payment Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold">Payment Information</h3>

          {/* Coupon */}
          <div>
            <label className="block text-sm font-medium mb-2">Coupon Code</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {!couponApplied ? (
                <button onClick={applyCoupon} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Apply
                </button>
              ) : (
                <button onClick={removeCoupon} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Remove
                </button>
              )}
            </div>
            {couponApplied && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Coupon "{couponCode}" applied! You saved ${discount.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={method === 'card'} onChange={() => setMethod('card')} />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={method === 'wallet'} onChange={() => setMethod('wallet')} />
                <span>Digital Wallet</span>
              </label>
            </div>
          </div>

          {/* Card Details */}
          {method === 'card' && (
            <div className="space-y-3">
              <input type="text" placeholder="Card Number" value={cardDetails.number} 
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                className="w-full border rounded-lg px-3 py-2" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="MM/YY" value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
                <input type="text" placeholder="CVV" value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
              </div>
              <input type="text" placeholder="Cardholder Name" value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
          )}

          {/* Wallet */}
          {method === 'wallet' && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              You will be redirected to your wallet provider.
            </div>
          )}

          {paymentError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{paymentError}</p>
            </div>
          )}

          <button 
            onClick={pay} 
            disabled={processing}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium disabled:bg-gray-300 hover:bg-blue-700"
          >
            {processing ? 'Processing Payment...' : 'Complete Payment'}
          </button>
        </div>

        {/* RIGHT: Booking Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Route:</span><span>{booking.trip?.from || '—'} → {booking.trip?.to || '—'}</span></div>
            <div className="flex justify-between"><span>Transport:</span><span>{booking.trip?.transportType || '—'}</span></div>
            <div className="flex justify-between"><span>Departure:</span><span>{booking.trip?.departureTime ? new Date(booking.trip.departureTime).toLocaleString() : '—'}</span></div>
            <div className="flex justify-between"><span>Arrival:</span><span>{booking.trip?.arrivalTime ? new Date(booking.trip.arrivalTime).toLocaleString() : '—'}</span></div>
            <div className="flex justify-between"><span>Seats:</span><span>{booking.seatCodes?.join(', ')}</span></div>
            <div className="flex justify-between"><span>Passengers:</span><span>{booking.seatCodes?.length}</span></div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between"><span>Subtotal:</span><span>${booking.totalAmount}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span><span className="text-blue-600">${finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
            <p><strong>Booking ID:</strong> {booking._id}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
