// import jwt for verifying json web tokens
const jwt = require('jsonwebtoken');
// import user model to fetch user details from database
const User = require('../models/User');

// checks for jwt token in request header and verifies it
const authMiddleware = (req, res, next) => {
    // extract authorization header or set it to an empty string
    const authHeader = req.headers['authorization'] || '';
    // extract token from the header if it starts with 'Bearer '
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    // if no token is provided, return 401 unauthorized
    if (!token) return res.status(401).json({ message: 'No token provided' });
    // verify the token using jwt secret
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        // set user id and role in the request object for further use
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();

        // log authorization header and decoded token for debugging
        console.log('Authorization Header:', req.headers['authorization']);
        console.log('Decoded Token:', decoded);
    });
};

// checks if user has one of the allowed roles
const roleMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            // log user id and allowed roles for debugging
            console.log('User ID from token:', req.userId);
            console.log('Allowed roles:', roles);

            // fetch user details from the database using user id
            const user = await User.findById(req.userId);
            // if user is not found, return 403 access denied
            if (!user) {
                console.log('User not found in the database');
                return res.status(403).json({ message: 'Access denied' });
            }

            // log user role for debugging
            console.log('User role:', user.role);

            // if user role is not in the allowed roles, return 403 access denied
            if (!roles.includes(user.role)) {
                console.log('User role not allowed');
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            // log error and return 500 internal server error
            console.error('Error in roleMiddleware:', err.message);
            return res.status(500).json({ message: err.message });
        }
    };
};

// export the middleware functions
module.exports = { authMiddleware, roleMiddleware };