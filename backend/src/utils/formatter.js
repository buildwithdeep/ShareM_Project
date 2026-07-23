// src/utils/formatter.js

const formatStockReport = ({
    company,
    yahooData,
    alphaData,
    healthData,
    returnsData, // now also contains peRatio, pbRatio, pb5YAvg, evEbitda, evEbitda5YAvg
    newsData,
    aiAnalysis,
}) => {

    let calculatedRoe = null;
    const totalAssetsVal = alphaData && alphaData.totalAssets;
    const netIncomeVal = alphaData && alphaData.netIncome;
    const deRatio = (healthData && healthData.debtToEquity) || (alphaData && alphaData.debtToEquity);

    if (totalAssetsVal && netIncomeVal && deRatio !== null && deRatio !== undefined) {
        const equity = totalAssetsVal / (1 + deRatio);
        if (equity > 0) {
            calculatedRoe = (netIncomeVal / equity) * 100;
        }
    }

    console.log("🔍 ROE DEBUG:", {
        totalAssetsVal: totalAssetsVal,
        netIncomeVal: netIncomeVal,
        deRatio: deRatio,
        calculatedRoe: calculatedRoe,
    });

    return {
        company: {
            name: company.companyName,
            nseSymbol: company.nseSymbol,
            bseCode: company.bseCode,
            isin: company.isin,
            sector: company.sector,
            industry: company.industry,
        },

        snapshot: yahooData ? {
            currentPrice: yahooData.currentPrice || 0,
            previousClose: yahooData.previousClose || 0,
            dayChange: yahooData.dayChange || 0,
            dayChangePercent: yahooData.dayChangePercent || 0,
            dayHigh: yahooData.dayHigh || 0,
            dayLow: yahooData.dayLow || 0,
            volume: yahooData.volume || 0,
            marketCap: yahooData.marketCap || (alphaData && alphaData.marketCap) || 0,
            fiftyTwoWeekHigh: yahooData.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: yahooData.fiftyTwoWeekLow || 0,
            lastFetched: yahooData.fetchedAt || new Date(),
        } : null,

        // ✅ UPDATED: pbRatio, pb5YAvg, evEbitda, evEbitda5YAvg now read from returnsData
        valuation: {
            peRatio: (returnsData && returnsData.peRatio) || (alphaData && alphaData.peRatio) || (yahooData && yahooData.trailingPE) || null,
            pe5YAvg: (returnsData && returnsData.pe5YAvg) || null,
            pbRatio: (returnsData && returnsData.pbRatio) || (alphaData && alphaData.pbRatio) || (yahooData && yahooData.priceToBook) || null,
            pb5YAvg: (returnsData && returnsData.pb5YAvg) || null,
            evEbitda: (returnsData && returnsData.evEbitda) || null,
            evEbitda5YAvg: (returnsData && returnsData.evEbitda5YAvg) || null,
            dividendYield: (returnsData && returnsData.dividendYield) || (alphaData && alphaData.dividendYield) || (yahooData && yahooData.dividendYield) || null,
            source: (returnsData && returnsData.source) || null,
        },

        fundamentals: {
            revenue: (alphaData && alphaData.totalRevenue) || null,
            netProfit: (alphaData && alphaData.netIncome) || null,
            operatingIncome: (alphaData && alphaData.operatingIncome) || null,
            eps: (alphaData && alphaData.eps) || null,
            profitMargin: (alphaData && alphaData.profitMargin) || null,
            roe: (returnsData && returnsData.roe) || calculatedRoe || (alphaData && alphaData.roe) || null,
            roa: (alphaData && alphaData.roa) || null,
            fiscalYear: (alphaData && alphaData.fiscalYear) || "N/A",
        },

        health: {
            debtToEquity: (healthData && healthData.debtToEquity) || (alphaData && alphaData.debtToEquity) || null,
            currentRatio: (healthData && healthData.currentRatio) || (alphaData && alphaData.currentRatio) || null,
            interestCoverage: (alphaData && alphaData.interestCoverage) || null,
            operatingCashFlow: (healthData && healthData.operatingCashFlow) || (alphaData && alphaData.cashFromOperations) || null,
        },

        growth: {
            revenue: (alphaData && alphaData.totalRevenue) || 0,
            netProfit: (alphaData && alphaData.netIncome) || 0,
            operatingIncome: (alphaData && alphaData.operatingIncome) || 0,
            eps: (alphaData && alphaData.eps) || 0,
            profitMargin: (alphaData && alphaData.profitMargin) || 0,
            revenueCagr3Y: (alphaData && alphaData.revenueCagr3Y) || null,
            revenueCagr5Y: (alphaData && alphaData.revenueCagr5Y) || null,
            netProfitCagr3Y: (alphaData && alphaData.netProfitCagr3Y) || null,
            netProfitCagr5Y: (alphaData && alphaData.netProfitCagr5Y) || null,
            quarterlyRevenue: (alphaData && alphaData.quarterlyRevenue) || [],
            ebitdaMarginCurrent: (alphaData && alphaData.ebitdaMarginCurrent) || null,
            ebitdaMargin5YAgo: (alphaData && alphaData.ebitdaMargin5YAgo) || null,
            netProfitMarginCurrent: (alphaData && alphaData.netProfitMarginCurrent) || null,
            netProfitMargin5YAgo: (alphaData && alphaData.netProfitMargin5YAgo) || null,
            latestQuarter: (alphaData && alphaData.latestQuarter) || null,
        },

        returns: {
            roe: (returnsData && returnsData.roe) || calculatedRoe || (alphaData && alphaData.roe) || null,
            roe3YAvg: (returnsData && returnsData.roe3YAvg) || null,
            roe5YAvg: (returnsData && returnsData.roe5YAvg) || null,
            roce: (returnsData && returnsData.roce) || null,
            roce3YAvg: (returnsData && returnsData.roce3YAvg) || null,
            roce5YAvg: (returnsData && returnsData.roce5YAvg) || null,
            dividendYield: (returnsData && returnsData.dividendYield) || (alphaData && alphaData.dividendYield) || (yahooData && yahooData.dividendYield) || null,
            dividendPayoutRatio: (returnsData && returnsData.dividendPayoutRatio) || null,
            dividendConsistency: (returnsData && returnsData.dividendConsistency) || null,
            dividendHistory: (returnsData && returnsData.dividendHistory) || [],
            source: (returnsData && returnsData.source) || null,
        },

        news: Array.isArray(newsData) ? newsData.slice(0, 5) : [],

        aiAnalysis: aiAnalysis || { error: "AI_ANALYSIS_UNAVAILABLE" },

        reportGeneratedAt: new Date().toISOString(),
    };
};

module.exports = { formatStockReport };