// src/context/ThemeContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

/**
 * WHAT IS THIS FILE?
 *
 * Manages light/dark theme across the whole app.
 *
 * How it works:
 * 1. Default theme = "light"
 * 2. Checks localStorage - if user picked a theme before, use that
 * 3. Adds/removes "dark" class on <html> tag
 * 4. Tailwind's dark: classes activate when "dark" class is present
 */

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check if user previously saved a preference
    const saved = localStorage.getItem("theme");
    return saved || "light"; // DEFAULT = light
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}