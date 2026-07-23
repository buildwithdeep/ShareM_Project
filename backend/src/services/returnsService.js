const axios = require("axios");

const SERP_API_KEY = process.env.SERP_API_KEY;
const SERP_BASE_URL = "https://serpapi.com/search";

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

const getRowValue = function(resultRow, name) {
    if (!resultRow.table) return null;
    for (var i = 0; i < resultRow.table.length; i++) {
        var row = resultRow.table[i];
        if (row.title && row.title.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
            return cleanNumber(row.value);
        }
    }
    return null;
};

const average = function(nums) {
    var valid = nums.filter(function(n) {
        return n !== null && n !== undefined && !isNaN(n);
    });
    if (valid.length === 0) return null;
    var sum = valid.reduce(function(a, b) { return a + b; }, 0);
    return sum / valid.length;
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

/**
 * ✅ NEW: Detects the Google Finance currency-mismatch bug that affects
 * dual-listed stocks (Infosys, Wipro, HDFC Bank, etc. that also trade as
 * US ADRs). For these, the "financials" section (Balance Sheet / Income
 * Statement) reports numbers in USD while the live price/key_stats are
 * in INR.
 *
 * We detect this by comparing the SAME metric (EPS) reported in two
 * places: key_stats (always INR) vs the Income Statement (sometimes USD).
 * Their ratio approximates the USD→INR exchange rate. If that ratio
 * looks like a real exchange rate (roughly 40–130), we treat it as a
 * genuine mismatch and use it to convert the USD figures back to INR.
 * If not, we assume everything is already in INR and don't touch it.
 */
const computeFxRate = function(data) {
    try {
        var financials = data.financials || [];
        var income = findSection(financials, "Income");
        if (!income || !income.results) return null;

        var annualIncome = income.results.filter(function(r) { return r.period_type === "Annual"; });
        if (annualIncome.length === 0) return null;

        var epsFromFinancials = getRowValue(annualIncome[0], "Earnings per share") || getRowValue(annualIncome[0], "EPS");

        var epsFromKeyStats = null;
        if (data.knowledge_graph && data.knowledge_graph.key_stats && data.knowledge_graph.key_stats.stats) {
            var stats = data.knowledge_graph.key_stats.stats;
            for (var i = 0; i < stats.length; i++) {
                if (stats[i].label && stats[i].label.toLowerCase() === "eps") {
                    epsFromKeyStats = cleanNumber(stats[i].value);
                }
            }
        }

        if (!epsFromFinancials || !epsFromKeyStats || epsFromFinancials <= 0) return null;

        var rate = epsFromKeyStats / epsFromFinancials;

        if (rate > 40 && rate < 130) {
            return rate;
        }
        return null;
    } catch (e) {
        return null;
    }
};

const extractReturnsRatios = function(financials) {
    var balance = findSection(financials, "Balance");
    if (!balance || !balance.results || !Array.isArray(balance.results)) {
        return {
            roe: null,
            roe3YAvg: null,
            roe5YAvg: null,
            roce: null,
            roce3YAvg: null,
            roce5YAvg: null,
        };
    }

    var annual = balance.results.filter(function(r) { return r.period_type === "Annual"; });

    var roeSeries = annual.map(function(r) { return getRowValue(r, "Return on equity"); });
    var roceSeries = annual.map(function(r) { return getRowValue(r, "Return on capital"); });

    return {
        roe: roeSeries.length > 0 ? roeSeries[0] : null,
        roe3YAvg: average(roeSeries.slice(0, 3)),
        roe5YAvg: average(roeSeries.slice(0, 5)),
        roce: roceSeries.length > 0 ? roceSeries[0] : null,
        roce3YAvg: average(roceSeries.slice(0, 3)),
        roce5YAvg: average(roceSeries.slice(0, 5)),
    };
};

const extractDividendData = function(financials, currentPrice, fxRate) {
    fxRate = fxRate || 1; // default: no conversion agar rate na diya jaye

    var cash = findSection(financials, "Cash");
    var income = findSection(financials, "Income");
    var balance = findSection(financials, "Balance");

    var result = {
        dividendHistory: [],
        dividendPayoutRatio: null,
        dividendYield: null,
        dividendConsistency: null,
    };

    if (!cash || !cash.results) return result;

    var annualCash = cash.results.filter(function(r) { return r.period_type === "Annual"; });

    var sharesOutstanding = null;
    if (balance && balance.results && balance.results[0]) {
        sharesOutstanding = getRowValue(balance.results[0], "Shares outstanding");
    }

    var last5 = annualCash.slice(0, 5).reverse();
    var paidCount = 0;

    result.dividendHistory = last5.map(function(r) {
        var paid = getRowValue(r, "Common dividends paid");
        var absPaid = paid !== null ? Math.abs(paid) : null;
        if (absPaid && absPaid > 0) paidCount++;

        var perShare = null;
        if (absPaid && sharesOutstanding && sharesOutstanding > 0) {
            // ✅ fxRate conversion added here — reporting currency -> price currency
            perShare = Number(((absPaid * fxRate) / sharesOutstanding).toFixed(2));
        }

        return { year: r.date, value: perShare };
    }).filter(function(d) { return d.value !== null; });

    result.dividendConsistency = last5.length > 0 ? (paidCount + " / " + last5.length + " years paid") : null;

    if (annualCash.length > 0 && income && income.results) {
        var latestCashYear = annualCash[0];
        var dividendPaidLatest = getRowValue(latestCashYear, "Common dividends paid");

        var matchingIncomeYear = income.results.filter(function(r) {
            return r.period_type === "Annual" && r.date === latestCashYear.date;
        })[0];

        if (matchingIncomeYear && dividendPaidLatest !== null) {
            var netIncomeLatest = getRowValue(matchingIncomeYear, "Net income");
            if (netIncomeLatest && netIncomeLatest !== 0) {
                // payout ratio dono values same currency me hain (cash flow ÷ income), fxRate ki zarurat nahi
                result.dividendPayoutRatio = Number(((Math.abs(dividendPaidLatest) / netIncomeLatest) * 100).toFixed(1));
            }
        }
    }

    if (result.dividendHistory.length > 0 && currentPrice) {
        var latestPerShare = result.dividendHistory[result.dividendHistory.length - 1].value;
        if (latestPerShare && currentPrice > 0) {
            result.dividendYield = Number(((latestPerShare / currentPrice) * 100).toFixed(2));
        }
    }

    return result;
};

const deriveHistoricalPrice = function(balanceYearRow) {
    var pb = getRowValue(balanceYearRow, "Price to book");
    var bvps = getRowValue(balanceYearRow, "Book value per share");
    if (pb === null || bvps === null) return null;
    return pb * bvps;
};

/**
 * ✅ UPDATED: Now corrects for the USD/INR mismatch using the fx rate
 * derived above, instead of discarding the data.
 */
const extractPeAndPb = function(data) {
    var result = { peRatio: null, pbRatio: null, pb5YAvg: null, pe5YAvg: null };

    if (data.knowledge_graph && data.knowledge_graph.key_stats && data.knowledge_graph.key_stats.stats) {
        var stats = data.knowledge_graph.key_stats.stats;
        for (var i = 0; i < stats.length; i++) {
            if (stats[i].label && stats[i].label.toLowerCase().indexOf("p/e") !== -1) {
                var rawPe = cleanNumber(stats[i].value);
                result.peRatio = (rawPe !== null && rawPe > 0) ? rawPe : null;
            }
        }
    }

    var fxRate = computeFxRate(data);

    var financials = data.financials || [];
    var balance = findSection(financials, "Balance");
    var income = findSection(financials, "Income");

    if (balance && balance.results) {
        var annualBalance = balance.results.filter(function(r) { return r.period_type === "Annual"; });

        // Google's own "Price to book" row = INR price ÷ USD book value
        // when there's a mismatch — dividing by fxRate undoes that.
        var pbSeriesRaw = annualBalance.map(function(r) { return getRowValue(r, "Price to book"); });
        var pbSeries = fxRate ?
            pbSeriesRaw.map(function(v) { return v !== null ? v / fxRate : null; }) :
            pbSeriesRaw;

        result.pbRatio = pbSeries.length > 0 ? pbSeries[0] : null;
        result.pb5YAvg = average(pbSeries.slice(0, 5));

        if (income && income.results) {
            var annualIncome = income.results.filter(function(r) { return r.period_type === "Annual"; });

            var peSeries = annualBalance.slice(0, 5).map(function(bYear) {
                var matchingIncome = annualIncome.filter(function(r) { return r.date === bYear.date; })[0];
                if (!matchingIncome) return null;

                // historicalPrice = rawPB × USD_BVPS. Since rawPB already
                // equals INR_price ÷ USD_BVPS when mismatched, multiplying
                // back recovers the correct INR price — no fix needed here.
                var historicalPrice = deriveHistoricalPrice(bYear);
                var eps = getRowValue(matchingIncome, "Earnings per share") || getRowValue(matchingIncome, "EPS");

                if (historicalPrice === null || !eps || eps === 0) return null;

                // EPS comes from the same (possibly USD) Income Statement —
                // convert it to INR before dividing into the INR price.
                var epsAdjusted = fxRate ? eps * fxRate : eps;

                return historicalPrice / epsAdjusted;
            });

            var positivePeSeries = peSeries.map(function(v) {
                return (v !== null && v > 0) ? v : null;
            });
            result.pe5YAvg = average(positivePeSeries);
        }
    }

    return result;
};

/**
 * ✅ UPDATED: Cash, debt, and EBITDA (all from the same USD-affected
 * sections) are converted to INR using fxRate before being combined
 * with the INR-denominated market cap.
 */
const extractEvEbitda = function(data, yahooMarketCap) {
    var result = { evEbitda: null, evEbitda5YAvg: null };

    var financials = data.financials || [];
    var balance = findSection(financials, "Balance");
    var income = findSection(financials, "Income");

    if (!balance || !balance.results || !income || !income.results) return result;

    var fxRate = computeFxRate(data);
    var currentMarketCap = yahooMarketCap || null;

    var annualBalance = balance.results.filter(function(r) { return r.period_type === "Annual"; });
    var annualIncome = income.results.filter(function(r) { return r.period_type === "Annual"; });

    var getTotalDebt = function(bYear) {
        var shortDebt = getRowValue(bYear, "Short term borrowings") || 0;
        var currentPortionDebt = getRowValue(bYear, "Current portion long term debt") || 0;
        var longDebt = getRowValue(bYear, "Long term debt") || 0;
        return shortDebt + currentPortionDebt + longDebt;
    };

    if (annualBalance.length > 0 && currentMarketCap) {
        var bYear0 = annualBalance[0];
        var matchingIncome0 = annualIncome.filter(function(r) { return r.date === bYear0.date; })[0];

        if (matchingIncome0) {
            var cash0Raw = getRowValue(bYear0, "Cash and equivalents") || 0;
            var totalDebt0Raw = getTotalDebt(bYear0);
            var ebitda0Raw = getRowValue(matchingIncome0, "EBITDA");

            var cash0 = fxRate ? cash0Raw * fxRate : cash0Raw;
            var totalDebt0 = fxRate ? totalDebt0Raw * fxRate : totalDebt0Raw;
            var ebitda0 = (fxRate && ebitda0Raw) ? ebitda0Raw * fxRate : ebitda0Raw;

            if (ebitda0) {
                var ev0 = currentMarketCap + totalDebt0 - cash0;
                result.evEbitda = Number((ev0 / ebitda0).toFixed(2));
            }
        }
    }

    var evEbitdaSeries = annualBalance.slice(0, 5).map(function(bYear) {
        var matchingIncome = annualIncome.filter(function(r) { return r.date === bYear.date; })[0];
        if (!matchingIncome) return null;

        var historicalPrice = deriveHistoricalPrice(bYear);
        var sharesOutstanding = getRowValue(bYear, "Shares outstanding");
        var ebitdaRaw = getRowValue(matchingIncome, "EBITDA");

        if (historicalPrice === null || !sharesOutstanding || !ebitdaRaw) return null;

        var cashRaw = getRowValue(bYear, "Cash and equivalents") || 0;
        var totalDebtRaw = getTotalDebt(bYear);

        var cash = fxRate ? cashRaw * fxRate : cashRaw;
        var totalDebt = fxRate ? totalDebtRaw * fxRate : totalDebtRaw;
        var ebitda = fxRate ? ebitdaRaw * fxRate : ebitdaRaw;

        var approxMarketCap = historicalPrice * sharesOutstanding;
        var ev = approxMarketCap + totalDebt - cash;

        return ev / ebitda;
    });

    result.evEbitda5YAvg = average(evEbitdaSeries);

    return result;
};

const getReturnsData = async function(symbol, yahooMarketCap) {
    try {
        console.log("Fetching returns data for:", symbol);

        var data = await fetchGoogleFinance(symbol);
        var financials = data.financials || [];

        var currentPrice = null;
        if (data.summary && data.summary.extracted_price) {
            currentPrice = data.summary.extracted_price;
        }

        // ✅ fxRate ab yahin nikal lo, taaki dividend function ko bhi mil sake
        var fxRate = computeFxRate(data);

        var ratios = extractReturnsRatios(financials);
        var dividends = extractDividendData(financials, currentPrice, fxRate); // ✅ fxRate pass kiya
        var peb = extractPeAndPb(data);
        var evEbitda = extractEvEbitda(data, yahooMarketCap);

        var finalData = {
            roe: ratios.roe,
            roe3YAvg: ratios.roe3YAvg,
            roe5YAvg: ratios.roe5YAvg,
            roce: ratios.roce,
            roce3YAvg: ratios.roce3YAvg,
            roce5YAvg: ratios.roce5YAvg,
            dividendHistory: dividends.dividendHistory,
            dividendPayoutRatio: dividends.dividendPayoutRatio,
            dividendYield: dividends.dividendYield,
            dividendConsistency: dividends.dividendConsistency,
            peRatio: peb.peRatio,
            pbRatio: peb.pbRatio,
            pb5YAvg: peb.pb5YAvg,
            pe5YAvg: peb.pe5YAvg,
            evEbitda: evEbitda.evEbitda,
            evEbitda5YAvg: evEbitda.evEbitda5YAvg,
            source: "Google Finance",
        };

        var isSane = function(value, maxReasonable) {
            return value === null || (value > 0 && value < maxReasonable);
        };
        if (!isSane(finalData.pbRatio, 50)) finalData.pbRatio = null;
        if (!isSane(finalData.pb5YAvg, 50)) finalData.pb5YAvg = null;
        if (!isSane(finalData.evEbitda, 100)) finalData.evEbitda = null;
        if (!isSane(finalData.evEbitda5YAvg, 100)) finalData.evEbitda5YAvg = null;
        if (!isSane(finalData.pe5YAvg, 100)) finalData.pe5YAvg = null;

        console.log("FINAL RETURNS DATA:", finalData);

        return { success: true, symbol: symbol, data: finalData };
    } catch (error) {
        console.log("Returns data error:", error.message);
        return { success: false, error: error.message, data: null };
    }
};

module.exports = {
    getReturnsData: getReturnsData,
};