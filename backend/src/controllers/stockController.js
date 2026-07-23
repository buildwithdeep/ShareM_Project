// src/controllers/stockController.js

const Company = require("../models/Company");
const ReportCache = require("../models/ReportCache");
const yahooService = require("../services/yahooService");
const alphaService = require("../services/alphaService");
const returnsService = require("../services/returnsService");
const newsService = require("../services/newsService");
const geminiService = require("../services/geminiService");
const formatter = require("../utils/formatter");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const getStockReport = async(req, res) => {
    try {
        const { symbol } = req.params;

        if (!symbol || symbol.trim().length === 0) {
            return errorResponse(res, "Stock symbol is required", 400);
        }

        const upperSymbol = symbol.toUpperCase().trim();

        console.log("\n📍 Searching for company: " + upperSymbol);

        const company = await Company.findOne({ nseSymbol: upperSymbol });

        if (!company) {
            return errorResponse(
                res,
                "Company with symbol \"" + upperSymbol + "\" not found in database",
                404,
            );
        }

        console.log("✅ Company found: " + company.companyName);

        // CHECK CACHE
        console.log("\n🔍 Checking cache for " + upperSymbol + "...");

        const cachedReport = await ReportCache.findOne({ nseSymbol: upperSymbol });

        if (cachedReport && cachedReport.reportData) {
            const reportData = cachedReport.reportData;

            const hasValidSnapshot =
                reportData.snapshot &&
                reportData.snapshot.currentPrice &&
                reportData.snapshot.currentPrice > 0;

            const hasValidFundamentals =
                reportData.fundamentals &&
                (reportData.fundamentals.marketCap ||
                    reportData.fundamentals.peRatio);

            if (hasValidSnapshot && hasValidFundamentals) {
                console.log("✅ Cache hit! Returning cached report...");
                return successResponse(res, {
                    source: "cache",
                    cachedAt: cachedReport.cachedAt,
                    expiresIn: "1 hour",
                    data: reportData,
                });
            }
        }

        console.log("\n📊 Fetching fresh data for " + upperSymbol + "...");

        let yahooData = await yahooService.getLivePrice(upperSymbol);
        console.log("🔥 RAW YAHOO:", JSON.stringify(yahooData, null, 2));

        if (!yahooData.success) {
            console.log("❌ Live price service failed");
        }

        let healthData = await yahooService.getFinancialHealth(upperSymbol);
        console.log("🔥 RAW HEALTH:", JSON.stringify(healthData, null, 2));

        let alphaData = await alphaService.getFundamentals(upperSymbol);
        console.log("🔥 RAW ALPHA:", JSON.stringify(alphaData, null, 2));

        // returnsService now also includes P/E, P/B, EV/EBITDA in the same call
        let returnsData = await returnsService.getReturnsData(
            upperSymbol,
            yahooData.success ? yahooData.data.marketCap : null
        );
        console.log("🔥 RAW RETURNS:", JSON.stringify(returnsData, null, 2));

        const newsData = await newsService
            .getCompanyNews(company.companyName)
            .catch(function(err) {
                console.warn("⚠️  News error:", err.message);
                return [];
            });

        console.log("\n✅ Data Status:");
        console.log("   Stock Price: " + (yahooData.success ? "✅" : "❌"));
        console.log("   Fundamentals: " + (alphaData.success ? "✅" : "❌"));
        console.log("   Returns: " + (returnsData.success ? "✅" : "❌"));
        console.log("   News: " + (Array.isArray(newsData) ? "✅" : "❌"));

        let aiAnalysis = { error: "SKIPPED" };

        if (yahooData.success) {
            console.log("\n🤖 Sending data to Gemini AI...");

            aiAnalysis = await geminiService
                .analyzeStock({
                    companyName: company.companyName,
                    symbol: upperSymbol,
                    sector: company.sector,
                    yahooData: yahooData.data,
                    alphaData: alphaData.data,
                    newsData: newsData,
                })
                .catch(function(err) {
                    console.warn("⚠️  Gemini error:", err.message);
                    return { error: "AI_ANALYSIS_ERROR", message: err.message };
                });
        } else {
            console.warn("⚠️  Skipping AI analysis - incomplete market data");
        }

        console.log("\n📋 Formatting final report...");

        const finalReport = formatter.formatStockReport({
            company: company,
            yahooData: yahooData.success ? yahooData.data : null,
            alphaData: alphaData.success ? alphaData.data : null,
            healthData: healthData.success ? healthData.data : null,
            returnsData: returnsData.success ? returnsData.data : null,
            newsData: Array.isArray(newsData) ? newsData : [],
            aiAnalysis: aiAnalysis.success ? aiAnalysis.data : null,
        });

        console.log("\n✅ Report structure:");
        console.log("   Company: " + (finalReport.company && finalReport.company.name ? "✅" : "❌"));
        console.log("   Snapshot: " + (finalReport.snapshot ? "✅" : "❌"));
        console.log("   Valuation: " + (finalReport.valuation ? "✅" : "❌"));
        console.log("   Fundamentals: " + (finalReport.fundamentals ? "✅" : "❌"));
        console.log("   Returns: " + (finalReport.returns ? "✅" : "❌"));
        console.log("   News: " + (finalReport.news && finalReport.news.length ? "✅" : "❌"));
        console.log("   AI Analysis: " + (aiAnalysis.success ? "✅" : "⏭️  Skipped"));

        // SAVE TO CACHE
        console.log("\n💾 Saving to cache...");

        try {
            await ReportCache.findOneAndUpdate({ nseSymbol: upperSymbol }, {
                nseSymbol: upperSymbol,
                reportData: finalReport,
                cachedAt: new Date(),
                expiresAt: new Date(Date.now() + 3600000),
            }, { upsert: true, new: true }, );
            console.log("✅ Cached successfully");
        } catch (cacheError) {
            console.warn("⚠️  Cache error (continuing):", cacheError.message);
        }

        console.log("\n✨ Report ready!\n");

        return successResponse(res, {
            source: "fresh",
            fetchedAt: new Date().toISOString(),
            expiresIn: "1 hour",
            data: finalReport,
        });
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        return errorResponse(
            res,
            "Failed to generate stock report: " + error.message,
            500,
        );
    }
};

module.exports = { getStockReport };