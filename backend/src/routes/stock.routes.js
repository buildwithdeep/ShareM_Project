// src/routes/stock.routes.js

const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

/**
 * ROUTE: GET /api/stock/:symbol
 * 
 * What it does:
 * - Receive company symbol (RELIANCE)
 * - Fetch all financial data
 * - Send to AI for analysis
 * - Return complete report
 * 
 * Example Request:
 * GET /api/stock/RELIANCE
 * 
 * Example Response:
 * {
 *   success: true,
 *   data: {
 *     snapshot: {...},
 *     valuation: {...},
 *     fundamentals: {...},
 *     aiView: {...}
 *   }
 * }
 */
router.get('/:symbol', stockController.getStockReport);

module.exports = router;