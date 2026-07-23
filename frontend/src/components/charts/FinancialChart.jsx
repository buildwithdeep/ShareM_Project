// src/components/charts/FinancialChart.jsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "../../utils/formatNumber";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p
          key={index}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: ₹{entry.value.toLocaleString("en-IN")} Cr
        </p>
      ))}
    </div>
  );
}

function FinancialChart({ data }) {
  if (!data) {
    return (
      <div className="bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
        📊 Financial data not available
      </div>
    );
  }

  const chartData = [
    {
      name: "FY Report",
      revenue: data.revenue ? Number((data.revenue / 10000000).toFixed(2)) : 0,
      netProfit: data.netProfit
        ? Number((data.netProfit / 10000000).toFixed(2))
        : 0,
    },
  ];

  return (
    <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 transition-colors">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
        📊 Financial Metrics
      </h3>

      <ResponsiveContainer width="100%" height={240} className="sm:!h-[280px]">
        <BarChart data={chartData} barGap={12} barCategoryGap="30%">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-gray-500 dark:text-gray-400"
            axisLine={{ stroke: "currentColor" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "currentColor", fontSize: 11 }}
            className="text-gray-500 dark:text-gray-400"
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val.toLocaleString("en-IN")}`}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(100,116,139,0.08)" }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
          />
          <Bar
            dataKey="revenue"
            fill="url(#revenueGradient)"
            name="Revenue (₹Cr)"
            radius={[8, 8, 0, 0]}
            maxBarSize={90}
          />
          <Bar
            dataKey="netProfit"
            fill="url(#profitGradient)"
            name="Net Profit (₹Cr)"
            radius={[8, 8, 0, 0]}
            maxBarSize={90}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-gray-50 dark:bg-primary border border-gray-200 dark:border-gray-700 rounded p-2.5 sm:p-4">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Revenue</p>
          <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mt-1 truncate">
            {formatNumber(data.revenue)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-primary border border-gray-200 dark:border-gray-700 rounded p-2.5 sm:p-4">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Net Profit</p>
          <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mt-1 truncate">
            {formatNumber(data.netProfit)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-primary border border-gray-200 dark:border-gray-700 rounded p-2.5 sm:p-4">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">EPS</p>
          <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mt-1 truncate">
            {data.eps ? `₹${data.eps.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FinancialChart;