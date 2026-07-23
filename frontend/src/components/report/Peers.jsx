// src/components/report/Peers.jsx

import { Users } from "lucide-react";

function Peers({ data }) {
  if (!data?.peers) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Competitor data unavailable
      </div>
    );
  }

  const peersData = data.peers;
  const peerList = Array.isArray(peersData) ? peersData : peersData.list;

  if (!Array.isArray(peerList) || peerList.length === 0) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        ℹ️ Peer comparison data not available yet
      </div>
    );
  }

  const companySymbol = data.company?.nseSymbol || data.company?.name || "";
  const position = peersData.position || null; // LEADING / AVERAGE / LAGGING
  const source = peersData.source || "Screener.in / Tickertape";

  const badgeClasses = {
    green:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",
    yellow:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700",
    red:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700",
  };

  const positionColorMap = {
    LEADING: "green",
    AVERAGE: "yellow",
    LAGGING: "red",
  };
  const positionColor = positionColorMap[position] || "green";

  const roeColor = (roe) => {
    if (roe == null) return "text-gray-900 dark:text-white";
    if (roe > 20) return "text-green-600 dark:text-green-400";
    if (roe > 10) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const growthColor = (growth) => {
    if (growth == null) return "text-gray-900 dark:text-white";
    if (growth > 10) return "text-green-600 dark:text-green-400";
    if (growth > 5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-colors">
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <Users size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <div className="min-w-0">
            <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
              PEER POSITION
            </p>
            <p className="text-gray-900 dark:text-white text-sm sm:text-base truncate">
              <span className="font-bold">{companySymbol}</span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                vs. {peerList.length} closest peers
              </span>
            </p>
          </div>
          {position && (
            <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses[positionColor]}`}>
              {position}
            </span>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors">
        <div className="overflow-x-auto -mx-px">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-primary border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wide whitespace-nowrap">COMPANY</th>
                <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wide text-right whitespace-nowrap">P/E</th>
                <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wide text-right whitespace-nowrap">P/B</th>
                <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wide text-right whitespace-nowrap">ROE %</th>
                <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wide text-right whitespace-nowrap">REV GROWTH</th>
                <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wide text-right whitespace-nowrap">D/E</th>
              </tr>
            </thead>
            <tbody>
              {peerList.map((peer, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-gray-900 dark:text-white font-medium">{peer.name}</p>
                    {peer.symbol && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{peer.symbol}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-white font-mono whitespace-nowrap">
                    {peer.pe != null ? `${Number(peer.pe).toFixed(1)}x` : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-white font-mono whitespace-nowrap">
                    {peer.pb != null ? `${Number(peer.pb).toFixed(1)}x` : "—"}
                  </td>
                  <td className={`px-4 py-4 text-right font-mono font-semibold whitespace-nowrap ${roeColor(peer.roe)}`}>
                    {peer.roe != null ? `${Number(peer.roe).toFixed(1)}%` : "—"}
                  </td>
                  <td className={`px-4 py-4 text-right font-mono font-semibold whitespace-nowrap ${growthColor(peer.revGrowth)}`}>
                    {peer.revGrowth != null ? `${Number(peer.revGrowth).toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-white font-mono whitespace-nowrap">
                    {peer.de != null ? `${Number(peer.de).toFixed(1)}x` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-wrap gap-2">
          {position && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Peer position:{" "}
              <span
                className={
                  positionColor === "green"
                    ? "text-green-600 dark:text-green-400 font-bold"
                    : positionColor === "red"
                    ? "text-red-600 dark:text-red-400 font-bold"
                    : "text-yellow-600 dark:text-yellow-400 font-bold"
                }
              >
                {position}
              </span>
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500">Source: {source}</p>
        </div>
      </div>

      {/* How to read guide */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 transition-colors">
        <h3 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white mb-4">
          HOW TO READ PEER COMPARISON
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <strong className="text-gray-900 dark:text-white">P/E Ratio:</strong> Lower can
            mean cheaper valuation OR lower growth expectations. Compare with
            ROE and growth rates.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Revenue Growth:</strong> Higher
            growth companies command higher multiples. Declining growth is a
            red flag.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">P/B Ratio:</strong> Price vs
            book value. High P/B justified only by high ROE (ROE {">"} Cost of
            Equity).
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Debt-to-Equity:</strong> Low
            D/E with high ROE = business quality. High D/E inflates ROE — not
            genuine quality.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">ROE:</strong> The most important
            return metric. Leader in sector ROE usually commands premium
            valuation.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Note:</strong> D/E and some
            ratios are not applicable for banks and NBFCs. Use NIM and NPA
            metrics instead.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Peers;