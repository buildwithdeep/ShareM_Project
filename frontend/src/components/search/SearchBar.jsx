// src/components/search/SearchBar.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, CornerDownLeft } from "lucide-react";
import { searchCompanies } from "../../api/stockApi";
import useDebounce from "../../hooks/useDebounce";
import SuggestionCard from "./SuggestionCard";
import Loader from "../common/Loader";

function SearchBar({ large = false }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const navigate = useNavigate();
  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    fetchSuggestions(debouncedInput);
  }, [debouncedInput]);

  const fetchSuggestions = async (query) => {
    try {
      setLoading(true);
      const results = await searchCompanies(query);
      setSuggestions(results);
      setShowSuggestions(true);
      setHighlightedIndex(0);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (symbol) => {
    setShowSuggestions(false);
    setInput("");
    navigate(`/stock/${symbol}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelectCompany(suggestions[highlightedIndex].nseSymbol);
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full text-left">
      {/* Search Input Field */}
      <div
        className={`flex items-center gap-2 sm:gap-3 bg-white dark:bg-secondary/60 border border-gray-300 dark:border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors ${
          large ? "px-3 sm:px-4 py-3 sm:py-4" : "px-3 py-2.5 sm:px-4 sm:py-3"
        }`}
      >
        <Search size={18} className="text-gray-400 dark:text-gray-500 shrink-0 sm:w-5 sm:h-5" />

        <input
          type="text"
          placeholder="Search company or NSE symbol..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => input && setShowSuggestions(true)}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />

        {/* Clear button */}
        {input && (
          <X
            size={18}
            className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white transition shrink-0"
            onClick={() => {
              setInput("");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
          />
        )}
      </div>

      {/* Dropdown Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-secondary border border-gray-300 dark:border-gray-600 border-t-0 rounded-b-lg overflow-hidden shadow-lg z-50">
          {loading && (
            <div className="p-4 flex justify-center">
              <Loader />
            </div>
          )}

          {!loading && suggestions.length === 0 && input && (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No companies found
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <>
              <div className="px-3 sm:px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700 flex items-center gap-1">
                <Search size={12} />
                {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
              </div>

              <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                {suggestions.map((company, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCompany(company.nseSymbol)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`cursor-pointer transition ${
                      index === highlightedIndex
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <SuggestionCard company={company} />
                  </div>
                ))}
              </div>

              <div className="hidden sm:flex px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 items-center justify-end gap-1">
                <CornerDownLeft size={12} />
                Select with Enter
              </div>
            </>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}

export default SearchBar;