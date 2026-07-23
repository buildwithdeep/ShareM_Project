// src/layout/Navbar.jsx

import { useNavigate } from "react-router-dom";
import { BarChart3, Sun, Moon, TrendingUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-primary border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition min-w-0"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
                Share Analysis
              </h1>
              <p className="hidden xs:block text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 tracking-wider leading-tight">
                INDIA RESEARCH
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-100 dark:bg-secondary border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button className="flex items-center gap-2 bg-gray-100 dark:bg-secondary border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 sm:px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              <TrendingUp size={14} />
              <span className="hidden sm:inline">NSE India</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;