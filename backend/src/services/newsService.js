// src/services/newsService.js

const axios = require('axios');
const xml2js = require('xml2js');

/**
 * WHAT IS THIS SERVICE?
 * 
 * Google News provides an RSS feed (free, no API key needed).
 * 
 * RSS = Really Simple Syndication
 * It's like a newspaper format that computers can read.
 * 
 * This service:
 * 1. Requests RSS feed for a company name
 * 2. Parses XML to JSON
 * 3. Extracts headline, link, date
 * 4. Returns clean data
 */

const parser = new xml2js.Parser();

/**
 * Get latest news for a company
 * 
 * @param {string} companyName - Company name (e.g., "Reliance Industries")
 * @returns {Array} News articles
 */
const getCompanyNews = async(companyName) => {
    try {
        console.log(`📰 Fetching news for ${companyName}...`);

        // Build Google News RSS URL
        const googleNewsURL = 'https://news.google.com/rss/search';

        // Make request to Google News RSS
        const response = await axios.get(googleNewsURL, {
            params: {
                q: companyName, // Search query
                hl: 'en-IN', // English language, India
                gl: 'IN' // India location
            },
            timeout: 10000
        });

        // Parse XML response to JSON
        const parsedData = await parser.parseStringPromise(response.data);

        // Extract articles
        const articles = parsedData.rss.channel[0].item || [];

        // Format and clean articles
        const formattedNews = articles.slice(0, 10).map(article => ({
            title: article.title ? article.title[0] : 'No title',
            link: article.link ? article.link[0] : null,
            description: article.description ?
                article.description[0]
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .substring(0, 200) : // First 200 chars
                null,
            pubDate: article.pubDate ? article.pubDate[0] : null,
            source: article.source ? article.source[0]._ : 'Unknown'
        }));

        return formattedNews;

    } catch (error) {
        console.error('News service error:', error.message);
        return [{
            error: 'NEWS_FETCH_ERROR',
            message: 'Could not fetch news'
        }];
    }
};

module.exports = {
    getCompanyNews
};