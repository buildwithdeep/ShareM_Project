// src/utils/formatNumber.js

/**
 * WHAT IS THIS FILE?
 *
 * Functions to format numbers nicely
 *
 * Input: 1000000
 * Output: "10 L" (10 Lakh)
 *
 * Input: 1000000000
 * Output: "1 Cr" (1 Crore)
 */

export const formatNumber = (num) => {
    if (num === null || num === undefined || num === "N/A") {
        return "N/A";
    }

    const n = parseFloat(num);

    // Crore (10 million)
    if (n >= 10000000) {
        return (n / 10000000).toFixed(2) + " Cr";
    }

    // Lakh (100,000)
    if (n >= 100000) {
        return (n / 100000).toFixed(2) + " L";
    }

    // Thousand
    if (n >= 1000) {
        return (n / 1000).toFixed(2) + " K";
    }

    // Less than thousand
    return Math.round(n).toString();
};

export const formatCurrency = (num) => {
    if (num === null || num === undefined || num === "N/A") {
        return "N/A";
    }

    const n = parseFloat(num);
    return n.toFixed(2);
};

export const formatPercent = (num, decimals = 2) => {
    if (num === null || num === undefined || num === "N/A") {
        return "N/A";
    }

    const n = parseFloat(num);
    return n.toFixed(decimals) + "%";
};

export default {
    formatNumber,
    formatCurrency,
    formatPercent,
};