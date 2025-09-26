// wrapper to handle async functions and pass errors to next middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// sends a standardized success response
const ok = (res, data = {}, status = 200) => {
    return res.status(status).json({ success: true, ...data });
};

// custom error class to handle api-specific errors
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode; // http status code
        this.details = details; // additional error details
    }
}

// middleware to handle errors and send a standardized error response
const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500; // default to internal server error
    const payload = {
        success: false,
        message: err.message || 'Internal Server Error',
    };
    if (err.details) payload.details = err.details; // include error details if available
    return res.status(status).json(payload);
};

// generates a unique id using random string
const generateUniqueId = () => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};

// formats a date into a readable string
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

// calculates the price after applying a discount percentage
const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
};

// export all utility functions and classes
module.exports = {
    asyncHandler,
    ok,
    ApiError,
    errorHandler,
    generateUniqueId,
    formatDate,
    calculateDiscountedPrice,
};