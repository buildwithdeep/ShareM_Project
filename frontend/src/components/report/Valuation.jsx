// src/components/report/Valuation.jsx

import { Info, Clock } from "lucide-react";

function Valuation({ data }) {
  if (!data || !data.valuation) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Valuation data unavailable
      </div>
    );
  }

  const valuation = data.valuation;

  // Determine cheap/fair/expensive status: compare Current vs 5Y Avg
  const getStatus = (current, fiveYAvg) => {
    if (current === null || current === undefined) return null;
    if (!fiveYAvg) return { status: "FAIR", color: "yellow" };
    const ratio = current / fiveYAvg;
    if (ratio < 0.9) return { status: "CHEAP", color: "green" };
    if (ratio > 1.15) return { status: "EXPENSIVE", color: "red" };
    return { status: "FAIR", color: "yellow" };
  };

  const badgeClasses = {
    green:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",
    yellow:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700",
    red:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700",
  };

  const barClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  const metrics = [
    {
      label: "Price-to-Earnings (P/E)",
      current: valuation.peRatio,
      fiveYAvg: valuation.pe5YAvg,
      unit: "x",
    },
    {
      label: "Price-to-Book (P/B)",
      current: valuation.pbRatio,
      fiveYAvg: valuation.pb5YAvg,
      unit: "x",
    },
    {
      label: "EV/EBITDA",
      current: valuation.evEbitda,
      fiveYAvg: valuation.evEbitda5YAvg,
      unit: "x",
    },
  ];

  return (
    <div className="space-y-6">
      {/* AI Insight */}
      {valuation.aiInsight && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg p-5 flex gap-3">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {valuation.aiInsight}
          </p>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          const statusInfo = getStatus(m.current, m.fiveYAvg);
          const isNewListing = m.current === null && m.fiveYAvg !== null;

          const barPercent = m.fiveYAvg
            ? Math.min(100, Math.max(5, (m.current / (m.fiveYAvg * 2)) * 100))
            : 50;

          return (
            <div
              key={i}
              className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {m.label}
                </h3>
                {statusInfo && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[statusInfo.color]}`}
                  >
                    {statusInfo.status}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                    {m.current != null ? `${Number(m.current).toFixed(2)}${m.unit}` : "—"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                    {m.fiveYAvg != null ? `${Number(m.fiveYAvg).toFixed(2)}${m.unit}` : "—"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5Y Avg</p>
                </div>
              </div>

              {statusInfo && (
                <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barClasses[statusInfo.color]}`}
                    style={{ width: `${barPercent}%` }}
                  ></div>
                </div>
              )}

              {isNewListing && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  Recently listed — current-year data still settling
                </p>
              )}

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Source: {valuation.source || "Google Finance"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interpretation Guide */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
        <h3 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white mb-4">
          VALUATION INTERPRETATION GUIDE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full border bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700 mb-3">
              CHEAP
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Current metric is significantly below its own 5-year average.
              May indicate undervaluation or business concerns.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full border bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700 mb-3">
              FAIR
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Current metric is in line with its own historical average.
              Valuation appears reasonable.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700 mb-3">
              EXPENSIVE
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Current metric is significantly above its own 5-year average.
              May indicate premium valuation or overextension.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-4">
          Valuation alone is not a buy/sell signal. Always consider business
          quality, growth outlook, and risk profile.
        </p>
      </div>

      {/* Last updated */}
      {valuation.lastUpdated && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Clock size={12} />
          Fundamental data last updated:{" "}
          {new Date(valuation.lastUpdated).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}

export default Valuation;