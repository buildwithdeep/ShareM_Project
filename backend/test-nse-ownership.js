require("dotenv").config();
const axios = require("axios");

async function test() {
    const res = await axios.get("https://serpapi.com/search", {
        params: {
            engine: "google_finance",
            q: "INFY:NSE",
            api_key: process.env.SERP_API_KEY,
        },
    });

    const financials = res.data.financials || [];
    const balance = financials.find(f => f.title === "Balance sheet");

    if (balance && balance.results) {
        console.log("=== ANNUAL BALANCE SHEET ROWS (latest 3 years) ===");
        balance.results
            .filter(r => r.period_type === "Annual")
            .slice(0, 3)
            .forEach(r => {
                console.log(`\n--- Year: ${r.date} ---`);
                ["Price to book", "Book value per share", "Shares outstanding", "Total assets"].forEach(name => {
                    const row = r.table.find(t => t.title === name);
                    console.log(`  ${name}: ${row ? row.value : "NOT FOUND"}`);
                });
            });
    }

    const income = financials.find(f => f.title === "Income statement");
    if (income && income.results) {
        console.log("\n=== ANNUAL INCOME STATEMENT ROWS (latest 3 years) ===");
        income.results
            .filter(r => r.period_type === "Annual")
            .slice(0, 3)
            .forEach(r => {
                console.log(`\n--- Year: ${r.date} ---`);
                ["EBITDA", "Earnings per share", "EPS"].forEach(name => {
                    const row = r.table.find(t => t.title === name);
                    console.log(`  ${name}: ${row ? row.value : "NOT FOUND"}`);
                });
            });
    }

    // Also check current P/E from key_stats
    if (res.data.knowledge_graph && res.data.knowledge_graph.key_stats) {
        console.log("\n=== KEY STATS ===");
        console.log(JSON.stringify(res.data.knowledge_graph.key_stats.stats, null, 2));
    }
}

test();