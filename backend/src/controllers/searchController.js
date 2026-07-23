// src/controllers/searchController.js

const Company = require('../models/Company');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const searchCompanies = async(req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length === 0) {
            return errorResponse(res, 'Search query cannot be empty', 400);
        }

        const cleanQuery = query.trim();

        // ✅ FIX: Prefix-based regex match instead of MongoDB $text search.
        // $text does word-level matching (matches anywhere), which felt
        // random. This matches company name / symbol / alias that START
        // WITH what the user typed — so "t" shows all T-companies,
        // "ta" narrows to TA-companies, etc.
        const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp('^' + escapedQuery, 'i');

        const companies = await Company.find({
                $or: [
                    { companyName: prefixRegex },
                    { nseSymbol: prefixRegex },
                    { aliases: prefixRegex },
                ],
            })
            .sort({ companyName: 1 }) // alphabetical, since there's no relevance score with regex
            .limit(10);

        return successResponse(res, {
            query: cleanQuery,
            resultCount: companies.length,
            companies: companies.map(company => ({
                companyName: company.companyName,
                nseSymbol: company.nseSymbol,
                sector: company.sector,
                bseCode: company.bseCode,
            })),
        });

    } catch (error) {
        console.error('Search error:', error);
        return errorResponse(res, 'Search failed: ' + error.message, 500);
    }
};

module.exports = {
    searchCompanies
};