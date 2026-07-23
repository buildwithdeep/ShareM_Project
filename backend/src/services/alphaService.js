const axios = require("axios");

const SERP_API_KEY = process.env.SERP_API_KEY;
const SERP_BASE_URL = "https://serpapi.com/search";

console.log("SERP API KEY:", SERP_API_KEY ? "LOADED" : "MISSING");

const formatSymbol = function(symbol) {
    if (!symbol) return "";
    var clean = symbol.toUpperCase().trim();
    if (clean.indexOf(":") !== -1) return clean;
    return clean + ":NSE";
};

const cleanNumber = function(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;

    var str = value.toString();
    if (str === "—" || str.trim() === "") return null;

    var multiplier = 1;

    if (str.indexOf("Cr") !== -1 || str.indexOf("Cr.") !== -1) multiplier = 10000000;
    if (str.indexOf("L") !== -1) multiplier = 100000;

    str = str.replace(/[^0-9.-]/g, "");
    var number = parseFloat(str);

    if (isNaN(number)) return null;
    return number * multiplier;
};

const findSection = function(financials, name) {
    if (!financials || !Array.isArray(financials)) return null;
    for (var i = 0; i < financials.length; i++) {
        var section = financials[i];
        if (section.title && section.title.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
            return section;
        }
    }
    return null;
};

const findMetric = function(section, name) {
    if (!section || !section.results || !Array.isArray(section.results)) return null;
    for (var i = 0; i < section.results.length; i++) {
        var result = section.results[i];
        if (!result.table || !Array.isArray(result.table)) continue;
        for (var j = 0; j < result.table.length; j++) {
            var row = result.table[j];
            if (row.title && row.title.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
                return cleanNumber(row.value);
            }
        }
    }
    return null;
};

const fetchGoogleFinance = async function(symbol) {
    var googleSymbol = formatSymbol(symbol);
    var response = await axios.get(SERP_BASE_URL, {
        params: {
            engine: "google_finance",
            q: googleSymbol,
            api_key: SERP_API_KEY,
            no_cache: true,
        },
        timeout: 15000,
    });
    return response.data;
};

const extractFinancialData = function(data) {
    var financials = data.financials || [];

    var income = findSection(financials, "Income");
    var cash = findSection(financials, "Cash");
    var balance = findSection(financials, "Balance");

    var totalRevenue = findMetric(income, "Revenue");
    var operatingIncome = findMetric(income, "Operating");
    var netIncome = findMetric(income, "Net income");
    var eps = findMetric(income, "EPS");

    var freeCashFlow = findMetric(cash, "Free cash");
    var cashFromOperations = findMetric(cash, "Operating cash");

    var totalAssets = findMetric(balance, "Total assets");
    var totalDebt = findMetric(balance, "Total debt");

    var currentAssets = findMetric(balance, "Current assets");
    var currentLiabilities = findMetric(balance, "Current liabilities") || findMetric(balance, "liabilities");

    var ebit = findMetric(income, "EBIT") || findMetric(income, "Operating income");
    var interestExpense = findMetric(income, "Interest expense");

    var profitMargin = null;
    if (totalRevenue && netIncome) {
        profitMargin = (netIncome / totalRevenue) * 100;
    }

    var debtToEquity = null;
    if (totalAssets && totalDebt) {
        var equity = totalAssets - totalDebt;
        if (equity !== 0) debtToEquity = totalDebt / equity;
    }

    var roe = null;
    if (netIncome && totalAssets && totalDebt !== null) {
        var equityForRoe = totalAssets - totalDebt;
        if (equityForRoe > 0) roe = (netIncome / equityForRoe) * 100;
    }

    var currentRatio = null;
    if (currentAssets && currentLiabilities && currentLiabilities !== 0) {
        currentRatio = currentAssets / currentLiabilities;
    }

    var interestCoverage = null;
    if (ebit && interestExpense && interestExpense !== 0) {
        interestCoverage = ebit / Math.abs(interestExpense);
    }

    return {
        totalRevenue: totalRevenue,
        operatingIncome: operatingIncome,
        netIncome: netIncome,
        eps: eps,
        freeCashFlow: freeCashFlow,
        cashFromOperations: cashFromOperations,
        totalAssets: totalAssets,
        totalDebt: totalDebt,
        profitMargin: profitMargin,
        debtToEquity: debtToEquity,
        currentRatio: currentRatio,
        interestCoverage: interestCoverage,
        roe: roe,
    };
};

/**
 * ✅ NEW: Calculate CAGR between two values over N years
 */
const calculateCAGR = function(endValue, startValue, years) {
    if (!endValue || !startValue || startValue <= 0 || endValue <= 0 || years <= 0) {
        return null;
    }
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};

/**
 * ✅ NEW: Extract Revenue/Net Profit CAGR (3Y, 5Y) + last 8 quarters revenue trend
 * Uses the SAME data already fetched from Google Finance — no extra API call
 */
