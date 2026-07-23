// src/services/geminiService.js

const axios = require("axios");
const apiConfig = require("../config/apiConfig");

/**
 * Send financial data to Google Gemini for analysis
 */
const analyzeStock = async(financialData) => {
    try {
        console.log("🤖 Sending data to Gemini AI for analysis...");

        const API_KEY = apiConfig.gemini.apiKey;

        if (!API_KEY) {
            console.error("❌ GEMINI_API_KEY not found");
            return {
                success: false,
                error: "GEMINI_API_KEY_MISSING",
                message: "Gemini API key not configured",
            };
        }

        const prompt = prepareAnalysisPrompt(financialData);
        const model = apiConfig.gemini.models.flash;

        const url =
            apiConfig.gemini.baseURL +
            "/models/" +
            model +
            ":generateContent?key=" +
            API_KEY;

        console.log("📡 Calling Gemini API with model:", model);

        const response = await axios.post(
            url, {
                contents: [{
                    parts: [{ text: prompt }],
                }, ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 3000,
                    responseMimeType: "application/json",
                    thinkingConfig: {
                        thinkingBudget: 0,
                    },
                },
            }, {
                headers: { "Content-Type": "application/json" },
                timeout: 30000,
            }
        );

        const candidates = response.data && response.data.candidates;

        if (!candidates || candidates.length === 0) {
            console.error("❌ No response from Gemini");
            return {
                success: false,
                error: "NO_RESPONSE",
                message: "Gemini returned no response",
            };
        }

        const aiResponse = candidates[0].content.parts[0].text;
        const analysis = parseAIResponse(aiResponse);

        console.log("✅ AI analysis successful");
        return {
            success: true,
            data: analysis,
            rawResponse: aiResponse,
            model: model,
        };
    } catch (error) {
        console.error("❌ AI error:", error.message);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 400) {
                return {
                    success: false,
                    error: "BAD_REQUEST",
                    message: "Invalid request to Gemini API",
                };
            } else if (error.response.status === 403) {
                return {
                    success: false,
                    error: "API_KEY_INVALID",
                    message: "Invalid Gemini API key",
                };
            } else if (error.response.status === 429) {
                return {
                    success: false,
                    error: "RATE_LIMIT_EXCEEDED",
                    message: "Gemini API rate limit exceeded. Please try again later.",
                };
            }
        }

        return {
            success: false,
            error: "AI_ANALYSIS_FAILED",
            message: error.message || "Failed to analyze stock",
        };
    }
};

/**
 * Prepare the prompt for Gemini
 */
