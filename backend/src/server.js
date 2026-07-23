// ============================================
// src/server.js
// ============================================
//
// ✅ MAIN BACKEND SERVER FILE
//
// Yeh file:
// 1. Environment variables load karta hai (.env se)
// 2. Express app banata hai
// 3. MongoDB se connect karta hai
// 4. Middleware setup karta hai
// 5. Routes register karta hai
// 6. Error handling setup karta hai
// 7. Server start karta hai
//
// ============================================

/**
 * STEP 1: ENVIRONMENT VARIABLES LOAD KARO
 *
 * .env file se PORT, MONGO_URI, API_KEYS load honge
 */
require("dotenv").config();

/**
 * STEP 2: IMPORTS (Libraries aur modules)
 */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Config imports
const connectDB = require("./config/database");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

// Routes imports
const searchRoutes = require("./routes/search.routes");
const stockRoutes = require("./routes/stock.routes");
const newsRoutes = require("./routes/news.routes");

/**
 * STEP 3: ENVIRONMENT VARIABLES EXTRACT KARO
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/stock-research";

/**
 * STEP 4: EXPRESS APP BANAO
 */
const app = express();

/**
 * ============================================
 * MIDDLEWARE CONFIGURATION
 * ============================================
 *
 * Middleware = Code jo har request par chalti hai
 *
 * Sequence matter karta hai!
 * 1. CORS pehle (browser se connection allow karna)
 * 2. Body parser (JSON parse karna)
 * 3. Logging (request logs dekhna)
 * 4. Routes (actual endpoints)
 * 5. Error handling (error catch karna)
 */

// ✅ CORS CONFIGURATION
// Frontend ko backend se connect karne dena
const corsOptions = {
    // Frontend jo URLs ho sakte hain
    origin: [
        "http://localhost:3000", // Next.js dev
        "http://localhost:3001", // Alternate dev
        "http://localhost:5173", // Vite dev ← IMPORTANT
        "http://localhost:5174", // Vite fallback
        "http://127.0.0.1:5173", // Localhost variant
        "http://127.0.0.1:3000", // Localhost variant
        "http://localhost:8000", // Flask/Python dev
        // Production URLs (baad mein add karna)
        // 'https://yourdomain.com',
        // 'https://app.yourdomain.com',
    ],

    // Credentials allow karna (cookies, auth headers)
    credentials: true,

    // HTTP methods allow karna
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

    // Headers allow karna
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],

    // Browser ko preflight request cache rakhne dena (86400 = 24 hours)
    maxAge: 86400,

    // Response headers ko expose karna
    exposedHeaders: ["Content-Length", "X-JSON-Response"],
};

// CORS middleware apply karo
app.use(cors(corsOptions));

// ✅ BODY PARSER MIDDLEWARE
// JSON data ko parse karne ke liye
app.use(
    express.json({
        limit: "50mb", // Max 50MB request size
        strict: true, // Sirf JSON accept karna
    }),
);

// Form data parse karne ke liye (optional)
app.use(
    express.urlencoded({
        extended: true,
        limit: "50mb",
    }),
);

// ✅ REQUEST LOGGING MIDDLEWARE
// Har request ko log karna (debugging ke liye)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`\n[${timestamp}] ${method} ${path}`);
    console.log(`    IP: ${ip}`);

    // Response time measure karna
    const startTime = Date.now();

    // Response ke baad print karna
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;

        // Status ke base par color (console output mein)
        const statusColor = status >= 400 ? "❌" : status >= 300 ? "⚠️" : "✅";

        console.log(
            `    ${statusColor} Status: ${status} | Duration: ${duration}ms`,
        );
    });

    next();
});

/**
 * ============================================
 * ROUTES CONFIGURATION
 * ============================================
 */
// Render/Browser jab "/" pe hit karega to 404 na aaye isliye
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 AI Stock Research Backend is running",
        docs: "/api/status",
    });
});

// ✅ HEALTH CHECK ENDPOINT
// Check karne ke liye ki server alive hai
app.get("/api/health", (req, res) => {
    // MongoDB connection status check karo
    const mongoConnected = mongoose.connection.readyState === 1;
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting

    res.status(200).json({
        success: true,
        message: "🚀 Backend is running",
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        mongoConnected: mongoConnected,
        mongoStatus: mongoConnected ? "Connected" : "Disconnected",
        uptime: process.uptime(), // Server kitne time se chal raha hai (seconds mein)
    });
});

// ✅ SEARCH ROUTES
// /api/search?query=xyz
app.use("/api/search", searchRoutes);

// ✅ STOCK ROUTES
// /api/stock/RELIANCE
app.use("/api/stock", stockRoutes);

// ✅ NEWS ROUTES
// /api/news/RELIANCE
app.use("/api/news", newsRoutes);

// ✅ API STATUS ENDPOINT
// Sab endpoints ka status dekho
app.get("/api/status", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Status",
        endpoints: {
            health: {
                method: "GET",
                path: "/api/health",
                description: "Check if server is alive",
            },
            search: {
                method: "GET",
                path: "/api/search?query=rel",
                description: "Search companies",
            },
            stock: {
                method: "GET",
                path: "/api/stock/:symbol",
                description: "Get stock report",
            },
            news: {
                method: "GET",
                path: "/api/news/:symbol",
                description: "Get company news",
            },
        },
    });
});

