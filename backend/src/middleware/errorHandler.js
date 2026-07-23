// src/middleware/errorHandler.js

/**
 * WHAT IS THIS FILE?
 * 
 * Middleware = Code that runs on EVERY request
 * 
 * This middleware catches ALL errors that happen
 * and sends proper error response to frontend.
 * 
 * Without this, if an error occurs, app crashes.
 * With this, app handles error gracefully.
 */

const errorHandler = (err, req, res, next) => {
    console.error('❌ ERROR:', err);

    // Get error details
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Send error response
    return res.status(statusCode).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: message,
        statusCode: statusCode,
        // In development, show stack trace (remove in production)
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Catch 404 errors (endpoint not found)
 */
const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        error: `Endpoint not found: ${req.method} ${req.path}`,
        statusCode: 404
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};