const prepareAnalysisPrompt = (data) => {
        const { companyName, symbol, sector, yahooData, alphaData, newsData } = data;

        const currentDate = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        const yahooDataObj = yahooData || {};
        const alphaDataObj = alphaData || {};
        const newsArray = Array.isArray(newsData) ? newsData : [];

        let prompt = `Current Date: ${currentDate} IST

You are a professional Indian stock market analyst. Analyze ${companyName} (${symbol}) from NSE India based ONLY on the data below. Do not invent numbers not provided here.

SECTOR: ${sector}

MARKET DATA:
- Current Price: ₹${yahooDataObj.currentPrice || "N/A"}
- Day Change: ${yahooDataObj.dayChange || "N/A"} (${yahooDataObj.dayChangePercent || "N/A"}%)
- 52 Week High/Low: ₹${yahooDataObj.fiftyTwoWeekHigh || "N/A"} / ₹${yahooDataObj.fiftyTwoWeekLow || "N/A"}
- Market Cap: ₹${yahooDataObj.marketCap ? (yahooDataObj.marketCap / 10000000).toFixed(2) + " Cr" : "N/A"}

FUNDAMENTALS:
- P/E Ratio: ${alphaDataObj.trailingPE || alphaDataObj.peRatio || "N/A"}
- Price to Book: ${alphaDataObj.priceToBook || alphaDataObj.pbRatio || "N/A"}
- Dividend Yield: ${alphaDataObj.dividendYield || "N/A"}%
${alphaDataObj.netIncome ? `- Net Income: ₹${(alphaDataObj.netIncome / 10000000).toFixed(2)} Cr` : ""}
${alphaDataObj.totalRevenue ? `- Revenue: ₹${(alphaDataObj.totalRevenue / 10000000).toFixed(2)} Cr` : ""}
${alphaDataObj.profitMargin ? `- Profit Margin: ${alphaDataObj.profitMargin.toFixed(2)}%` : ""}
${alphaDataObj.roe ? `- ROE: ${alphaDataObj.roe.toFixed(2)}%` : ""}
${alphaDataObj.debtToEquity !== null && alphaDataObj.debtToEquity !== undefined ? `- Debt to Equity: ${alphaDataObj.debtToEquity}` : ""}

RECENT NEWS:
`;

    if (newsArray.length > 0) {
        newsArray.slice(0, 5).forEach((news, index) => {
            const title = news.title || news.headline || "No title";
            const source = news.source || news.publisher || "Unknown";
            prompt += `${index + 1}. ${title} (${source})\n`;
        });
    } else {
        prompt += "No recent news available\n";
    }

    prompt += `

Return ONLY valid JSON with this EXACT structure, no markdown, no explanation outside the JSON:

{
  "verdict": "STRONG FUNDAMENTALS" or "MODERATE FUNDAMENTALS" or "WEAK FUNDAMENTALS",
  "summary": "2-3 sentence high level overview of the company's investment case, mentioning valuation, balance sheet, and current pressure/momentum",
  "whatWorks": [
    { "title": "Short 3-6 word headline", "detail": "1-2 sentence explanation using the actual numbers given above" },
    { "title": "...", "detail": "..." },
    { "title": "...", "detail": "..." }
  ],
  "whatToWatch": [
    { "title": "Short 3-6 word headline", "detail": "1-2 sentence explanation of the risk or concern" },
    { "title": "...", "detail": "..." }
  ],
  "trackGoingForward": [
    "One sentence about a specific upcoming event or metric to monitor",
    "Another sentence about what to watch next"
  ],
  "opportunities": [
    "Short opportunity statement 1",
    "Short opportunity statement 2",
    "Short opportunity statement 3",
    "Short opportunity statement 4",
    "Short opportunity statement 5"
  ],
  "risks": [
    "Short risk statement 1",
    "Short risk statement 2",
    "Short risk statement 3",
    "Short risk statement 4",
    "Short risk statement 5"
  ]
}

Base every point strictly on the data provided. If a data point is N/A, do not make up a number for it — reason qualitatively instead. Return ONLY the JSON object.`;

    return prompt;
};

/**
 * Parse Gemini's JSON response
 */
const parseAIResponse = (response) => {
    try {
        let cleanResponse = response.trim();
        cleanResponse = cleanResponse.replace(/```json\s*/g, "");
        cleanResponse = cleanResponse.replace(/```\s*/g, "");
        cleanResponse = cleanResponse.trim();

        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return fillMissingFields(parsed);
        }

        console.warn("⚠️ No JSON found in Gemini response");
        console.log("🔍 RAW GEMINI TEXT:", response);
        return getDefaultAnalysis();
    } catch (error) {
        console.error("❌ Parse error:", error.message);
        return getDefaultAnalysis();
    }
};

const fillMissingFields = (parsed) => {
    return {
        verdict: parsed.verdict || "MODERATE FUNDAMENTALS",
        summary: parsed.summary || "Analysis unavailable due to incomplete data.",
        whatWorks: Array.isArray(parsed.whatWorks) ? parsed.whatWorks : [],
        whatToWatch: Array.isArray(parsed.whatToWatch) ? parsed.whatToWatch : [],
        trackGoingForward: Array.isArray(parsed.trackGoingForward)
            ? parsed.trackGoingForward
            : [],
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    };
};

const getDefaultAnalysis = () => {
    return {
        verdict: "MODERATE FUNDAMENTALS",
        summary: "Unable to generate analysis due to insufficient data.",
        whatWorks: [],
        whatToWatch: [],
        trackGoingForward: [],
        opportunities: [],
        risks: [],
    };
};

module.exports = {
    analyzeStock,
};