// src/scripts/updateTataMotors.js

/**
 * ✅ Fixes Tata Motors after the 12 July 2026 demerger
 * Removes old TATAMOTORS entry, adds TMCV + TMPV
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

const updateTataMotors = async() => {
    try {
        // STEP 1: Remove old TATAMOTORS entry
        const deleted = await Company.deleteOne({ nseSymbol: "TATAMOTORS" });
        if (deleted.deletedCount > 0) {
            console.log("🗑️  Removed old TATAMOTORS entry");
        } else {
            console.log("ℹ️  No old TATAMOTORS entry found (already removed)");
        }

        // STEP 2: Add the two new post-demerger entities
        const newEntities = [{
                companyName: "TATA MOTORS LIMITED",
                nseSymbol: "TMCV",
                bseCode: "500570",
                isin: "INE155A01022",
                sector: "Automobile",
                industry: "Commercial Vehicles",
                aliases: ["TATA", "TATAMOTORS", "TMCV", "TATA COMMERCIAL VEHICLES"],
            },
            {
                companyName: "TATA MOTORS PASSENGER VEHICLES LIMITED",
                nseSymbol: "TMPV",
                bseCode: "544025",
                isin: "INE0FDU01011",
                sector: "Automobile",
                industry: "Passenger Vehicles",
                aliases: ["TMPV", "TATA PASSENGER VEHICLES", "TATA PV"],
            },
        ];

        for (const entity of newEntities) {
            const exists = await Company.findOne({ nseSymbol: entity.nseSymbol });
            if (!exists) {
                await Company.create(entity);
                console.log(`✅ Added: ${entity.companyName} (${entity.nseSymbol})`);
            } else {
                console.log(`⏭️  Already exists: ${entity.nseSymbol}`);
            }
        }

        const total = await Company.countDocuments();
        console.log(`\n📊 Total companies in database: ${total}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
};

const run = async() => {
    await connectDB();
    await updateTataMotors();
    await mongoose.connection.close();
    console.log("✅ Done!");
    process.exit(0);
};

run();