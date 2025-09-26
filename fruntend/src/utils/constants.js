/**
 * Application constants
 * @author Travel Booking System
 * @version 1.0.0
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
}

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  UNPAID: 'unpaid',
  FAILED: 'failed',
}

// Transport Types
export const TRANSPORT_TYPES = {
  FLIGHT: 'Flight',
  TRAIN: 'Train',
  BUS: 'Bus',
}

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  WALLET: 'wallet',
}

// Coupon Codes
export const COUPON_CODES = {
  WELCOME10: {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    description: 'Welcome discount - 10% off',
  },
  SAVE20: {
    code: 'SAVE20',
    discount: 20,
    type: 'percentage',
    description: 'Save 20% on your booking',
  },
  FREERIDE: {
    code: 'FREERIDE',
    discount: 100,
    type: 'percentage',
    description: 'Free ride - 100% off',
  },
  FLAT50: {
    code: 'FLAT50',
    discount: 50,
    type: 'fixed',
    description: 'Flat $50 off your booking',
  },
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  MY_BOOKINGS: '/my-bookings',
  ADMIN: '/admin',
  TRIP_DETAILS: '/trips/:id',
  CHECKOUT: '/checkout/:bookingId',
  BOOKING_CONFIRMATION: '/booking-confirmation/:bookingId',
}

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  PASSWORD: {
    required: true,
    minLength: 8,
    message: 'Password must be at least 8 characters long',
  },
  PHONE: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number',
  },
  NAME: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Name must be between 2 and 50 characters',
  },
}

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 300,
  LOADING_SPINNER_SIZE: 24,
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  BOOKING_SUCCESS: 'Booking confirmed successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  TRIP_CREATE_SUCCESS: 'Trip created successfully!',
  TRIP_UPDATE_SUCCESS: 'Trip updated successfully!',
  TRIP_DELETE_SUCCESS: 'Trip deleted successfully!',
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
}

// Seat Configuration
export const SEAT_CONFIG = {
  ROWS_PER_SECTION: 6,
  MAX_SEATS_PER_BOOKING: 10,
  SEAT_TYPES: {
    ECONOMY: 'economy',
    BUSINESS: 'business',
    FIRST: 'first',
  },
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// Language Configuration
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
}

// Currency Configuration
export const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
}

// Time Zones
export const TIME_ZONES = {
  UTC: 'UTC',
  EST: 'America/New_York',
  PST: 'America/Los_Angeles',
  GMT: 'Europe/London',
  CET: 'Europe/Paris',
}

// Environment
export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
}

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_COUPONS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false,
}
