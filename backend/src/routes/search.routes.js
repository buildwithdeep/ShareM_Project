// src/routes/search.routes.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
 * WHAT IS THIS FILE?
 * 
 * This defines the SEARCH API endpoint.
 * 
 * Frontend will call:
 * GET http://localhost:5000/api/search?query=rel
 * 
 * This file says:
 * "When someone calls /search with a query, 
 *  run searchController.searchCompanies function"
 */

/**
 * ROUTE: GET /api/search
 * 
 * What it does:
 * - Receive search query from frontend
 * - Find matching companies in database
 * - Return list of companies
 * 
 * Example Request:
 * GET /api/search?query=rel
 * 
 * Example Response:
 * {
 *   success: true,
 *   results: [
 *     { companyName: 'RELIANCE', nseSymbol: 'RELIANCE' },
 *     { companyName: 'RELIANCE POWER', nseSymbol: 'RELPOWER' }
 *   ]
 * }
 */
router.get('/', searchController.searchCompanies);

module.exports = router;