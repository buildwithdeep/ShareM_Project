// src/services/yahooService.js



const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

console.log("Yahoo Finance Service Initialized");

const toYahooSymbol = function(symbol) {
    const clean = symbol.toUpperCase().trim();
    if (clean.indexOf(".") !== -1) {
        return clean;
    }
    return clean + ".NS";
};

const safe = function(value) {
    if (value === undefined) {
        return null;
    }
    return value;
};

const getLivePrice = async function(symbol) {
    try {
        const yahooSymbol = toYahooSymbol(symbol);
        console.log("Fetching live price for " + yahooSymbol + " from Yahoo...");

        const quote = await yahooFinance.quote(yahooSymbol);

        if (!quote || quote.regularMarketPrice === undefined) {
            return {
                success: false,
                error: "NO_DATA",
                message: "No data found for " + yahooSymbol,
                data: null,
            };
        }

        const data = {
            currentPrice: safe(quote.regularMarketPrice),
            previousClose: safe(quote.regularMarketPreviousClose),
            dayChange: safe(quote.regularMarketChange),
            dayChangePercent: safe(quote.regularMarketChangePercent),
            dayHigh: safe(quote.regularMarketDayHigh),
            dayLow: safe(quote.regularMarketDayLow),
            fiftyTwoWeekHigh: safe(quote.fiftyTwoWeekHigh),
            fiftyTwoWeekLow: safe(quote.fiftyTwoWeekLow),
            volume: safe(quote.regularMarketVolume),
            marketCap: safe(quote.marketCap),
            trailingPE: safe(quote.trailingPE),
            priceToBook: safe(quote.priceToBook),
            dividendYield: quote.trailingAnnualDividendYield ?
                quote.trailingAnnualDividendYield * 100 : null,
            faceValue: null,
            fetchedAt: new Date().toISOString(),
        };

        console.log("Got price for " + yahooSymbol + ": Rs" + data.currentPrice);

        return { success: true, symbol: yahooSymbol, data: data };
    } catch (error) {
        console.error("Yahoo API Error:", error.message);
        return {
            success: false,
            error: "YAHOO_ERROR",
            message: "Unable to fetch stock price from Yahoo",
            details: error.message,
            data: null,
        };
    }
};


const getFinancialHealth = async function(symbol) {
    try {
        const yahooSymbol = toYahooSymbol(symbol);
        console.log("Fetching financial health for " + yahooSymbol + "...");

        const result = await yahooFinance.quoteSummary(yahooSymbol, {
            modules: ["financialData"],
        });

        const fd = result && result.financialData;

        if (!fd) {
            return {
                success: false,
                error: "NO_DATA",
                data: null,
            };
        }

        // Yahoo returns debtToEquity as a percentage (e.g. 45.2 means 0.452 ratio)
        const debtToEquity =
            fd.debtToEquity !== undefined && fd.debtToEquity !== null ?
            fd.debtToEquity / 100 :
            null;

        const data = {
            debtToEquity: debtToEquity,
            currentRatio: safe(fd.currentRatio),
            operatingCashFlow: safe(fd.operatingCashflow),
            interestCoverage: null, // not available from Yahoo
        };

        return { success: true, symbol: yahooSymbol, data: data };
    } catch (error) {
        console.error("Yahoo Financial Health Error:", error.message);
        return {
            success: false,
            error: "YAHOO_HEALTH_ERROR",
            message: error.message,
            data: null,
        };
    }
};

module.exports = {
    getLivePrice: getLivePrice,
    getFinancialHealth: getFinancialHealth,
};