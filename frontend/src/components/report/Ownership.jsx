// src/components/report/Ownership.jsx

import { TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

function Ownership({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data?.ownership) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Ownership data unavailable
      </div>
    );
  }

  const ownership = data.ownership;

  const badgeClasses = {
    green:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",
    yellow:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700",
    red:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700",
  };

  const statusColorMap = {
    BUYING: "green",
    INCREASING: "green",
    STABLE: "yellow",
    SELLING: "red",
    DECREASING: "red",
  };

  const chartGridColor = isDark ? "#374151" : "#e5e7eb";
  const chartAxisColor = isDark ? "#9ca3af" : "#6b7280";
  const chartTooltipBg = isDark ? "#1e293b" : "#ffffff";
  const chartTooltipBorder = isDark ? "#374151" : "#e5e7eb";

  const renderHoldingCard = (label, holding, lineColor) => {
    if (holding.value == null) return null;
    const color = statusColorMap[holding.status] || "yellow";
    const isUp = holding.change >= 0;

    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{label}</h3>
          {holding.status && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[color]}`}>
              {holding.status}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            {holding.value}%
          </p>
          {holding.change != null && (
            <p className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isUp ? "+" : ""}
              {holding.change}% vs {ownership.baselineLabel || "prior"}
            </p>
          )}
        </div>

        {holding.trend && holding.trend.length > 0 && (
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {label} (Last {holding.trend.length} Quarters)
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={holding.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="quarter" stroke={chartAxisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={chartAxisColor} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTooltipBg,
                    border: `1px solid ${chartTooltipBorder}`,
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={{ r: 4, fill: lineColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between flex-wrap gap-2 transition-colors">
        <div>
          <h2 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white mb-1">
            SHAREHOLDING PATTERN
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quarterly shareholding trends as per BSE/NSE filings.
          </p>
        </div>
        {ownership.source && (
          <p className="text-xs text-gray-400 dark:text-gray-500">Source: {ownership.source}</p>
        )}
      </div>

      {/* Zero pledge banner */}
      {ownership.zeroPledge && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400">
            <strong>Zero promoter pledge</strong> — No promoter shares are
            pledged. This is a positive governance signal.
          </p>
        </div>
      )}

      {/* Promoter Holding */}
      {ownership.promoterHolding != null &&
        renderHoldingCard(
          "Promoter Holding",
          {
            value: ownership.promoterHolding,
            change: ownership.promoterChange,
            trend: ownership.promoterTrend,
            status: ownership.promoterStatus,
          },
          "#3b82f6"
        )}

      {/* FII / DII side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ownership.fiiHolding != null &&
          renderHoldingCard(
            "FII / FPI Holding",
            {
              value: ownership.fiiHolding,
              change: ownership.fiiChange,
              trend: ownership.fiiTrend,
              status: ownership.fiiStatus,
            },
            "#22c55e"
          )}

        {ownership.diiHolding != null &&
          renderHoldingCard(
            "DII Holding",
            {
              value: ownership.diiHolding,
              change: ownership.diiChange,
              trend: ownership.diiTrend,
              status: ownership.diiStatus,
            },
            "#3b82f6"
          )}
      </div>

      {/* Reading Shareholding Signals guide */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
        <h3 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white mb-4">
          READING SHAREHOLDING SIGNALS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              Promoter Holding
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span className="font-semibold text-green-600 dark:text-green-400">BUYING:</span>{" "}
              Promoters consistently increasing stake — strong vote of
              confidence
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">STABLE:</span>{" "}
              Holding unchanged — neutral signal
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-red-600 dark:text-red-400">SELLING:</span>{" "}
              Promoters reducing stake — warrants investigation
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              FII/FPI Holding
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span className="font-semibold text-green-600 dark:text-green-400">INCREASING:</span>{" "}
              Foreign institutions buying — global confidence in business
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">STABLE:</span>{" "}
              Holding steady — neutral signal
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-red-600 dark:text-red-400">DECREASING:</span>{" "}
              FII exit — could signal valuation or risk concerns
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              DII Holding
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span className="font-semibold text-green-600 dark:text-green-400">INCREASING:</span>{" "}
              Domestic funds buying — long-term conviction signal
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">STABLE:</span>{" "}
              Holding steady — neutral
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-red-600 dark:text-red-400">DECREASING:</span>{" "}
              Domestic funds exiting — monitor reasons
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ownership;