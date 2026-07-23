// src/models/Company.js

const mongoose = require('mongoose');

/**
 * WHAT IS THIS?
 * 
 * This is the blueprint for storing company information.
 * 
 * When we search "RELIANCE", we find it here.
 * When we search "REL", we find it here too (via aliases).
 * 
 * Think of it like a company directory with:
 * - Official name
 * - Stock symbols
 * - Sector info
 * - Search aliases (shortcuts)
 */

// Create the schema (structure)
const companySchema = new mongoose.Schema({

    // Official company name
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },

    // NSE Symbol (National Stock Exchange)
    // Example: RELIANCE, TCS, INFY
    nseSymbol: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },

    // BSE Code (Bombay Stock Exchange)
    // Example: 500325
    bseCode: {
        type: String,
        trim: true
    },

    // ISIN code (International Securities Identification Number)
    // Example: INE002A01018
    isin: {
        type: String,
        trim: true
    },

    // What industry (Sector)
    sector: {
        type: String,
        enum: [
            'Technology',
            'Finance',
            'Energy',
            'Healthcare',
            'Automobile',
            'FMCG',
            'Construction',
            'Real Estate',
            'Pharma',
            'Telecom',
            'Metals',
            // 🔽 ADD THESE MISSING SECTORS:
            'Information Technology', // Used in IT companies
            'Financial Services', // Used in Banking/Finance companies
            'Utilities', // Used in Power companies
            'Materials', // Used in Metals, Cement, Chemicals
            'Industrials', // Used in Infrastructure, Logistics, Capital Goods
            'Consumer Discretionary', // Used in Retail, Consumer goods
            'Communication Services', // Used in Telecom, Media
            'Healthcare', // Already present but used for Pharma/Hospitals
            // Also consider if you want to consolidate:
            // 'Pharma' and 'Healthcare' could be merged
            // 'Technology' and 'Information Technology' could be merged
            'Other'
        ]
    },

    // More specific category
    industry: {
        type: String,
        trim: true
    },

    // Other names to search by
    // Example: Reliance could be searched as "RELIANCE", "RIL", "RIL.NS"
    aliases: [{
        type: String,
        trim: true,
        uppercase: true
    }],

    // When was this record created
    createdAt: {
        type: Date,
        default: Date.now
    },

    // When was this record last updated
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create text index for fuzzy search
// This allows searching "rel" and finding "reliance"
companySchema.index({
    companyName: 'text',
    nseSymbol: 'text',
    aliases: 'text'
});

/**
 * HOW TO USE THIS MODEL:
 * 
 * In other files, you'll do:
 * 
 * const Company = require('./Company.js');
 * 
 * // Find a company
 * const company = await Company.findOne({ nseSymbol: 'RELIANCE' });
 * 
 * // Search multiple companies
 * const results = await Company.find({ sector: 'Technology' });
 * 
 * // Create new company
 * const newCompany = await Company.create({
 *   companyName: 'NEW COMPANY',
 *   nseSymbol: 'NEWCO',
 *   sector: 'Technology'
 * });
 */

const Company = mongoose.model('Company', companySchema);

module.exports = Company;