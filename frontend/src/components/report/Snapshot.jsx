// src/components/report/Snapshot.jsx

import { useState } from "react";
import { Building2, RefreshCw, Zap, Clock } from "lucide-react";
import { formatNumber } from "../../utils/formatNumber";

function Snapshot({ data, company, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  if (!data?.snapshot) {
    return (
      <div className="bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        📊 Snapshot data unavailable
      </div>
    );
  }

  const snapshot = data.snapshot;

  const currentPrice = snapshot.currentPrice || 0;
  const dayChange = snapshot.dayChange || 0;
  const dayChangePercent = snapshot.dayChangePercent || 0;
  const dayHigh = snapshot.dayHigh || 0;
  const dayLow = snapshot.dayLow || 0;
  const weekHigh = snapshot.fiftyTwoWeekHigh || 0;
  const weekLow = snapshot.fiftyTwoWeekLow || 0;
  const previousClose = snapshot.previousClose || 0;
  const volume = snapshot.volume || 0;

  const isPositive = dayChange >= 0;
  const changeColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";

  // Position of current price on the 52-week range bar (0-100%)
  const rangePercent =
    weekHigh > weekLow
      ? Math.min(100, Math.max(0, ((currentPrice - weekLow) / (weekHigh - weekLow)) * 100))
      : 50;

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Company Header Card */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 transition-colors">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl flex items-center justify-center">
              <Building2 size={22} className="text-blue-600 dark:text-blue-400 sm:w-[26px] sm:h-[26px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                {company?.name || "Company"}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5">
                {company?.nseSymbol && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    NSE: {company.nseSymbol}
                  </span>
                )}
                {company?.bseCode && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    BSE: {company.bseCode}
                  </span>
                )}
                {company?.sector && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    {company.sector}
                  </span>
                )}
                {company?.industry && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    {company.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          {snapshot.faceValue && (
            <div className="text-right shrink-0">
              <p className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Zap size={12} /> Face Value
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{snapshot.faceValue}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Price Card */}
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 transition-colors">
        {/* Top row: source + refresh */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"></span>
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              {snapshot.marketStatus || "DELAYED"}
            </span>
            <span className="text-gray-400 dark:text-gray-500">·</span>
            <span className="text-gray-500 dark:text-gray-400">
              {snapshot.dataSource || "NSE · Yahoo Finance (NSE)"}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500 transition"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between flex-wrap gap-2 mb-6">
          <div className="min-w-0">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-mono break-all">
              ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className={`flex items-center gap-2 flex-wrap text-base sm:text-lg font-semibold mt-2 ${changeColor}`}>
              <span>{isPositive ? "↗" : "↘"}</span>
              <span className="font-mono">
                {isPositive ? "+" : ""}₹{Math.abs(dayChange).toFixed(2)} ({isPositive ? "+" : ""}
                {dayChangePercent.toFixed(2)}%)
              </span>
              <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
                vs prev close
              </span>
            </p>
          </div>

          {snapshot.lastFetched && (
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              {new Date(snapshot.lastFetched).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              IST
            </p>
          )}
        </div>

        {/* 4 metric boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">DAY HIGH</p>
            <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 font-mono">
              ₹{dayHigh.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">DAY LOW</p>
            <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 font-mono">
              ₹{dayLow.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">52W HIGH</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-mono">
              ₹{weekHigh.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">52W LOW</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-mono">
              ₹{weekLow.toFixed(2)}
            </p>
          </div>
        </div>

        {/* 52-week range slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 gap-2">
            <span className="shrink-0">52W Low: ₹{weekLow.toFixed(2)}</span>
            <span className="hidden sm:inline text-gray-600 dark:text-gray-300 font-medium">
              Current price position
            </span>
            <span className="shrink-0">52W High: ₹{weekHigh.toFixed(2)}</span>
          </div>
          <div className="relative h-2 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 dark:from-red-500 dark:via-yellow-500 dark:to-green-500">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-100 border-2 border-blue-500 shadow"
              style={{ left: `${rangePercent}%` }}
            ></div>
          </div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            {rangePercent.toFixed(0)}% from 52-week low
          </p>
        </div>

        {/* Prev Close + Volume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PREV CLOSE</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-mono">
              ₹{previousClose.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-primary/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">VOLUME</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-mono">
              {formatNumber(volume)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Snapshot;