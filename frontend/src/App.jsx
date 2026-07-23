// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import StockReport from "./pages/StockReport";
import Compare from "./pages/Compare";

/**
 * WHAT IS THIS FILE?
 *
 * This is the main app component.
 *
 * It:
 * 1. Sets up routing (different pages)
 * 2. Wraps everything in Layout (header, nav)
 * 3. Defines which component shows on which URL
 *
 * ROUTING = Navigation between pages
 *
 * Example:
 * /                   → Show Home page
 * /stock/RELIANCE     → Show StockReport page
 * /compare            → Show Compare page
 */

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Route 1: Home page at / */}
          <Route path="/" element={<Home />} />

          {/* Route 2: Stock report at /stock/:symbol */}
          {/* :symbol = dynamic parameter (like RELIANCE) */}
          <Route path="/stock/:symbol" element={<StockReport />} />

          {/* Route 3: Compare page */}
          <Route path="/compare" element={<Compare />} />

          {/* Route 4: Catch all - show 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

/**
 * 404 Page Not Found
 */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Go Home
      </a>
    </div>
  );
}

export default App;
