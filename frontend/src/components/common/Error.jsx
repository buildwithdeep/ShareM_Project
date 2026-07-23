// src/components/common/Error.jsx

import { AlertTriangle, RefreshCw } from "lucide-react";

function Error({ message, onRetry }) {
  return (
    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 flex items-start gap-4 transition-colors">
      {/* Error Icon */}
      <AlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-1" size={24} />

      {/* Error Content */}
      <div className="flex-1">
        <h3 className="text-red-700 dark:text-red-300 font-bold mb-2">Error Loading Data</h3>
        <p className="text-red-600 dark:text-red-200 mb-4">
          {message || "Something went wrong. Please try again."}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default Error;