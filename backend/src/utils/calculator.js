// src/utils/calculator.js

/**
 * WHAT IS THIS FILE?
 * 
 * Calculate financial metrics that are not directly
 * provided by APIs.
 * 
 * Example: If we have revenue and profit,
 * we can calculate profit margin ourselves.
 */

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * 
 * CAGR tells us how fast something grew per year
 */
const calculateCAGR = (startValue, endValue, years) => {
    if (!startValue || !endValue || startValue === 0) return null;

    const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    return cagr.toFixed(2);
};

/**
 * Calculate profit margin
 * Profit Margin = (Net Profit / Revenue) * 100
 */
const calculateProfitMargin = (netProfit, revenue) => {
    if (!netProfit || !revenue || revenue === 0) return null;

    return ((netProfit / revenue) * 100).toFixed(2);
};

/**
 * Calculate ROE (Return on Equity)
 * ROE = (Net Income / Shareholder Equity) * 100
 */
const calculateROE = (netIncome, equity) => {
    if (!netIncome || !equity || equity === 0) return null;

    return ((netIncome / equity) * 100).toFixed(2);
};

/**
 * Calculate Debt to Equity Ratio
 * D/E = Total Debt / Total Equity
 * Lower is better (less risky)
 */
const calculateDebtToEquityRatio = (totalDebt, totalEquity) => {
    if (!totalDebt || !totalEquity || totalEquity === 0) return null;

    return (totalDebt / totalEquity).toFixed(2);
};

/**
 * Calculate Current Ratio
 * CR = Current Assets / Current Liabilities
 * Higher is better (more ability to pay short-term debts)
 */
const calculateCurrentRatio = (currentAssets, currentLiabilities) => {
    if (!currentAssets || !currentLiabilities || currentLiabilities === 0) return null;

    return (currentAssets / currentLiabilities).toFixed(2);
};

/**
 * Calculate Risk Score (0-100)
 * Based on debt levels and profitability
 */
const calculateRiskScore = (debtToEquity, profitMargin) => {
    let riskScore = 50; // Start at neutral

    // Debt increases risk
    if (debtToEquity > 1) riskScore += 25;
    else if (debtToEquity > 0.5) riskScore += 15;

    // Low profit decreases trust
    if (profitMargin < 5) riskScore += 20;
    else if (profitMargin > 20) riskScore -= 10;

    return Math.min(100, Math.max(0, riskScore));
};

module.exports = {
    calculateCAGR,
    calculateProfitMargin,
    calculateROE,
    calculateDebtToEquityRatio,
    calculateCurrentRatio,
    calculateRiskScore
};