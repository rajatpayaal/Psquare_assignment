/**
 * Utility helper functions for the frontend
 * @author Travel Booking System
 * @version 1.0.0
 */

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format time duration
 * @param {Date|string} startTime - Start time
 * @param {Date|string} endTime - End time
 * @returns {string} Formatted duration
 */
export const formatDuration = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end - start
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

/**
 * Generate random ID
 * @param {string} prefix - ID prefix
 * @returns {string} Random ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Get status color class
 * @param {string} status - Status string
 * @returns {string} CSS class name
 */
export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-gray-100 text-gray-800',
  }
  
  return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

/**
 * Get transport icon
 * @param {string} type - Transport type
 * @returns {string} Icon emoji
 */
export const getTransportIcon = (type) => {
  const icons = {
    Flight: '✈️',
    Train: '🚂',
    Bus: '🚌',
    Car: '🚗',
  }
  
  return icons[type] || '🚗'
}

/**
 * Calculate discount amount
 * @param {number} originalPrice - Original price
 * @param {number} discount - Discount percentage or amount
 * @param {string} type - Discount type ('percentage' or 'fixed')
 * @returns {number} Discount amount
 */
export const calculateDiscount = (originalPrice, discount, type = 'percentage') => {
  if (type === 'percentage') {
    return (originalPrice * discount) / 100
  }
  return Math.min(discount, originalPrice)
}

/**
 * Calculate final price after discount
 * @param {number} originalPrice - Original price
 * @param {number} discount - Discount amount
 * @returns {number} Final price
 */
export const calculateFinalPrice = (originalPrice, discount) => {
  return Math.max(0, originalPrice - discount)
}

/**
 * Format seat codes for display
 * @param {Array} seatCodes - Array of seat codes
 * @returns {string} Formatted seat codes
 */
export const formatSeatCodes = (seatCodes) => {
  if (!seatCodes || !Array.isArray(seatCodes)) return ''
  return seatCodes.join(', ')
}

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} Is past date
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date()
}

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} Is future date
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date()
}

/**
 * Get relative time string
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffMs = targetDate - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0) return `In ${diffDays} days`
  return `${Math.abs(diffDays)} days ago`
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate QR code data URL (placeholder)
 * @param {string} data - Data to encode
 * @returns {string} QR code data URL
 */
export const generateQRCode = (data) => {
  // This is a placeholder - in a real app, you'd use a QR code library
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white"/>
      <text x="50" y="50" text-anchor="middle" font-size="8">QR</text>
    </svg>
  `)}`
}
