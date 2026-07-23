// src/components/common/PriceBox.jsx

import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * ✅ PRICE DISPLAY BOX
 */

function PriceBox({
  price,
  change,
  changePercent,
  label = "Current Price",
  size = "large", // 'small' | 'medium' | 'large'
}) {
  const isPositive = change >= 0;
  const textColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
  const bgColor = isPositive
    ? "bg-green-50 dark:bg-green-900/20"
    : "bg-red-50 dark:bg-red-900/20";
  const borderColor = isPositive
    ? "border-green-300 dark:border-green-700"
    : "border-red-300 dark:border-red-700";

  const sizeClasses = {
    small: { label: "text-xs", price: "text-lg", change: "text-sm" },
    medium: { label: "text-sm", price: "text-3xl", change: "text-base" },
    large: { label: "text-base", price: "text-5xl", change: "text-xl" },
  };

  const s = sizeClasses[size];

  return (
    <div
      className={`border ${borderColor} rounded-lg p-4 ${bgColor} transition-colors`}
    >
      <p className={`text-gray-500 dark:text-gray-400 ${s.label} mb-2`}>{label}</p>

      <div className="flex items-baseline gap-3">
        <span className={`font-bold text-gray-900 dark:text-white ${s.price}`}>
          ₹{price?.toFixed(2) || "0.00"}
        </span>

        <div
          className={`flex items-center gap-1 ${textColor} ${s.change} font-bold`}
        >
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          {isPositive ? "+" : ""}
          {change?.toFixed(2) || "0.00"} ({changePercent?.toFixed(2) || "0.00"}
          %)
        </div>
      </div>
    </div>
  );
}

export default PriceBox;