const extractGrowthHistory = function(data) {
    var financials = data.financials || [];
    var income = findSection(financials, "Income");

    if (!income || !income.results || !Array.isArray(income.results)) {
        return {
            revenueCagr3Y: null,
            revenueCagr5Y: null,
            netProfitCagr3Y: null,
            netProfitCagr5Y: null,
            quarterlyRevenue: [],
            ebitdaMarginCurrent: null,
            ebitdaMargin5YAgo: null,
            netProfitMarginCurrent: null,
            netProfitMargin5YAgo: null,
            latestQuarter: null,
        };
    }

    var getMetric = function(resultRow, name) {
        if (!resultRow.table) return null;
        var row = resultRow.table.find(function(t) { return t.title === name; });
        if (!row) return null;
        return cleanNumber(row.value);
    };

    var getChange = function(resultRow, name) {
        if (!resultRow.table) return null;
        var row = resultRow.table.find(function(t) { return t.title === name; });
        if (!row || !row.change || row.change === "—") return null;
        var num = parseFloat(row.change.replace(/[^0-9.-]/g, ""));
        return isNaN(num) ? null : num;
    };

    var annualResults = income.results.filter(function(r) {
        return r.period_type === "Annual";
    });

    var annualRevenue = annualResults.map(function(r) {
        return { year: r.date, value: getMetric(r, "Revenue") };
    });
    var annualNetIncome = annualResults.map(function(r) {
        return { year: r.date, value: getMetric(r, "Net income") };
    });

    var revenueCagr3Y = null;
    var revenueCagr5Y = null;
    var netProfitCagr3Y = null;
    var netProfitCagr5Y = null;

    if (annualRevenue.length > 3 && annualRevenue[0].value && annualRevenue[3].value) {
        revenueCagr3Y = calculateCAGR(annualRevenue[0].value, annualRevenue[3].value, 3);
    }
    if (annualRevenue.length > 5 && annualRevenue[0].value && annualRevenue[5].value) {
        revenueCagr5Y = calculateCAGR(annualRevenue[0].value, annualRevenue[5].value, 5);
    }
    if (annualNetIncome.length > 3 && annualNetIncome[0].value && annualNetIncome[3].value) {
        netProfitCagr3Y = calculateCAGR(annualNetIncome[0].value, annualNetIncome[3].value, 3);
    }
    if (annualNetIncome.length > 5 && annualNetIncome[0].value && annualNetIncome[5].value) {
        netProfitCagr5Y = calculateCAGR(annualNetIncome[0].value, annualNetIncome[5].value, 5);
    }

    // Margins: current year vs 5 years ago
    var ebitdaMarginCurrent = null;
    var ebitdaMargin5YAgo = null;
    var netProfitMarginCurrent = null;
    var netProfitMargin5YAgo = null;

    if (annualResults.length > 0) {
        var latestRev = getMetric(annualResults[0], "Revenue");
        var latestEbitda = getMetric(annualResults[0], "EBITDA");
        var latestNet = getMetric(annualResults[0], "Net income");

        if (latestRev && latestEbitda) ebitdaMarginCurrent = (latestEbitda / latestRev) * 100;
        if (latestRev && latestNet) netProfitMarginCurrent = (latestNet / latestRev) * 100;
    }

    if (annualResults.length > 5) {
        var oldRev = getMetric(annualResults[5], "Revenue");
        var oldEbitda = getMetric(annualResults[5], "EBITDA");
        var oldNet = getMetric(annualResults[5], "Net income");

        if (oldRev && oldEbitda) ebitdaMargin5YAgo = (oldEbitda / oldRev) * 100;
        if (oldRev && oldNet) netProfitMargin5YAgo = (oldNet / oldRev) * 100;
    }

    // Quarterly revenue trend — last 8 quarters
    var quarterlyResults = income.results.filter(function(r) {
        return r.period_type === "Quarterly";
    });

    var quarterlyRevenue = quarterlyResults
        .slice(0, 8)
        .map(function(r) {
            return { quarter: r.date, value: getMetric(r, "Revenue") };
        })
        .filter(function(q) { return q.value !== null; })
        .reverse();

    // Latest quarter summary — uses the "change" field Google Finance already provides
    var latestQuarter = null;
    if (quarterlyResults.length > 0) {
        var lq = quarterlyResults[0];
        latestQuarter = {
            quarter: lq.date,
            revenue: getMetric(lq, "Revenue"),
            revenueChangePercent: getChange(lq, "Revenue"),
            netProfit: getMetric(lq, "Net income"),
            netProfitChangePercent: getChange(lq, "Net income"),
        };
    }

    return {
        revenueCagr3Y: revenueCagr3Y,
        revenueCagr5Y: revenueCagr5Y,
        netProfitCagr3Y: netProfitCagr3Y,
        netProfitCagr5Y: netProfitCagr5Y,
        quarterlyRevenue: quarterlyRevenue,
        ebitdaMarginCurrent: ebitdaMarginCurrent,
        ebitdaMargin5YAgo: ebitdaMargin5YAgo,
        netProfitMarginCurrent: netProfitMarginCurrent,
        netProfitMargin5YAgo: netProfitMargin5YAgo,
        latestQuarter: latestQuarter,
    };
};

