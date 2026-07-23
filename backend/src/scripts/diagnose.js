// backend/src/scripts/diagnose.js

/**
 * 🔍 DIAGNOSTIC SCRIPT
 *
 * Yeh script check karega:
 * 1. .env file loaded hai?
 * 2. MongoDB connect ho raha hai?
 * 3. Connection string sahi hai?
 * 4. Database accessible hai?
 * 5. Companies exist karti hain?
 */

require("dotenv").config();
const mongoose = require("mongoose");

console.log("\n" + "=".repeat(60));
console.log("🔍 MONGODB DIAGNOSTIC TOOL");
console.log("=".repeat(60) + "\n");

// ✅ CHECK 1: Environment Variables
console.log("📋 CHECK 1: Environment Variables");
console.log("-".repeat(60));

const requiredEnvs = ["MONGO_URI"];
let envOK = true;

requiredEnvs.forEach((env) => {
    const value = process.env[env];
    if (value) {
        console.log(`✅ ${env}: ${value.substring(0, 50)}...`);
    } else {
        console.log(`❌ ${env}: NOT FOUND!`);
        envOK = false;
    }
});

if (!envOK) {
    console.log("\n⚠️  PROBLEM: .env file not properly configured!");
    console.log("   Fix: Create/update backend/.env with MONGO_URI");
    process.exit(1);
}

// ✅ CHECK 2: Connection String Format
console.log("\n📋 CHECK 2: Connection String Format");
console.log("-".repeat(60));

const mongoUri = process.env.MONGO_URI;

if (mongoUri.includes("mongodb+srv://")) {
    console.log("✅ Using MongoDB Atlas (Cloud)");
} else if (mongoUri.includes("mongodb://localhost")) {
    console.log("✅ Using Local MongoDB");
} else if (mongoUri.includes("mongodb://")) {
    console.log("✅ Using MongoDB Network");
} else {
    console.log("❌ Invalid MONGO_URI format!");
    console.log("   Expected: mongodb+srv://... or mongodb://...");
    process.exit(1);
}

// Extract database name
const dbNameMatch = mongoUri.match(/\/([^?]*)\?/);
const dbName = dbNameMatch != null ? dbNameMatch[1] : "unknown";
console.log(`✅ Database Name: ${dbName}`);

// ✅ CHECK 3: Try Connection
console.log("\n📋 CHECK 3: MongoDB Connection");
console.log("-".repeat(60));

const testConnection = async() => {
    try {
        console.log("🔌 Connecting to MongoDB...");

        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log("✅ Connected successfully!");

        const connHost = conn.connection != null ? conn.connection.host : "unknown";
        const connPort = conn.connection != null ? conn.connection.port : "unknown";
        const connDbName =
            conn.connection != null && conn.connection.db != null ?
            conn.connection.db.databaseName :
            "unknown";
        const connState =
            conn.connection != null && conn.connection.readyState === 1 ?
            "Connected" :
            "Disconnected";

        console.log(`   Host: ${connHost}`);
        console.log(`   Port: ${connPort}`);
        console.log(`   Database: ${connDbName}`);
        console.log(`   State: ${connState}`);

        // ✅ CHECK 4: Database Operations
        console.log("\n📋 CHECK 4: Database Operations");
        console.log("-".repeat(60));

        const db = conn.connection != null ? conn.connection.db : null;

        if (db == null) {
            console.log("❌ Database connection failed");
            process.exit(1);
        }

        // List collections
        console.log("📊 Collections in database:");
        const collections = await db.listCollections().toArray();

        if (collections.length === 0) {
            console.log("   ⚠️  No collections found (database is empty)");
        } else {
            collections.forEach((col) => {
                console.log(`   ✅ ${col.name}`);
            });
        }

        // Check companies collection
        const companiesCollectionExists =
            collections.find((c) => c.name === "companies") != null;

        if (companiesCollectionExists) {
            console.log("\n📋 CHECK 5: Companies Collection");
            console.log("-".repeat(60));

            const companiesCollection = db.collection("companies");
            const count = await companiesCollection.countDocuments();

            console.log(`✅ Total companies: ${count}`);

            if (count > 0) {
                console.log("\n📋 Sample companies:");
                const samples = await companiesCollection.find().limit(5).toArray();
                samples.forEach((company, index) => {
                    const companyName =
                        company.companyName != null ? company.companyName : "Unknown";
                    const nseSymbol =
                        company.nseSymbol != null ? company.nseSymbol : "N/A";
                    console.log(`   ${index + 1}. ${companyName} (${nseSymbol})`);
                });
            } else {
                console.log("\n⚠️  Companies collection is empty!");
                console.log("   Action: Run seedDatabase.js to populate data");
            }

            const indexes = await companiesCollection.indexes();

            const textIndexExists =
                indexes.find((idx) => {
                    const idxKey = idx.key != null ? idx.key : {};

                    return Object.values(idxKey).includes("text");
                }) != null;

            if (textIndexExists) {
                console.log("✅ Text index exists");
            } else {
                console.log("⚠️  Text index NOT found");
                console.log("   Action: Run seedDatabase.js to create index");
            }
        } else {
            console.log('⚠️  "companies" collection not found!');
            console.log(
                "   Action: Run seedDatabase.js to create collection and seed data",
            );
        }

        // ✅ SUCCESS
        console.log("\n" + "=".repeat(60));
        console.log("✅ ALL CHECKS PASSED!");
        console.log("=".repeat(60) + "\n");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        const errorMessage =
            error != null && error.message != null ? error.message : "Unknown error";
        console.log(`\n❌ CONNECTION ERROR: ${errorMessage}`);
        console.log("\n🔍 Troubleshooting:");

        if (errorMessage.includes("getaddrinfo ENOTFOUND")) {
            console.log("   Problem: Cannot reach MongoDB server");
            console.log("   Solution 1: Check internet connection");
            console.log("   Solution 2: Check MONGO_URI is correct");
            console.log("   Solution 3: Check MongoDB Atlas cluster is active");
        } else if (errorMessage.includes("authentication failed")) {
            console.log("   Problem: Username/password incorrect");
            console.log("   Solution: Check credentials in MONGO_URI");
        } else if (errorMessage.includes("ECONNREFUSED")) {
            console.log("   Problem: Local MongoDB not running");
            console.log("   Solution: Start MongoDB with: mongod");
        } else if (errorMessage.includes("ETIMEDOUT")) {
            console.log("   Problem: Connection timeout");
            console.log("   Solution 1: Check internet connection");
            console.log("   Solution 2: Check firewall settings");
            console.log("   Solution 3: Use MongoDB Atlas instead of local");
        } else if (errorMessage.includes("ERR_TLS_CERT_ALTNAME_INVALID")) {
            console.log("   Problem: SSL/Certificate issue");
            console.log("   Solution: Update MONGO_URI with: ?ssl=true");
        }

        console.log("\n📝 Your MONGO_URI:");
        console.log(`   ${mongoUri.substring(0, 60)}...`);

        console.log("\n💡 Next steps:");
        console.log("   1. Fix the error above");
        console.log("   2. Run this script again");
        console.log("   3. Once passed, run: node src/scripts/seedDatabase.js");

        process.exit(1);
    }
};

testConnection();