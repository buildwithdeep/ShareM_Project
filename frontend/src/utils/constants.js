// src/utils/constants.js

/**
 * CONSTANTS = Fixed values used everywhere
 */

export const API_URL =
    import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
}

export const SECTORS = [
    "Technology",
    "Finance",
    "Energy",
    "Healthcare",
    "Automobile",
    "FMCG",
    "Construction",
    "Real Estate",
    "Pharma",
    "Telecom",
];

export const RATING_COLORS = {
    "STRONG BUY": "#10b981",
    BUY: "#3b82f6",
    HOLD: "#f59e0b",
    SELL: "#ef4444",
    "STRONG SELL": "#991b1b",
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};