/**
 * ============================================
 * ERROR HANDLING
 * ============================================
 *
 * Ye routes ke baad aana chahiye!
 */

// ✅ 404 HANDLER (Route nahi mila)
// Agar koi endpoint nahi mila to yeh run hoga
app.use(notFoundHandler);

// ✅ ERROR HANDLER (Global error catching)
// Agar kahi error aayi to yeh catch karega
app.use(errorHandler);

/**
 * ============================================
 * SERVER START FUNCTION
 * ============================================
 */
const startServer = async() => {
    try {
        // ✅ STEP 1: MongoDB se connect karo
        console.log("\n" + "=".repeat(50));
        console.log("🔌 Connecting to MongoDB...");
        console.log("=".repeat(50) + "\n");

        await connectDB();

        // ✅ STEP 2: Express server start karo
        const server = app.listen(PORT, () => {
            console.log("\n" + "╔" + "=".repeat(48) + "╗");
            console.log("║" + " ".repeat(48) + "║");
            console.log("║" + "   🚀 AI STOCK RESEARCH BACKEND 🚀".padEnd(48) + "║");
            console.log("║" + " ".repeat(48) + "║");
            console.log("╚" + "=".repeat(48) + "╝");

            console.log("\n📊 Server Details:");
            console.log(`   ✅ Server: http://localhost:${PORT}`);
            console.log(`   ✅ Environment: ${NODE_ENV}`);
            console.log(`   ✅ Process ID: ${process.pid}`);
            console.log(`   ✅ Node Version: ${process.version}`);

            console.log("\n🔗 Available Endpoints:");
            console.log(`   GET  /api/health              → Check if server alive`);
            console.log(`   GET  /api/status              → API status`);
            console.log(`   GET  /api/search?query=rel    → Search companies`);
            console.log(`   GET  /api/stock/:symbol       → Get stock report`);
            console.log(`   GET  /api/news/:symbol        → Get company news`);

            console.log("\n🌐 Allowed Frontend URLs:");
            corsOptions.origin.forEach((url) => {
                console.log(`   ✅ ${url}`);
            });

            console.log("\n📝 Environment Variables:");
            console.log(`   ✅ PORT: ${PORT}`);
            console.log(`   ✅ NODE_ENV: ${NODE_ENV}`);
            console.log(`   ✅ MONGO_URI: ${MONGO_URI.substring(0, 30)}...`);
            console.log(`   ✅ CORS Enabled: true`);

            console.log("\n💡 Tips:");
            console.log(`   • Test health: curl http://localhost:${PORT}/api/health`);
            console.log(`   • View logs: Check terminal output`);
            console.log(`   • Stop server: Press Ctrl+C`);

            console.log("\n" + "=".repeat(50) + "\n");
        });

        // ✅ STEP 3: Graceful shutdown handle karo
        // Agar server stop ho to clean exit karo
        process.on("SIGINT", async() => {
            console.log("\n\n🛑 Shutting down gracefully...");

            server.close(async() => {
                console.log("✅ Server closed");

                // MongoDB connection close karo
                await mongoose.connection.close();
                console.log("✅ MongoDB connection closed");

                console.log("✅ Goodbye!\n");
                process.exit(0);
            });
        });


    } catch (error) {
        console.error("\n❌ STARTUP ERROR:", error.message);
        console.error("\n🔍 Troubleshooting:");

        if (error.message.includes("connect ECONNREFUSED")) {
            console.error("   • MongoDB not running");
            console.error("   • Fix: Start MongoDB with: mongod");
        } else if (error.message.includes("MONGO_URI")) {
            console.error("   • MONGO_URI not set in .env");
            console.error("   • Fix: Add MONGO_URI to backend/.env");
        } else if (error.message.includes("EADDRINUSE")) {
            console.error("   • Port 5000 already in use");
            console.error(
                "   • Fix: Change PORT in .env or kill process using port 5000",
            );
        }

        process.exit(1);
    }
};

/**
 * ============================================
 * GLOBAL ERROR HANDLERS
 * ============================================
 *
 * Agar middleware mein error aayi to catch karo
 */

// Unhandled Promise Rejection
process.on("unhandledRejection", (reason, promise) => {
    console.error("\n⚠️ UNHANDLED REJECTION:");
    console.error("   Promise:", promise);
    console.error("   Reason:", reason);
    console.error("\n💡 Fix the error and restart server\n");
});

// Uncaught Exception
process.on("uncaughtException", (error) => {
    console.error("\n⚠️ UNCAUGHT EXCEPTION:");
    console.error("   Error:", error.message);
    console.error("   Stack:", error.stack);
    console.error("\n💡 Fix the error and restart server\n");
    process.exit(1);
});

/**
 * ============================================
 * START SERVER
 * ============================================
 */
startServer();

/**
 * ============================================
 * EXPORT (Module exports)
 * ============================================
 */
module.exports = app;