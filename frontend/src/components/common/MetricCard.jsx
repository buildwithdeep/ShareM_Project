// src/components/common/MetricCard.jsx

function MetricCard({
  label,
  value,
  unit = "",
  description = "",
  color = "default",
}) {
  // Handle missing/null values
  if (value === null || value === undefined || value === "N/A") {
    return (
      <div className="bg-gray-50 dark:bg-primary border border-gray-200 dark:border-gray-700 rounded p-2.5 sm:p-4 transition-colors">
        <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm font-medium">{label}</p>
        <p className="text-gray-400 dark:text-gray-600 text-base sm:text-lg mt-1 sm:mt-2">—</p>
        {description && (
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">{description}</p>
        )}
      </div>
    );
  }

  // Round numbers to 2 decimals, leave text values as-is
  const displayValue =
    typeof value === "number" ? Number(value.toFixed(2)) : value;

  const textColorClass =
    {
      default: "text-gray-900 dark:text-white",
      green: "text-green-600 dark:text-green-400",
      red: "text-red-600 dark:text-red-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      blue: "text-blue-600 dark:text-blue-400",
    }[color] || "text-gray-900 dark:text-white";

  return (
    <div className="bg-gray-50 dark:bg-primary border border-gray-200 dark:border-gray-700 rounded p-2.5 sm:p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm font-medium truncate">{label}</p>

      <p className={`text-base sm:text-2xl font-bold mt-1 sm:mt-2 ${textColorClass} break-words`}>
        {displayValue}
        {unit && <span className="text-xs sm:text-sm ml-1">{unit}</span>}
      </p>

      {description && (
        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1 sm:mt-2">{description}</p>
      )}
    </div>
  );
}

export default MetricCard;