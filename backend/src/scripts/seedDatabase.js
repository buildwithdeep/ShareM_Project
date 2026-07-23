// src/scripts/seedDatabase.js

/**
 * ✅ SMART DATABASE SEEDING SCRIPT
 *
 * Features:
 * - Data DELETE nahi hota
 * - Duplicates nahi hote
 * - Ek baar chalao = bas!
 * - Agar dubara chalao = kuch nahi hota
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Company = require("../models/Company");

// MongoDB connection
const connectDB = async() => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://localhost:27017/stock-research", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

// Indian companies data
const sampleCompanies = [
    // Technology Sector
    {
        companyName: "TATA CONSULTANCY SERVICES LIMITED",
        nseSymbol: "TCS",
        bseCode: "532540",
        isin: "INE467B01029",
        sector: "Technology",
        industry: "IT Services",
        aliases: ["TCS"],
    },
    {
        companyName: "INFOSYS LIMITED",
        nseSymbol: "INFY",
        bseCode: "500209",
        isin: "INE009A01021",
        sector: "Technology",
        industry: "IT Services",
        aliases: ["INFY", "INFOSYS"],
    },
    {
        companyName: "WIPRO LIMITED",
        nseSymbol: "WIPRO",
        bseCode: "507685",
        isin: "INE075A01012",
        sector: "Technology",
        industry: "IT Services",
        aliases: ["WIPRO"],
    },
    {
        companyName: "HCL TECHNOLOGIES LIMITED",
        nseSymbol: "HCLTECH",
        bseCode: "532281",
        isin: "INE860A01027",
        sector: "Technology",
        industry: "IT Services",
        aliases: ["HCL", "HCLTECH"],
    },
    {
        companyName: "TECH MAHINDRA LIMITED",
        nseSymbol: "TECHM",
        bseCode: "532755",
        isin: "INE010A01025",
        sector: "Technology",
        industry: "IT Services",
        aliases: ["TECHM", "TECHMAHINDRA"],
    },

    // Energy Sector
    {
        companyName: "RELIANCE INDUSTRIES LIMITED",
        nseSymbol: "RELIANCE",
        bseCode: "500325",
        isin: "INE002A01018",
        sector: "Energy",
        industry: "Oil & Gas",
        aliases: ["RIL", "REL", "RELIANCE"],
    },
    {
        companyName: "RELIANCE POWER LIMITED",
        nseSymbol: "RELPOWER",
        bseCode: "532895",
        isin: "INE019A01038",
        sector: "Energy",
        industry: "Power Generation",
        aliases: ["RELPOWER"],
    },

    // Finance Sector
    {
        companyName: "HDFC BANK LIMITED",
        nseSymbol: "HDFCBANK",
        bseCode: "500180",
        isin: "INE001A01015",
        sector: "Finance",
        industry: "Banking",
        aliases: ["HDFC", "HDFCBANK"],
    },
    {
        companyName: "ICICI BANK LIMITED",
        nseSymbol: "ICICIBANK",
        bseCode: "532174",
        isin: "INE090A01021",
        sector: "Finance",
        industry: "Banking",
        aliases: ["ICICI", "ICICIBANK"],
    },
    {
        companyName: "AXIS BANK LIMITED",
        nseSymbol: "AXISBANK",
        bseCode: "532215",
        isin: "INE238A01016",
        sector: "Finance",
        industry: "Banking",
        aliases: ["AXIS", "AXISBANK"],
    },
    {
        companyName: "KOTAK MAHINDRA BANK LIMITED",
        nseSymbol: "KOTAKBANK",
        bseCode: "532464",
        isin: "INE237A01025",
        sector: "Finance",
        industry: "Banking",
        aliases: ["KOTAK", "KOTAKBANK"],
    },

    // Automobiles
    {
        companyName: "MARUTI SUZUKI INDIA LIMITED",
        nseSymbol: "MARUTI",
        bseCode: "532500",
        isin: "INE585B01010",
        sector: "Automobile",
        industry: "Automobile Manufacturing",
        aliases: ["MARUTI"],
    },
    {
        companyName: "TATA MOTORS LIMITED",
        nseSymbol: "TATAMOTORS",
        bseCode: "500570",
        isin: "INE155A01022",
        sector: "Automobile",
        industry: "Automobile Manufacturing",
        aliases: ["TATA", "TATAMOTORS"],
    },
    {
        companyName: "MAHINDRA & MAHINDRA LIMITED",
        nseSymbol: "M&M",
        bseCode: "500520",
        isin: "INE101A01026",
        sector: "Automobile",
        industry: "Automobile Manufacturing",
        aliases: ["MM", "M&M", "MAHINDRA"],
    },

    // FMCG
    {
        companyName: "HINDUSTAN UNILEVER LIMITED",
        nseSymbol: "HINDUNILVR",
        bseCode: "500696",
        isin: "INE030A01027",
        sector: "FMCG",
        industry: "FMCG",
        aliases: ["HUL", "HINDUNILVR"],
    },
    {
        companyName: "ITC LIMITED",
        nseSymbol: "ITC",
        bseCode: "500469",
        isin: "INE154A01025",
        sector: "FMCG",
        industry: "FMCG",
        aliases: ["ITC"],
    },
    {
        companyName: "NESTLÉ INDIA LIMITED",
        nseSymbol: "NESTLEIND",
        bseCode: "500330",
        isin: "INE239A01016",
        sector: "FMCG",
        industry: "FMCG",
        aliases: ["NESTLE", "NESTLEIND"],
    },

    // Healthcare
    {
        companyName: "CIPLA LIMITED",
        nseSymbol: "CIPLA",
        bseCode: "500087",
        isin: "INE059A01026",
        sector: "Healthcare",
        industry: "Pharmaceuticals",
        aliases: ["CIPLA"],
    },
    {
        companyName: "DR. REDDY'S LABORATORIES LIMITED",
        nseSymbol: "DRREDDY",
        bseCode: "500124",
        isin: "INE089A01023",
        sector: "Healthcare",
        industry: "Pharmaceuticals",
        aliases: ["DRREDDY", "DRREDDYS"],
    },
    {
        companyName: "SUN PHARMACEUTICAL INDUSTRIES LIMITED",
        nseSymbol: "SUNPHARMA",
        bseCode: "524715",
        isin: "INE044A01035",
        sector: "Healthcare",
        industry: "Pharmaceuticals",
        aliases: ["SUNPHARMA"],
    },

    // Real Estate
    {
        companyName: "DLF LIMITED",
        nseSymbol: "DLF",
        bseCode: "502017",
        isin: "INE271C01023",
        sector: "Real Estate",
        industry: "Real Estate Development",
        aliases: ["DLF"],
    },
    {
        companyName: "OBEROI REALTY LIMITED",
        nseSymbol: "OBEROI",
        bseCode: "532900",
        isin: "INE093A01025",
        sector: "Real Estate",
        industry: "Real Estate Development",
        aliases: ["OBEROI"],
    },

    // Telecom
    {
        companyName: "BHARTI AIRTEL LIMITED",
        nseSymbol: "BHARTIARTL",
        bseCode: "532454",
        isin: "INE397D01024",
        sector: "Telecom",
        industry: "Telecommunication",
        aliases: ["AIRTEL", "BHARTIARTL"],
    },
    {
        companyName: "VODAFONE IDEA LIMITED",
        nseSymbol: "VODAFONE",
        bseCode: "532707",
        isin: "INE433A01036",
        sector: "Telecom",
        industry: "Telecommunication",
        aliases: ["VODAFONE", "VI"],
    },

    // Metals
    {
        companyName: "TATA STEEL LIMITED",
        nseSymbol: "TATASTEEL",
        bseCode: "500470",
        isin: "INE081A01012",
        sector: "Metals",
        industry: "Steel Manufacturing",
        aliases: ["TATASTEEL"],
    },
    {
        companyName: "HINDALCO INDUSTRIES LIMITED",
        nseSymbol: "HINDALCO",
        bseCode: "500440",
        isin: "INE038A01020",
        sector: "Metals",
        industry: "Aluminum Manufacturing",
        aliases: ["HINDALCO"],
    },
];

/**
 * ✅ SMART SEEDING FUNCTION
 *
 * Sirf missing companies add karega
 * Duplicates nahi hoge
 */
