// src/pages/Compare.jsx

import { useState } from "react";
import SearchBar from "../components/search/SearchBar";
import MetricCard from "../components/common/MetricCard";

/**
 * COMPARE PAGE
 *
 * Allow users to compare multiple stocks
 * side-by-side
 */

function Compare() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Compare Stocks</h1>
        <p className="text-gray-400">Search and compare up to 5 companies</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <SearchBar />
      </div>

      {/* Comparison Table */}
      <div className="bg-secondary border border-gray-600 rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-6 py-4 text-white font-bold">Metric</th>
              {selectedCompanies.map((company, index) => (
                <th key={index} className="px-6 py-4 text-white font-bold">
                  {company.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-600">
              <td className="px-6 py-4 text-gray-400">Price</td>
              {selectedCompanies.map((company, index) => (
                <td key={index} className="px-6 py-4 text-white font-bold">
                  ₹{company.price}
                </td>
              ))}
            </tr>
            {/* Add more metrics as needed */}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {selectedCompanies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">
            Search and select companies to compare
          </p>
        </div>
      )}
    </div>
  );
}

export default Compare;
