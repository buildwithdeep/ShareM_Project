// src/layout/Layout.jsx

import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-primary transition-colors">
      {/* Navigation bar - fixed at top, stays in place while scrolling */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main content - grows to fill available space */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full">
        {children}
      </main>

      {/* Footer - always stays at the bottom of the viewport */}
      <footer className="bg-gray-50 dark:bg-secondary border-t border-gray-200 dark:border-gray-700 py-6 sm:py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          <p>
            © {new Date().getFullYear()} Indian Shares Research Platform. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;