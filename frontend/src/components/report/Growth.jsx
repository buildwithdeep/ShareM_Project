// src/components/report/Growth.jsx

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import MetricCard from "../common/MetricCard";
import Badge from "../common/Badge";
import FinancialChart from "../charts/FinancialChart";
import { formatNumber, formatCurrency } from "../../utils/formatNumber";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Growth({ data }) {
  if (!data || !data.fundamentals) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Growth data unavailable
      </div>
    );
  }

  const fundamentals = data.fundamentals;
  const growth = data.growth || {};

  const getGrowthStatus = (profitMargin) => {
    if (!profitMargin) return null;
    if (profitMargin > 15) return { status: "STRONG", color: "green" };
    if (profitMargin > 8) return { status: "MODERATE", color: "yellow" };
    return { status: "WEAK", color: "red" };
  };

  const growthStatus = getGrowthStatus(fundamentals.profitMargin);

  const formatPct = (val, showSign = true) => {
    if (val === null || val === undefined) return "—";
    const sign = showSign && val >= 0 ? "+" : "";
    return `${sign}${val.toFixed(1)}%`;
  };

  const getTrendIcon = (val) => {
    if (val === null || val === undefined) return <Minus size={14} className="text-gray-400" />;
    if (val > 1) return <TrendingUp size={14} className="text-green-600 dark:text-green-400" />;
    if (val < -1) return <TrendingDown size={14} className="text-red-600 dark:text-red-400" />;
    return <Minus size={14} className="text-yellow-500" />;
  };

  const getTrendLabel = (val) => {
    if (val === null || val === undefined) return "No data";
    if (val > 1) return "Growing";
    if (val < -1) return "Slowing";
    return "Stable";
  };

  const quarterlyChartData = (growth.quarterlyRevenue || []).map((q) => ({
    quarter: q.quarter,
    revenueCr: q.value ? Number((q.value / 10000000).toFixed(2)) : 0,
  }));

  // Margin change (current - 5Y ago), used to pick a trend icon for margin rows
  const ebitdaMarginChange =
    growth.ebitdaMarginCurrent !== null && growth.ebitdaMargin5YAgo !== null
      ? growth.ebitdaMarginCurrent - growth.ebitdaMargin5YAgo
      : null;

  const netProfitMarginChange =
    growth.netProfitMarginCurrent !== null && growth.netProfitMargin5YAgo !== null
      ? growth.netProfitMarginCurrent - growth.netProfitMargin5YAgo
      : null;

  // Rows for the growth summary table
  const growthRows = [
    {
      metric: "Revenue",
      col1Label: "3Y CAGR",
      col1: formatPct(growth.revenueCagr3Y),
      col2Label: "5Y CAGR",
      col2: formatPct(growth.revenueCagr5Y),
      trendVal: growth.revenueCagr3Y,
    },
    {
      metric: "Net Profit",
      col1Label: "3Y CAGR",
      col1: formatPct(growth.netProfitCagr3Y),
      col2Label: "5Y CAGR",
      col2: formatPct(growth.netProfitCagr5Y),
      trendVal: growth.netProfitCagr3Y,
    },
    {
      metric: "EPS",
      col1Label: "3Y CAGR",
      col1: "—",
      col2Label: "5Y CAGR",
      col2: "—",
      trendVal: null,
    },
    {
      metric: "EBITDA Margin",
      col1Label: "Current",
      col1: growth.ebitdaMarginCurrent !== null ? formatPct(growth.ebitdaMarginCurrent, false) : "—",
      col2Label: "5Y Ago",
      col2: growth.ebitdaMargin5YAgo !== null ? formatPct(growth.ebitdaMargin5YAgo, false) : "—",
      trendVal: ebitdaMarginChange,
    },
    {
      metric: "Net Profit Margin",
      col1Label: "Current",
      col1: growth.netProfitMarginCurrent !== null ? formatPct(growth.netProfitMarginCurrent, false) : "—",
      col2Label: "5Y Ago",
      col2: growth.netProfitMargin5YAgo !== null ? formatPct(growth.netProfitMargin5YAgo, false) : "—",
      trendVal: netProfitMarginChange,
    },
  ];

  const hasGrowthTable = growthRows.some((r) => r.col1 !== "—" || r.col2 !== "—");

  const lq = growth.latestQuarter;

  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 transition-colors">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 flex-wrap">
          📈 Growth & Profitability
          {growthStatus && (
            <Badge status={growthStatus.status} color={growthStatus.color} />
          )}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            label="Revenue"
            value={formatNumber(fundamentals.revenue)}
          />
          <MetricCard
            label="Net Profit"
            value={formatNumber(fundamentals.netProfit)}
          />
          <MetricCard
            label="EPS"
            value={fundamentals.eps ? formatCurrency(fundamentals.eps) : null}
            unit="₹"
          />
          <MetricCard
            label="Profit Margin"
            value={
              fundamentals.profitMargin
                ? Number(fundamentals.profitMargin.toFixed(2))
                : null
            }
            unit="%"
          />
        </div>
      </div>

      {/* Is this company growing? — table */}
      {hasGrowthTable && (
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 transition-colors">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
            Is This Company Growing Its Revenue And Profits?
          </h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 font-medium whitespace-nowrap">Metric</th>
                  <th className="pb-2 font-medium whitespace-nowrap">{growthRows[0].col1Label}</th>
                  <th className="pb-2 font-medium whitespace-nowrap">{growthRows[0].col2Label}</th>
                  <th className="pb-2 font-medium whitespace-nowrap">Trend</th>
                </tr>
              </thead>
              <tbody>
                {growthRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-3 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                      {row.metric}
                    </td>
                    <td className="py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {row.col1}
                    </td>
                    <td className="py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {row.col2}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        {getTrendIcon(row.trendVal)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getTrendLabel(row.trendVal)}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Revenue/Net Profit show CAGR from annual statements. Margins
            compare current year vs 5 years ago. Source: Google Finance.
          </p>
        </div>
      )}

      {/* Latest Quarter Summary */}
      {lq && (
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 transition-colors">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            Latest Quarter — {lq.quarter}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <span className="text-gray-600 dark:text-gray-300">Revenue</span>
              <span className="font-bold text-gray-900 dark:text-white text-right">
                {formatNumber(lq.revenue)}
                {lq.revenueChangePercent !== null && (
                  <span
                    className={`ml-2 text-xs font-semibold ${
                      lq.revenueChangePercent >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ({lq.revenueChangePercent >= 0 ? "+" : ""}
                    {lq.revenueChangePercent.toFixed(1)}% YoY)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <span className="text-gray-600 dark:text-gray-300">Net Profit</span>
              <span className="font-bold text-gray-900 dark:text-white text-right">
                {formatNumber(lq.netProfit)}
                {lq.netProfitChangePercent !== null && (
                  <span
                    className={`ml-2 text-xs font-semibold ${
                      lq.netProfitChangePercent >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ({lq.netProfitChangePercent >= 0 ? "+" : ""}
                    {lq.netProfitChangePercent.toFixed(1)}% YoY)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quarterly Revenue Trend chart */}
      {quarterlyChartData.length > 0 && (
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 transition-colors">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            Quarterly Revenue Trend (₹ Cr)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={quarterlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} stroke="#6b7280" tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" tickLine={false} axisLine={false} width={35} />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString("en-IN")} Cr`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenueCr" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Original Financial Chart — kept as-is */}
      <FinancialChart data={fundamentals} />
    </div>
  );
}

export default Growth;