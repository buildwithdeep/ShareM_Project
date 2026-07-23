// src/config/database.js

const mongoose = require('mongoose');

/**
 * WHAT HAPPENS HERE:
 * 
 * When your app starts, it needs to talk to MongoDB.
 * This function creates that connection.
 * 
 * Think of it like:
 * - Opening a phone line to the database
 * - If connection fails, we get an error message
 * - If connection succeeds, we can start making queries
 */

const connectDB = async() => {
    try {
        // Get MongoDB connection string from .env file
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI not defined in .env file');
        }

        // mongoose.connect() opens the database connection
        const conn = await mongoose.connect(mongoUri, {
            // These options prevent warnings and errors
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;

    } catch (error) {
        console.error('❌ MongoDB Connection Error:');
        console.error(error.message);

        // Exit app if database connection fails
        // No point running app without database
        process.exit(1);
    }
};

module.exports = connectDB;