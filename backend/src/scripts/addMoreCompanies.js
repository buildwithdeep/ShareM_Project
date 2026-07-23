// src/scripts/addMoreCompanies.js

/**
 * ✅ SIRF NAYE COMPANIES ADD KARTA HAI
 * PURANE COMPANIES DELETE NAHI HOTE
 *
 * NOTE: ISIN numbers were not present in the source TS file,
 * so "isin" is left as an empty string below. Fill these in
 * from NSE/BSE if your schema requires them.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Company = require("../models/Company");

const connectDB = async() => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://localhost:27017/stock-research",
        );
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

const moreCompanies = [

    // Telecom & Media
    { companyName: "BHARTI AIRTEL LIMITED", nseSymbol: "BHARTIARTL", bseCode: "532454", isin: "", sector: "Communication Services", industry: "Telecom Services", aliases: ["BHARTIARTL"] },
    { companyName: "VODAFONE IDEA LIMITED", nseSymbol: "IDEA", bseCode: "532822", isin: "", sector: "Communication Services", industry: "Telecom Services", aliases: ["IDEA"] },
    { companyName: "ZOMATO LIMITED", nseSymbol: "ZOMATO", bseCode: "543320", isin: "", sector: "Communication Services", industry: "Online Food Delivery", aliases: ["ZOMATO"] },
    { companyName: "FSN E-COMMERCE VENTURES LIMITED", nseSymbol: "NYKAA", bseCode: "543384", isin: "", sector: "Consumer Discretionary", industry: "E-Commerce", aliases: ["NYKAA"] },
    { companyName: "ONE97 COMMUNICATIONS LIMITED", nseSymbol: "PAYTM", bseCode: "543396", isin: "", sector: "Financial Services", industry: "Digital Payments", aliases: ["PAYTM"] },
    { companyName: "PB FINTECH LIMITED", nseSymbol: "POLICYBZR", bseCode: "543390", isin: "", sector: "Financial Services", industry: "Insurance Technology", aliases: ["POLICYBZR"] },

    // Capital Goods & Industrial
    { companyName: "ABB INDIA LIMITED", nseSymbol: "ABB", bseCode: "500002", isin: "", sector: "Industrials", industry: "Electrical Equipment", aliases: ["ABB"] },
    { companyName: "SIEMENS LIMITED", nseSymbol: "SIEMENS", bseCode: "500550", isin: "", sector: "Industrials", industry: "Electrical Equipment", aliases: ["SIEMENS"] },
    { companyName: "BHARAT HEAVY ELECTRICALS LIMITED", nseSymbol: "BHEL", bseCode: "500103", isin: "", sector: "Industrials", industry: "Heavy Electrical Equipment", aliases: ["BHEL"] },
    { companyName: "THERMAX LIMITED", nseSymbol: "THERMAX", bseCode: "500411", isin: "", sector: "Industrials", industry: "Industrial Machinery", aliases: ["THERMAX"] },
    { companyName: "CUMMINS INDIA LIMITED", nseSymbol: "CUMMINSIND", bseCode: "500480", isin: "", sector: "Industrials", industry: "Industrial Machinery", aliases: ["CUMMINSIND"] },
    { companyName: "AIA ENGINEERING LIMITED", nseSymbol: "AIAENG", bseCode: "532683", isin: "", sector: "Industrials", industry: "Industrial Machinery", aliases: ["AIAENG"] },
    { companyName: "GRINDWELL NORTON LIMITED", nseSymbol: "GRINDWELL", bseCode: "506076", isin: "", sector: "Industrials", industry: "Industrial Products", aliases: ["GRINDWELL"] },

    // Insurance
    { companyName: "LIFE INSURANCE CORPORATION OF INDIA", nseSymbol: "LICI", bseCode: "543526", isin: "", sector: "Financial Services", industry: "Life Insurance", aliases: ["LICI"] },
    { companyName: "SBI LIFE INSURANCE COMPANY LIMITED", nseSymbol: "SBILIFE", bseCode: "540719", isin: "", sector: "Financial Services", industry: "Life Insurance", aliases: ["SBILIFE"] },
    { companyName: "HDFC LIFE INSURANCE COMPANY LIMITED", nseSymbol: "HDFCLIFE", bseCode: "540777", isin: "", sector: "Financial Services", industry: "Life Insurance", aliases: ["HDFCLIFE"] },
    { companyName: "ICICI PRUDENTIAL LIFE INSURANCE COMPANY LIMITED", nseSymbol: "ICICIPRULI", bseCode: "540133", isin: "", sector: "Financial Services", industry: "Life Insurance", aliases: ["ICICIPRULI"] },
    { companyName: "GENERAL INSURANCE CORPORATION OF INDIA", nseSymbol: "GICRE", bseCode: "540755", isin: "", sector: "Financial Services", industry: "General Insurance", aliases: ["GICRE"] },

    // Specialty Chemicals
    { companyName: "PI INDUSTRIES LIMITED", nseSymbol: "PIIND", bseCode: "523642", isin: "", sector: "Materials", industry: "Specialty Chemicals", aliases: ["PIIND"] },
    { companyName: "SRF LIMITED", nseSymbol: "SRF", bseCode: "503806", isin: "", sector: "Materials", industry: "Specialty Chemicals", aliases: ["SRF"] },
    { companyName: "AARTI INDUSTRIES LIMITED", nseSymbol: "AARTI", bseCode: "524208", isin: "", sector: "Materials", industry: "Specialty Chemicals", aliases: ["AARTI"] },
    { companyName: "NAVIN FLUORINE INTERNATIONAL LIMITED", nseSymbol: "NAVINFLUOR", bseCode: "500372", isin: "", sector: "Materials", industry: "Specialty Chemicals", aliases: ["NAVINFLUOR"] },
    { companyName: "DEEPAK NITRITE LIMITED", nseSymbol: "DEEPAKNTR", bseCode: "506401", isin: "", sector: "Materials", industry: "Specialty Chemicals", aliases: ["DEEPAKNTR"] },
    { companyName: "ASTRAL LIMITED", nseSymbol: "ASTRAL", bseCode: "532830", isin: "", sector: "Industrials", industry: "Pipes & Fittings", aliases: ["ASTRAL"] },

    // Conglomerates
    { companyName: "ADANI ENTERPRISES LIMITED", nseSymbol: "ADANIENT", bseCode: "512599", isin: "", sector: "Industrials", industry: "Diversified Conglomerate", aliases: ["ADANIENT"] },

    // Logistics & Transport
    { companyName: "INDIAN RAILWAY CATERING AND TOURISM CORPORATION LIMITED", nseSymbol: "IRCTC", bseCode: "542830", isin: "", sector: "Industrials", industry: "Transportation & Logistics", aliases: ["IRCTC"] },
    { companyName: "CONTAINER CORPORATION OF INDIA LIMITED", nseSymbol: "CONCOR", bseCode: "531344", isin: "", sector: "Industrials", industry: "Transportation & Logistics", aliases: ["CONCOR"] },
    { companyName: "DELHIVERY LIMITED", nseSymbol: "DELHIVERY", bseCode: "543529", isin: "", sector: "Industrials", industry: "Transportation & Logistics", aliases: ["DELHIVERY"] },
    { companyName: "INTERGLOBE AVIATION LIMITED", nseSymbol: "INDIGO", bseCode: "539448", isin: "", sector: "Industrials", industry: "Airlines", aliases: ["INDIGO"] },
];

const addCompanies = async() => {
    try {
        console.log("🌱 Adding new companies...\n");

        let addedCount = 0;

        for (const company of moreCompanies) {
            const result = await Company.findOneAndUpdate({
                    $or: [
                        { nseSymbol: company.nseSymbol },
                        { companyName: company.companyName }
                    ]
                },
                company, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

            if (result.isNew) {
                console.log(`✅ Added: ${company.companyName} (${company.nseSymbol})`);
                addedCount++;
            } else {
                console.log(
                    `⏭️  Already exists: ${company.companyName} (${company.nseSymbol})`
                );
            }
        }

        console.log(`\n✅ Added ${addedCount} new companies`);
        const total = await Company.countDocuments();
        console.log(`📊 Total companies in database: ${total}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
};

const run = async() => {
    await connectDB();
    await addCompanies();
    await mongoose.connection.close();
    process.exit(0);
};

run();