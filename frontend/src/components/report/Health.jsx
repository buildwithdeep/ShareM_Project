// src/components/report/Health.jsx

import { CheckCircle2, XCircle, Info } from "lucide-react";
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

/**
 * WHAT IS HEALTH?
 *
 * Financial health = Balance sheet strength
 *
 * Low Debt = Healthy ✅
 * High Debt = Risky ❌
 *
 * Good Current Ratio = Can pay bills ✅
 * Bad Current Ratio = Might struggle ❌
 */

function Health({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || !data.health) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Health data unavailable
      </div>
    );
  }

  const health = data.health;

  // Banks/NBFCs have a fundamentally different balance sheet —
  // Debt-to-Equity, Current Ratio, Interest Coverage don't apply the same way
  const sector = (data.company?.sector || "").toLowerCase();
  const industry = (data.company?.industry || "").toLowerCase();
  const isBankOrFinance =
    sector.includes("financ") ||
    sector.includes("bank") ||
    industry.includes("bank") ||
    industry.includes("financ");

  const badgeClasses = {
    green:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",
    yellow:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700",
    red:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700",
    blue:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-700",
  };

  // Debt-to-Equity: Below 1.0 SAFE, 1-2 MODERATE, Above 2 LEVERAGED
  const getDebtEquityStatus = (val) => {
    if (val === null || val === undefined) return null;
    if (val < 1) return { status: "SAFE", color: "green" };
    if (val <= 2) return { status: "MODERATE", color: "yellow" };
    return { status: "LEVERAGED", color: "red" };
  };

  // Interest Coverage: Above 3 HEALTHY, 1.5-3 WATCH, Below 1.5 RISK
  const getInterestCoverageStatus = (val) => {
    if (val === null || val === undefined) return null;
    if (val > 3) return { status: "HEALTHY", color: "green" };
    if (val >= 1.5) return { status: "WATCH", color: "yellow" };
    return { status: "RISK", color: "red" };
  };

  // Current Ratio: Above 1.5 COMFORTABLE, 1-1.5 WATCH, Below 1 RISK
  const getCurrentRatioStatus = (val) => {
    if (val === null || val === undefined) return null;
    if (val > 1.5) return { status: "COMFORTABLE", color: "green" };
    if (val >= 1) return { status: "WATCH", color: "yellow" };
    return { status: "RISK", color: "red" };
  };

  const deStatus = isBankOrFinance ? null : getDebtEquityStatus(health.debtToEquity);
  const icStatus = isBankOrFinance ? null : getInterestCoverageStatus(health.interestCoverage);
  const crStatus = isBankOrFinance ? null : getCurrentRatioStatus(health.currentRatio);

  const overallColor = health.overallColor || "green";
  const chartGridColor = isDark ? "#374151" : "#e5e7eb";
  const chartAxisColor = isDark ? "#9ca3af" : "#6b7280";
  const chartTooltipBg = isDark ? "#1e293b" : "#ffffff";
  const chartTooltipBorder = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="space-y-6">
      {/* Bank/Finance sector note */}
      {isBankOrFinance && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-700 rounded-xl p-5 flex items-start gap-3">
          <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <strong>Note:</strong> Debt-to-Equity, Current Ratio, and Interest
            Coverage aren't meaningful for banks and financial institutions —
            customer deposits are recorded as liabilities, which distorts
            these ratios. Metrics like NPA ratio, CASA ratio, and Capital
            Adequacy Ratio are more relevant for evaluating bank health.
          </p>
        </div>
      )}

      {/* Overall Health */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between flex-wrap gap-3 transition-colors">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center ${
              overallColor === "red"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-green-100 dark:bg-green-900/30"
            }`}
          >
            {overallColor === "red" ? (
              <XCircle size={22} className="text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
            )}
          </div>
          <div>
            <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
              OVERALL FINANCIAL HEALTH
            </p>
            <span
              className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[overallColor]}`}
            >
              {health.overallStatus || "FINANCIALLY HEALTHY"}
            </span>
          </div>
        </div>
        {health.source && (
          <p className="text-xs text-gray-400 dark:text-gray-500">Source: {health.source}</p>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Debt-to-Equity Ratio
            </h3>
            {isBankOrFinance ? (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses.blue}`}>
                N/A
              </span>
            ) : (
              deStatus && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[deStatus.color]}`}>
                  {deStatus.status}
                </span>
              )
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {isBankOrFinance
              ? "Not applicable for banks/NBFCs"
              : "Below 1.0 is SAFE · 1-2 is MODERATE · Above 2 is LEVERAGED"}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-2">
            {isBankOrFinance
              ? "—"
              : health.debtToEquity != null
              ? `${Number(health.debtToEquity).toFixed(2)}x`
              : "—"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Source: {health.source || "Annual Report"}
          </p>
        </div>

        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Interest Coverage Ratio
            </h3>
            {isBankOrFinance ? (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses.blue}`}>
                N/A
              </span>
            ) : (
              icStatus && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[icStatus.color]}`}>
                  {icStatus.status}
                </span>
              )
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {isBankOrFinance
              ? "Not applicable for banks/NBFCs"
              : "Above 3 is HEALTHY · 1.5-3 is WATCH · Below 1.5 is RISK"}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-2">
            {isBankOrFinance
              ? "—"
              : health.interestCoverage != null
              ? `${Number(health.interestCoverage).toFixed(2)}x`
              : "—"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Source: {health.source || "Annual Report"}
          </p>
        </div>

        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Current Ratio
            </h3>
            {isBankOrFinance ? (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses.blue}`}>
                N/A
              </span>
            ) : (
              crStatus && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[crStatus.color]}`}>
                  {crStatus.status}
                </span>
              )
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {isBankOrFinance
              ? "Not applicable for banks/NBFCs"
              : "Above 1.5 is COMFORTABLE · 1-1.5 is WATCH · Below 1 is RISK"}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-2">
            {isBankOrFinance
              ? "—"
              : health.currentRatio != null
              ? `${Number(health.currentRatio).toFixed(2)}x`
              : "—"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Source: {health.source || "Annual Report"}
          </p>
        </div>
      </div>

      {/* Free Cash Flow */}
      {health.fcfTrend && health.fcfTrend.length > 0 && (
        <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h3 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white">
              FREE CASH FLOW (₹ CR)
            </h3>
            {health.fcfStatus && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[health.fcfStatusColor || "green"]}`}>
                {health.fcfStatus}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Free Cash Flow = Operating Cash Flow minus Capital Expenditure.
            Positive FCF means business generates cash after maintaining
            assets.
          </p>

          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Free Cash Flow Trend (₹ Crore)
              </h4>
              {health.source && (
                <span className="text-xs text-gray-400 dark:text-gray-500">{health.source}</span>
              )}
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={health.fcfTrend}>
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
                  formatter={(value) => `₹${value.toLocaleString("en-IN")} Cr`}
                />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={70} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Health;