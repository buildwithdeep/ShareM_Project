import { useState } from "react";
import { TrendingUp, Database, BarChart3, Shield } from "lucide-react";
import SearchBar from "../components/search/SearchBar";

function Home() {
  const [trendingCompanies] = useState([
    {
      name: "Reliance Industries",
      symbol: "RELIANCE",
      trend: "+2.5%",
      color: "green",
    },
    { name: "TCS", symbol: "TCS", trend: "+1.2%", color: "green" },
    { name: "HDFC Bank", symbol: "HDFCBANK", trend: "-0.8%", color: "red" },
    { name: "Infosys", symbol: "INFY", trend: "+3.1%", color: "green" },
    { name: "ICICI Bank", symbol: "ICICIBANK", trend: "+0.5%", color: "green" },
    { name: "ITC", symbol: "ITC", trend: "-1.2%", color: "red" },
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-10 sm:py-16 px-4">
        {/* Badge pill */}
        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
          <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full shrink-0"></span>
          <span>6000+ Companies - Real-Time Data - AI Analysis</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
          <span className="text-gray-900 dark:text-white block">Share Analysis and</span>
          <span className="block bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Research Platform
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
          Analyze Indian shares with this tool. Deep-dive into
          valuation, growth, financial health, and management quality. For
          long-term investors.
        </p>

        {/* Large Search Bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <SearchBar large />
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-10 sm:mb-16 px-2">
          Try: "Tata", "HDFC", "Infosys", "Reliance", "Bajaj"
        </p>

        {/* Info Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-5 flex flex-col items-center gap-2 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Database size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              6000+
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Companies
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-5 flex flex-col items-center gap-2 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Real-Time
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stock Data
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-5 flex flex-col items-center gap-2 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-100 dark:bg-teal-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              AI
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Analysis</p>
          </div>

          <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-5 flex flex-col items-center gap-2 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Trusted
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Official Sources
            </p>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="max-w-6xl mx-auto py-10 sm:py-16 border-t border-gray-200 dark:border-gray-800 px-4">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-2">
          <TrendingUp className="text-green-500 dark:text-green-400" size={22} />
          Trending Today
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {trendingCompanies.map((company, index) => (
            <a
              key={index}
              href={"/stock/" + company.symbol}
              className="group bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-gray-900 dark:text-white font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {company.symbol}
                </p>
              </div>
              <span
                className={
                  company.color === "green"
                    ? "text-base sm:text-lg font-bold shrink-0 text-green-600 dark:text-green-400"
                    : "text-base sm:text-lg font-bold shrink-0 text-red-600 dark:text-red-400"
                }
              >
                {company.trend}
              </span>
            </div>
            </a>
          ))}
      </div>
    </div>

      {/* Features Section */ }
  <div className="max-w-6xl mx-auto py-10 sm:py-16 border-t border-gray-200 dark:border-gray-800 px-4">
    <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
      Why Choose StockAI?
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
      <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-5 sm:p-6 transition-colors">
        <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">Data</div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          Real Financial Data
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Get accurate financial metrics directly from official sources
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-5 sm:p-6 transition-colors">
        <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">AI</div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          AI Analysis
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Get fundamental analysis powered by advanced AI models
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-secondary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-5 sm:p-6 transition-colors">
        <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">Growth</div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          Easy Comparison
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Compare multiple companies side-by-side instantly
        </p>
      </div>
    </div>
  </div>
    </div >
  );
}

export default Home;