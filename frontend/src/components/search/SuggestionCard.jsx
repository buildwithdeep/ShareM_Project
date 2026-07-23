// src/components/search/SuggestionCard.jsx

function SuggestionCard({ company }) {
  const { companyName, nseSymbol, sector, bseCode } = company;

  // Two-letter initials badge, like "HD" for HDFC
  const initials = companyName
    ? companyName.trim().substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center gap-3">
        {/* Initials badge */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 dark:text-white font-medium truncate text-sm">
            {companyName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {nseSymbol}
            </span>
            {sector && (
              <>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {sector}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuggestionCard;