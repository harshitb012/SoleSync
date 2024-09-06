const ErrorHandler = require('../utils/errorhandler');
const asyncError = require('./asyncerror');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = asyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id); // Ensure you have the correct field here

        if (!req.user) {
            return next(new ErrorHandler('User not found', 404));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid token', 401));
    }
});

// Middleware to authorize roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
       
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }

        next();
    };
};