// ✅ retry wrapper — SerpApi kabhi kabhi incomplete data deta hai
const getFundamentals = async function(symbol) {
    var maxAttempts = 3;
    var financialData = null;
    var growthHistory = null;
    var lastData = null;

    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log("Fetching fundamentals (attempt " + attempt + " of " + maxAttempts + "):", symbol);

            var data = await fetchGoogleFinance(symbol);
            financialData = extractFinancialData(data);
            growthHistory = extractGrowthHistory(data);
            lastData = data;

            var hasCoreData = financialData.totalAssets && financialData.netIncome;

            if (hasCoreData) {
                console.log("✅ Got complete data on attempt " + attempt);
                break;
            } else {
                console.log("⚠️  Incomplete data on attempt " + attempt + " (totalAssets or netIncome missing)");
            }
        } catch (error) {
            console.log("❌ Attempt " + attempt + " failed:", error.message);
        }
    }

    try {
        var currentPrice = null;
        if (lastData && lastData.summary && lastData.summary.extracted_price) {
            currentPrice = lastData.summary.extracted_price;
        }

        var finalData = {
            fiscalYear: new Date().getFullYear().toString(),
            totalRevenue: financialData ? financialData.totalRevenue : null,
            operatingIncome: financialData ? financialData.operatingIncome : null,
            netIncome: financialData ? financialData.netIncome : null,
            eps: financialData ? financialData.eps : null,
            freeCashFlow: financialData ? financialData.freeCashFlow : null,
            cashFromOperations: financialData ? financialData.cashFromOperations : null,
            totalAssets: financialData ? financialData.totalAssets : null,
            totalDebt: financialData ? financialData.totalDebt : null,
            profitMargin: financialData ? financialData.profitMargin : null,
            debtToEquity: financialData ? financialData.debtToEquity : null,
            currentRatio: financialData ? financialData.currentRatio : null,
            interestCoverage: financialData ? financialData.interestCoverage : null,
            roe: financialData ? financialData.roe : null,
            // ✅ NEW: historical growth data
            // ✅ NEW: historical growth data
            revenueCagr3Y: growthHistory ? growthHistory.revenueCagr3Y : null,
            revenueCagr5Y: growthHistory ? growthHistory.revenueCagr5Y : null,
            netProfitCagr3Y: growthHistory ? growthHistory.netProfitCagr3Y : null,
            netProfitCagr5Y: growthHistory ? growthHistory.netProfitCagr5Y : null,
            quarterlyRevenue: growthHistory ? growthHistory.quarterlyRevenue : [],
            ebitdaMarginCurrent: growthHistory ? growthHistory.ebitdaMarginCurrent : null,
            ebitdaMargin5YAgo: growthHistory ? growthHistory.ebitdaMargin5YAgo : null,
            netProfitMarginCurrent: growthHistory ? growthHistory.netProfitMarginCurrent : null,
            netProfitMargin5YAgo: growthHistory ? growthHistory.netProfitMargin5YAgo : null,
            latestQuarter: growthHistory ? growthHistory.latestQuarter : null,
            peRatio: null,
        };

        console.log("FINAL ALPHA DATA", finalData);

        if (!finalData.totalRevenue && !finalData.netIncome && !finalData.freeCashFlow && !finalData.totalAssets) {
            return { success: false, error: "NO_DATA", data: null };
        }

        return { success: true, symbol: symbol, data: finalData };
    } catch (error) {
        console.log("Fundamental Error:", error.message);
        return { success: false, error: error.message, data: null };
    }
};

const getBalanceSheet = async function(symbol) {
    try {
        var data = await fetchGoogleFinance(symbol);
        var financialData = extractFinancialData(data);
        return {
            success: true,
            symbol: symbol,
            data: {
                totalAssets: financialData.totalAssets,
                totalDebt: financialData.totalDebt,
                debtToEquity: financialData.debtToEquity,
            },
        };
    } catch (error) {
        return { success: false, error: error.message, data: null };
    }
};

const getCashFlow = async function(symbol) {
    try {
        var data = await fetchGoogleFinance(symbol);
        var financialData = extractFinancialData(data);
        return {
            success: true,
            symbol: symbol,
            data: {
                freeCashFlow: financialData.freeCashFlow,
                cashFromOperations: financialData.cashFromOperations,
            },
        };
    } catch (error) {
        return { success: false, error: error.message, data: null };
    }
};

module.exports = {
    getFundamentals: getFundamentals,
    getBalanceSheet: getBalanceSheet,
    getCashFlow: getCashFlow,
};