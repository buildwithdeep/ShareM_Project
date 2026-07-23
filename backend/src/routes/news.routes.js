// src/routes/news.routes.js

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

/**
 * ROUTE: GET /api/news/:symbol
 * 
 * What it does:
 * - Fetch latest news for a company
 * - Return news articles
 * 
 * Example Request:
 * GET /api/news/RELIANCE
 * 
 * Example Response:
 * {
 *   success: true,
 *   news: [
 *     {
 *       title: 'Reliance Q4 Results',
 *       link: 'url...',
 *       pubDate: '2024-01-15'
 *     }
 *   ]
 * }
 */
router.get('/:symbol', newsController.getNews);

module.exports = router;