// src/controllers/newsController.js

const Company = require('../models/Company');
const newsService = require('../services/newsService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getNews = async(req, res) => {
    try {
        const { symbol } = req.params;

        // Validate symbol
        if (!symbol || symbol.trim().length === 0) {
            return errorResponse(res, 'Stock symbol is required', 400);
        }

        const upperSymbol = symbol.toUpperCase().trim();

        // Find company
        const company = await Company.findOne({ nseSymbol: upperSymbol });

        if (!company) {
            return errorResponse(res, `Company "${upperSymbol}" not found`, 404);
        }

        // Fetch news
        console.log(`📰 Fetching news for ${company.companyName}...`);

        const news = await newsService.getCompanyNews(company.companyName);

        return successResponse(res, {
            company: company.companyName,
            symbol: upperSymbol,
            newsCount: news.length,
            news: news
        });

    } catch (error) {
        console.error('News error:', error);
        return errorResponse(res, 'Failed to fetch news: ' + error.message, 500);
    }
};

module.exports = {
    getNews
};