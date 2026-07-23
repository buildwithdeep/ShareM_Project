require("dotenv").config();
const axios = require("axios");

async function test() {
    const key = process.env.GEMINI_API_KEY;
    try {
        const res = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
        );
        const models = res.data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name);
        console.log("AVAILABLE MODELS:", models);
    } catch (err) {
        console.log("ERROR:", err.response ? JSON.stringify(err.response.data) : err.message);
    }
}

test();