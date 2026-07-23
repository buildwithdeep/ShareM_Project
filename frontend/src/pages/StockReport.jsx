// src/pages/StockReport.jsx

import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { getStockReport } from "../api/stockApi";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import Snapshot from "../components/report/Snapshot";
import Valuation from "../components/report/Valuation";
import Growth from "../components/report/Growth";
import Health from "../components/report/Health";
import Returns from "../components/report/Returns";
import News from "../components/report/News";
import AIView from "../components/report/AIView";
import Tabs from "../components/common/Tabs";
import SearchBar from "../components/search/SearchBar";

function StockReport() {
  const { symbol } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!symbol) return;
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStockReport(symbol);
      setData(response);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stock data");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchStockData} />;
  }

  if (!data) {
    return <Error message="No data available" onRetry={fetchStockData} />;
  }

  const tabs = [
    { label: "Snapshot", id: "snapshot" },
    { label: "Valuation", id: "valuation" },
    { label: "Growth", id: "growth" },
    { label: "Health", id: "health" },
    { label: "Returns", id: "returns" },
    { label: "News", id: "news" },
    { label: "Fundamental view", id: "ai" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Top bar: Home link + Search + Company badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm shrink-0 transition"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              {data.company?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {symbol} · {data.company?.sector}
            </p>
          </div>
        </div>
      </div>

      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 sm:mb-2">
            Stock Analysis
          </p>
          <h1 className="text-base sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words leading-snug">
            {data.company?.name} ({symbol})
          </h1>
        </div>
        <button
          onClick={fetchStockData}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition shrink-0 self-start sm:self-auto"
        >
          <RefreshCw size={14} className="sm:w-[18px] sm:h-[18px]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content based on active tab */}
      <div className="space-y-6">
        {activeTab === 0 && <Snapshot data={data} company={data.company} />}
        {activeTab === 1 && <Valuation data={data} />}
        {activeTab === 2 && <Growth data={data} />}
        {activeTab === 3 && <Health data={data} />}
        {activeTab === 4 && <Returns data={data} />}
        {activeTab === 5 && <News data={data} />}
        {activeTab === 6 && <AIView data={data} />}
      </div>
    </div>
  );
}

export default StockReport;