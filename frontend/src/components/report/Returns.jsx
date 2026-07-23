// src/components/report/Returns.jsx

import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

function Returns({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || !data.returns) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Returns data unavailable
      </div>
    );
  }

  const returns = data.returns;

  const badgeClasses = {
    green:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",
    yellow:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700",
    red:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700",
  };

  // Above 15% GOOD, 10-15% AVERAGE, Below 10% WEAK
  const getReturnStatus = (val) => {
    if (val === null || val === undefined) return null;
    if (val > 15) return { status: "GOOD", color: "green" };
    if (val >= 10) return { status: "AVERAGE", color: "yellow" };
    return { status: "WEAK", color: "red" };
  };

  const roeStatus = getReturnStatus(returns.roe);
  const roceStatus = getReturnStatus(returns.roce);

  const chartGridColor = isDark ? "#374151" : "#e5e7eb";
  const chartAxisColor = isDark ? "#9ca3af" : "#6b7280";
  const chartTooltipBg = isDark ? "#1e293b" : "#ffffff";
  const chartTooltipBorder = isDark ? "#374151" : "#e5e7eb";

  const fmt = (val, suffix = "%") =>
    val != null ? `${Number(val).toFixed(1)}${suffix}` : "—";

  return (
    <div className="space-y-6">
      {/* Benchmarks banner */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-start gap-3 transition-colors">
        <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
            RETURN BENCHMARKS
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ROE/ROCE above 15% = GOOD · 10-15% = AVERAGE · Below 10% = WEAK
          </p>
        </div>
      </div>

      {/* ROE / ROCE Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Return on Equity (ROE)
            </h3>
            {roeStatus && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[roeStatus.color]}`}>
                {roeStatus.status}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 font-mono">
                {fmt(returns.roe)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                {fmt(returns.roe3YAvg)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3Y Avg</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                {fmt(returns.roe5YAvg)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5Y Avg</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Source: {returns.source || "Screener.in"}
          </p>
        </div>

        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Return on Capital Employed (ROCE)
            </h3>
            {roceStatus && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[roceStatus.color]}`}>
                {roceStatus.status}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 font-mono">
                {fmt(returns.roce)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                {fmt(returns.roce3YAvg)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3Y Avg</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                {fmt(returns.roce5YAvg)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5Y Avg</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Source: {returns.source || "Screener.in"}
          </p>
        </div>
      </div>

      {/* Dividend boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">
            DIVIDEND YIELD
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-2">
            {fmt(returns.dividendYield)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Source: {returns.source || "NSE India / Screener.in"}
          </p>
        </div>

        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">
            DIVIDEND PAYOUT RATIO
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-2">
            {fmt(returns.dividendPayoutRatio)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            % of profits paid as dividend
          </p>
        </div>

        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">
            DIVIDEND CONSISTENCY
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono mb-2">
            {returns.dividendConsistency || "—"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Last 5 years</p>
        </div>
      </div>

      {/* Dividend History Chart */}
      {returns.dividendHistory && returns.dividendHistory.length > 0 && (
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Dividend History (₹ per share)
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {returns.source || "NSE India / Screener.in"}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={returns.dividendHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
              <XAxis
                dataKey="year"
                stroke={chartAxisColor}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                stroke={chartAxisColor}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartTooltipBg,
                  border: `1px solid ${chartTooltipBorder}`,
                  borderRadius: "8px",
                }}
                formatter={(value) => `₹${value}`}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={70} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Returns;