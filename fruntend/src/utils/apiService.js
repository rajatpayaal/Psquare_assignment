/**
 * API Service for handling all HTTP requests
 * @author Travel Booking System
 * @version 1.0.0
 */

import axios from 'axios'

// Create axios instance with default configuration
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

let authToken = localStorage.getItem('token') || ''; // Initialize from localStorage


// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    console.log('Authorization Header:', config.headers.Authorization); // Debugging
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
      console.log("Profile API Response:", response.data);

    }
    return response
  },
  (error) => {
    const { response } = error
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${response?.status} ${error.config?.url}`, error.response?.data)
    }
    
    // Handle different error scenarios
    if (response?.status === 401) {
      // For login endpoints, don't auto-redirect; allow caller to handle fallback (e.g., admin login)
      const url = response?.config?.url || ''
      const isLoginRoute = url.includes('/users/login') || url.includes('/users/admin/login')
      if (!isLoginRoute) {
        authToken = ''
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    
    if (response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.warn('Access forbidden')
    }
    
    if (response?.status >= 500) {
      // Server error
      console.error('Server error occurred')
    }
    
    // Extract error message
    const message = response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
const setToken = (token) => { 
  console.log('Setting token:', token); // Debugging
  authToken = token 
}

/**
 * Clear authentication token
 */
const clearToken = () => {
  authToken = ''
  localStorage.removeItem('token')
}

// ==================== AUTHENTICATION API ====================

/**
 * Register a new user
 * @param {Object} payload - User registration data
 * @returns {Promise} API response
 */
const register = (payload) => instance.post('/users/register', payload).then(r => r.data)

/**
 * Login user
 * @param {Object} payload - Login credentials
 * @returns {Promise} API response
 */
const adminLogin = (payload) => instance.post('/users/admin/login', payload).then(r => r.data)

// Try normal login first; on 401, try admin login as fallback
const login = async (payload) => {
  try {
    const res = await instance.post('/users/login', payload)
    return res.data
  } catch (err) {
    // Only fallback on unauthorized
    if (err?.message && err.message.toLowerCase().includes('unauthorized')) {
      const adminRes = await instance.post('/users/admin/login', payload)
      return adminRes.data
    }
    throw err
  }
}

/**
 * Get user profile
 * @returns {Promise} API response
 */
const profile = () => instance.get('/users/profile').then(r => r.data)
const updateProfile = (payload) => instance.put('/users/profile', payload).then(r => r.data)
const changePassword = (payload) => instance.post('/users/change-password', payload).then(r => r.data)

// ==================== TRIPS API ====================

/**
 * Get all trips with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
const getTrips = (params = {}) => instance.get('/trips', { params }).then(r => r.data)

/**
 * Get trip by ID
 * @param {string} id - Trip ID
 * @returns {Promise} API response
 */
const getTrip = (id) => instance.get(`/trips/${id}`).then(r => r.data)

/**
 * Create a new trip (Admin only)
 * @param {Object} tripData - Trip data
 * @returns {Promise} API response
 */
const createTrip = async (tripData) => {
  try {
    const response = await instance.post('/trips', tripData); // POST request to /trips
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error in createTrip:", error);
    throw new Error(error.response?.data?.message || "Failed to create trip");
  }
};

const deleteBooking = async (bookingId) => {
  if (!bookingId) throw new Error("bookingId is required");
  try {
    const { data } = await instance.delete(`/bookings/${bookingId}`);
    return data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error(error?.response?.data?.message || "Failed to delete booking");
  }
};

/**
 * Update trip (Admin only)
 * @param {string} id - Trip ID
 * @param {Object} payload - Updated trip data
 * @returns {Promise} API response
 */
const updateTrip = (id, payload) => instance.put(`/trips/${id}`, payload).then(r => r.data)

/**
 * Delete trip (Admin only)
 * @param {string} id - Trip ID
 * @returns {Promise} API response
 */
const deleteTrip = (id) => instance.delete(`/trips/${id}`).then(r => r.data)

// ==================== BOOKINGS API ====================

/**
 * Create a new booking
 * @param {Object} payload - Booking data
 * @returns {Promise} API response
 */
const createBooking = (payload) => instance.post('/bookings', payload).then(r => r.data)

/**
 * Get user's bookings
 * @returns {Promise} API response
 */
const myBookings = () => instance.get('/bookings/me/list').then(r => r.data)

/**
 * Get all bookings (Admin only)
 * @returns {Promise} API response
 */
const getAllBookings = () => instance.get('/bookings').then(r => r.data)

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise} API response
 */
const getBooking = (id) => instance.get(`/bookings/${id}`).then(r => r.data)

/**
 * Update booking
 * @param {string} id - Booking ID
 * @param {Object} payload - Updated booking data
 * @returns {Promise} API response
 */
const updateBooking = (id, payload) => instance.put(`/bookings/${id}`, payload).then(r => r.data)

/**
 * Get ticket data
 * @param {string} id - Booking ID
 * @returns {Promise} API response
 */
const ticket = (id) => instance.get(`/bookings/${id}/ticket`).then(r => r.data)

/**
 * Get ticket PDF URL
 * @param {string} id - Booking ID
 * @returns {string} PDF URL
 */
const ticketPdfUrl = (id) => `${instance.defaults.baseURL}/bookings/${id}/ticket.pdf`

/**
 * Download ticket PDF as Blob
 * @param {string} id - Booking ID
 * @returns {Promise<Blob>} PDF blob
 */
const getTicketPdfBlob = async (id) => {
  const response = await instance.get(`/bookings/${id}/ticket.pdf`, { responseType: 'blob' })
  return response.data
}

// ==================== PAYMENTS API ====================

/**
 * Process payment
 * @param {Object} payload - Payment data
 * @returns {Promise} API response
 */
const pay = (payload) => instance.post('/payments', payload).then(r => r.data)

// ==================== HEALTH CHECK API ====================

/**
 * Check API health
 * @returns {Promise} API response
 */
const healthCheck = () => instance.get('/health').then(r => r.data)

// Export all API functions
export default {
  // Token management
  setToken,
  clearToken,
  register,
  login,
  adminLogin,
  profile,
  updateProfile,
  changePassword,
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  createBooking,
  myBookings,
  getAllBookings,
  getBooking,
  updateBooking,
  ticket,
  ticketPdfUrl,
  getTicketPdfBlob,
  deleteBooking,
  pay,
  healthCheck,
}


