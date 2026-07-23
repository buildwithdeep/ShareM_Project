// src/utils/apiResponse.js

/**
 * WHAT IS THIS FILE?
 * 
 * Every API should respond in same format.
 * 
 * This file creates that consistent format.
 * 
 * Example:
 * ALL Errors look like:
 * {
 *   success: false,
 *   error: "error message",
 *   statusCode: 400
 * }
 * 
 * ALL Successes look like:
 * {
 *   success: true,
 *   data: {...}
 * }
 * 
 * Frontend can count on this!
 */

/**
 * Send successful response
 */
const successResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        timestamp: new Date().toISOString(),
        data: data
    });
};

/**
 * Send error response
 */
const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: message,
        statusCode: statusCode
    });
};

module.exports = {
    successResponse,
    errorResponse
};