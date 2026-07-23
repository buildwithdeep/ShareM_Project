// src/api/axios.js

import axios from "axios";

/**
 * ✅ FIXED: Better error handling and logging
 * No spaces in optional chaining - using alternative syntax
 */

// Get API URL from .env or use default
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log(`🔌 API URL: ${API_URL}`);

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

/**
 * Request Interceptor
 */
api.interceptors.request.use(
    (config) => {
        const timestamp = new Date().toISOString();
        console.log(
            `📡 [${timestamp}] ${config.method.toUpperCase()} ${config.url}`,
        );

        // Add any auth token if available
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error("❌ Request error:", error.message);
        return Promise.reject(error);
    },
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
    (response) => {
        const timestamp = new Date().toISOString();
        console.log(
            `✅ [${timestamp}] ${response.status} - ${response.statusText}`,
        );
        return response;
    },
    (error) => {
        const timestamp = new Date().toISOString();

        // ✅ FIXED: Alternative syntax without optional chaining
        const status = error.response != null ? error.response.status : "Unknown";
        const message =
            error.response != null && error.response.data != null ?
            error.response.data.error :
            error.message;

        console.error(`❌ [${timestamp}] Error ${status}: ${message}`);

        // Handle specific errors
        if (error.response != null && error.response.status === 404) {
            console.error("🔍 Resource not found");
        } else if (error.response != null && error.response.status === 500) {
            console.error("⚠️ Server error");
        } else if (error.code === "ECONNREFUSED") {
            console.error(
                "🔴 Cannot connect to backend. Is it running on port 5000?",
            );
        }

        return Promise.reject(error);
    },
);

export default api;