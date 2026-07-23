// src/config/apiConfig.js

/**
 * WHAT IS THIS?
 *
 * All external APIs are configured here.
 * This file is like a "phone book" for all APIs.
 *
 * Other files will say:
 * "Give me Yahoo API config" → I return it
 * "Give me Alpha API config" → I return it
 */

const apiConfig = {
    // Yahoo Finance API - Get live stock prices
    yahoo: {
        baseURL: "https://query1.finance.yahoo.com",
        endpoints: {
            quote: "/v7/finance/quote",
            chart: "/v7/finance/chart",
        },
        // Yahoo doesn't require API key (public API)
    },

    // Alpha Vantage API - Get financial fundamentals
    // SerpApi Google Finance - Get financial fundamentals
    serpApi: {
        baseURL: "https://serpapi.com/search",
        apiKey: process.env.SERP_API_KEY,
        engine: "google_finance",
    },

    // Google News RSS - Get latest news
    googleNews: {
        baseURL: "https://news.google.com/rss/search",
        // Takes query parameter for company name
        // Example: baseURL?q=reliance
    },



    // Gemini AI API - Analyze financial data
    gemini: {
        baseURL: "https://generativelanguage.googleapis.com/v1beta",
        apiKey: process.env.GEMINI_API_KEY,
        models: {
            pro: "gemini-pro-latest",
            flash: "gemini-flash-latest",
            flashLite: "gemini-flash-lite-latest",
        },
        defaultModel: "gemini-flash-latest",
    },
};

module.exports = apiConfig;