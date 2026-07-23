// src/components/common/Tabs.jsx

/**
 * ✅ REUSABLE TABS COMPONENT
 *
 * Props:
 * - tabs: Array of { label, id }
 * - activeTab: Current tab index
 * - onTabChange: Callback function
 */

function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">
      <div className="flex gap-0 bg-gray-50 dark:bg-primary overflow-x-auto scrollbar-hide sm:flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`
              shrink-0 sm:flex-1 px-4 py-3 text-center font-medium transition text-sm sm:text-base
              border-b-2 whitespace-nowrap
              ${
                activeTab === index
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-secondary"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;