// src/components/common/Loader.jsx

/**
 * WHAT IS THIS COMPONENT?
 *
 * Shows a loading spinner while fetching data.
 *
 * Display when:
 * - API call is in progress
 * - Data hasn't arrived yet
 */

function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="space-y-4">
        {/* Spinning circle */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          Loading stock data...
        </p>
      </div>
    </div>
  );
}

export default Loader;