// src/components/charts/StockChart.jsx

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

/**
 * ✅ STOCK PRICE CHART
 *
 * For production, use TradingView widget instead:
 * https://www.tradingview.com/widget/
 */

function StockChart({ historicalData = [] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
        📊 Historical data not available
      </div>
    );
  }

  // Format data for chart
  const chartData = historicalData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-IN"),
    price: item.close,
    high: item.high,
    low: item.low,
  }));

  // Recharts needs actual JS color values (can't use Tailwind dark: classes here)
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const tooltipLabelColor = isDark ? "#fff" : "#111827";

  return (
    <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 transition-colors">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        📈 Price Chart (Last 1 Year)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 12 }} />
          <YAxis stroke={axisColor} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: tooltipLabelColor }}
            formatter={(value) => `₹${value?.toFixed(2) || 0}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;