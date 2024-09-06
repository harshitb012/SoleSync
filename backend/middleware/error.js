const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'JSON Web Token is invalid, Try again';
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'JSON Web Token is expired, Try again';
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