const seedDatabase = async() => {
    try {
        console.log("🌱 Starting intelligent database seeding...\n");

        // STEP 1: Check kitne companies pehle se hain
        const existingCount = await Company.countDocuments();
        console.log(`📊 Existing companies in database: ${existingCount}`);

        if (existingCount > 0) {
            console.log("✅ Database already seeded!");
            console.log("ℹ️  No need to seed again.\n");

            // Show existing companies
            const companies = await Company.find()
                .select("companyName nseSymbol")
                .limit(5);
            console.log("📋 Sample companies:");
            companies.forEach((company) => {
                console.log(`   - ${company.companyName} (${company.nseSymbol})`);
            });

            return; // Exit karo, kuch nahi karna
        }

        // STEP 2: Agar database khali hai, tab seed karo
        console.log("\n🌱 Database empty, seeding now...\n");

        // Insert all companies
        const insertedCompanies = await Company.insertMany(sampleCompanies);
        console.log(`✅ Inserted ${insertedCompanies.length} companies`);

        // STEP 3: Create text index for search
        await Company.collection.createIndex({
            companyName: "text",
            nseSymbol: "text",
            aliases: "text",
        });
        console.log("✅ Created text index for search");

        // STEP 4: Verify insertion
        const count = await Company.countDocuments();
        console.log(`✅ Total companies in database: ${count}`);

        // STEP 5: Show sample
        console.log("\n📋 Sample companies:");
        const samples = await Company.find()
            .select("companyName nseSymbol sector")
            .limit(10);
        samples.forEach((company, index) => {
            console.log(
                `   ${index + 1}. ${company.companyName} (${company.nseSymbol}) - ${company.sector}`,
            );
        });

        console.log("\n✅ Database seeding completed successfully!");
        console.log(
            "💡 Next time this script runs, it will skip seeding (data already exists).\n",
        );
    } catch (error) {
        console.error("❌ Seeding error:", error.message);
        process.exit(1);
    }
};

/**
 * MAIN: Run seeding
 */
const run = async() => {
    await connectDB();
    await seedDatabase();
    await mongoose.connection.close();
    console.log("✅ Connection closed. Goodbye!\n");
    process.exit(0);
};

run();