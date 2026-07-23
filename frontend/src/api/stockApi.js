// src/api/stockApi.js

import api from "./axios";

/**
 * WHAT IS THIS FILE?
 *
 * This file contains ALL functions that talk to backend.
 *
 * Instead of writing API calls everywhere:
 *
 * // Bad - written in 10 places
 * axios.get('http://localhost:5000/api/search?q=' + query)
 *
 * We have ONE place:
 *
 * // Good - use everywhere
 * stockApi.searchCompanies(query)
 */

/**
 * FUNCTION 1: Search companies
 *
 * What it does:
 * - Takes search query (like "rel")
 * - Calls /api/search?query=rel
 * - Returns list of matching companies
 *
 * @param {string} query - Search term (e.g., "rel")
 * @returns {Promise} API response
 */
export const searchCompanies = async(query) => {
    try {
        const response = await api.get("/search", {
            params: { query }, // Becomes ?query=rel
        });

        // Return just the companies array
        return response.data.data.companies || [];
    } catch (error) {
        console.error("Search error:", error);
        return []; // Return empty array on error
    }
};

/**
 * FUNCTION 2: Get stock report
 *
 * What it does:
 * - Takes stock symbol (like "RELIANCE")
 * - Calls /api/stock/RELIANCE
 * - Returns complete stock data:
 *   - Current price
 *   - Fundamentals
 *   - News
 *   - AI analysis
 *
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE")
 * @returns {Promise} Complete stock report
 */
export const getStockReport = async(symbol) => {
    try {
        const response = await api.get(`/stock/${symbol}`);
        return response.data.data.data; // Return the data
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        throw error; // Throw so caller can handle
    }
};

/**
 * FUNCTION 3: Get company news
 *
 * What it does:
 * - Takes stock symbol
 * - Calls /api/news/:symbol
 * - Returns latest news articles
 *
 * @param {string} symbol - Stock symbol
 * @returns {Promise} News articles
 */
export const getCompanyNews = async(symbol) => {
    try {
        const response = await api.get(`/news/${symbol}`);
        return response.data.data.news || [];
    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        return [];
    }
};

/**
 * FUNCTION 4: Compare stocks
 *
 * What it does:
 * - Takes list of symbols
 * - Returns data for comparison
 *
 * @param {string[]} symbols - Array of symbols
 * @returns {Promise} Comparison data
 */
export const compareStocks = async(symbols) => {
    try {
        // Fetch all stocks in parallel
        const promises = symbols.map((symbol) => getStockReport(symbol));
        const results = await Promise.all(promises);
        return results;
    } catch (error) {
        console.error("Compare error:", error);
        return [];
    }
};

/**
 * SUMMARY:
 *
 * When you want to search:
 *
 * import { searchCompanies } from '@/api/stockApi'
 *
 * const results = await searchCompanies('rel')
 *
 * Much cleaner than writing full URLs everywhere!
 */

export default {
    searchCompanies,
    getStockReport,
    getCompanyNews,
    compareStocks,
};