// src/components/common/Badge.jsx

/**
 * STATUS BADGE
 * Shows GOOD, WEAK, RISKY, etc
 */

function Badge({ status, color = "gray" }) {
  const colorClasses = {
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  };

  const bgColor = colorClasses[color] || colorClasses.gray;

  return (
    <span className={`px-3 py-1 rounded text-xs font-bold ${bgColor}`}>
      {status}
    </span>
  );
}

export default Badge;