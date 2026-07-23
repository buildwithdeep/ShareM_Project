// src/models/ReportCache.js

const mongoose = require('mongoose');

/**
 * WHAT IS THIS?
 * 
 * Cache = Temporary storage
 * 
 * When we generate a report for RELIANCE:
 * 1. First time → Call Yahoo, Alpha, News APIs (slow)
 * 2. Store result in cache
 * 3. Second time (within 1 hour) → Return from cache (fast!)
 * 4. After 1 hour → Delete cache, fetch fresh data
 * 
 * Think of it like:
 * "I already looked up this company 10 minutes ago.
 *  I'll use that information instead of looking again."
 */

const reportCacheSchema = new mongoose.Schema({

    // Which company's report is this
    nseSymbol: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    // The complete report data
    reportData: {
        type: mongoose.Schema.Types.Mixed, // Can be any structure
        required: true
    },

    // When was this cached
    cachedAt: {
        type: Date,
        default: Date.now
    },

    // Automatically delete this document after 1 hour (3600 seconds)
    // MongoDB will automatically remove old cache entries
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 3600000), // Now + 1 hour
        index: { expireAfterSeconds: 0 } // TTL index
    }
});

const ReportCache = mongoose.model('ReportCache', reportCacheSchema);

module.exports = ReportCache;