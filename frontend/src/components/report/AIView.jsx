// src/components/report/AIView.jsx

import { useState, useRef } from "react";
import {
  Sparkles,
  Search,
  Users,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

import chatgptIcon from "../../assets/chatgpt-icon.png";
import claudeIcon from "../../assets/claude-icon.png";
import geminiIcon from "../../assets/gemini-icon.png";

function buildPrompts(company) {
  const name = company?.name || "this company";
  const symbol = company?.nseSymbol || "";
  const sector = company?.sector || "";
  const industry = company?.industry || "";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fundamentalView = `Current Date: ${currentDate}

You are a professional Indian stock market analyst. Do a complete fundamental analysis of ${name} (${symbol}), listed on NSE/BSE India, operating in the ${sector}${industry ? " / " + industry : ""} sector. Search the web for the most recent publicly available data and cover the following in a clearly structured format with headers:

1. BUSINESS OVERVIEW — What does the company actually do, its main revenue segments, and geographic exposure.
2. COMPETITIVE MOAT — Brand strength, market share, switching costs, cost advantages, or any durable edge over competitors.
3. FINANCIAL PERFORMANCE — Revenue and net profit trend over the last 3-5 years, margin trend (improving/declining), and quality of earnings.
4. VALUATION — Current P/E, P/B, and EV/EBITDA versus the company's own 5-year historical average and versus key sector peers. State whether it looks cheap, fair, or expensive and why.
5. BALANCE SHEET STRENGTH — Debt-to-equity, interest coverage, and free cash flow generation.
6. MANAGEMENT QUALITY — Promoter track record, corporate governance history, capital allocation decisions.
7. VERDICT — A clear one-line conclusion: is this a fundamentally strong, moderate, or weak business at current levels, and why.

Base every point on the most current data you can find. If a data point is unavailable, say so explicitly rather than guessing.`;

  const deepResearch = `Current Date: ${currentDate}

I'm researching ${name} (${symbol}) on the Indian stock market (NSE/BSE), sector: ${sector}. Please research and answer these questions using the most current, publicly available information — search the web where needed and cite what you find:

1. What is the company's core business and how exactly does it make money (revenue segments/breakdown)?
2. What is its competitive advantage / economic moat, and is it strengthening or weakening?
3. How has revenue and net profit grown over the last 3-5 years — consistent or lumpy?
4. What is the current valuation (P/E, P/B, EV/EBITDA) versus its own historical average and versus sector peers?
5. What is the company's debt level, interest coverage, and overall balance sheet strength?
6. What is the current shareholding pattern — promoter, FII, DII, and public holding — and has promoter holding changed (increased/decreased/pledged) in recent quarters?
7. Who is the management team, and what is their track record on execution and capital allocation?
8. What are the key growth drivers and catalysts going forward (new capacity, order book, sector tailwinds, etc.)?
9. What are the biggest risks and red flags an investor should watch for (regulatory, competitive, financial, or governance)?
10. What is the current analyst consensus / target price / rating on this stock, and has it changed recently?

Present the answers in a clearly structured format with a heading for each question, and end with a brief overall summary of the investment case (bull case vs bear case).`;

  const ownershipInsights = `Current Date: ${currentDate}

Research the current shareholding / ownership pattern of ${name} (${symbol}), listed on NSE/BSE India. Search the web for the most recent quarterly shareholding pattern filing and cover:

1. PROMOTER HOLDING — Current percentage, trend over the last 4-8 quarters, and any recent pledging, buying, or selling activity. What does the trend signal about promoter confidence?
2. FII HOLDING — Foreign Institutional Investor holding percentage and trend. Is foreign money entering or exiting?
3. DII HOLDING — Domestic Institutional Investor (mutual funds, insurance companies) holding percentage and trend.
4. PUBLIC / RETAIL HOLDING — Percentage held by retail investors and how it has moved.
5. NOTABLE SHAREHOLDERS — Any large individual investors, family offices, or funds with a meaningful stake, and any recent block/bulk deals.
6. OVERALL READ — Based on all of the above, is smart money (promoters + FII + DII combined) accumulating or reducing exposure to this stock? What should an investor infer from this?

Use the most recent quarterly data available and clearly state the reporting quarter/date for each figure.`;

  const profitTrackRecord = `Current Date: ${currentDate}

Research ${name}'s (${symbol}) profitability track record over the last 5 financial years, using the most recent annual report and quarterly data available. Specifically answer:

1. In how many of the last 5 financial years did the company report a net profit versus a loss? List year-by-year net profit figures.
2. Was the profit growth consistent, cyclical, or volatile? Explain the pattern.
3. What was the profit margin trend (expanding, stable, or contracting) over this period?
4. Were there any exceptional or one-time items (asset sales, write-offs, tax adjustments, impairments) that significantly inflated or deflated profit in any particular year? Call these out explicitly.
5. How does the profit growth rate (CAGR) over 3 years and 5 years compare to revenue growth over the same period — is profit growing faster or slower than revenue, and what does that indicate about operating leverage or margin pressure?
6. Overall assessment — rate the profit quality and consistency as HIGH, MODERATE, or LOW, with a one-line justification.

Present this as a clear year-by-year breakdown followed by the overall assessment.`;

  return [
    {
      key: "fundamental",
      label: "Fundamental View",
      icon: Sparkles,
      prompt: fundamentalView,
    },
    {
      key: "deep",
      label: "Deep Research (10 Questions)",
      icon: Search,
      prompt: deepResearch,
    },
    {
      key: "ownership",
      label: "Ownership Insights",
      icon: Users,
      prompt: ownershipInsights,
    },
    {
      key: "profit",
      label: "5-Year Profit Track Record",
      icon: TrendingUp,
      prompt: profitTrackRecord,
    },
  ];
}

const AI_TARGETS = [
  {
    key: "chatgpt",
    label: "ChatGPT",
    iconImg: chatgptIcon,
    bg: "bg-white",
    needsConfirm: true,
    buildUrl: () => "https://chatgpt.com/",
  },
  {
    key: "claude",
    label: "Claude",
    iconImg: claudeIcon,
    bg: "bg-[#d97757]",
    needsConfirm: true,
    buildUrl: () => "https://claude.ai/new",
  },
  {
    key: "gemini",
    label: "Gemini",
    iconImg: geminiIcon,
    bg: "bg-white",
    needsConfirm: true,
    buildUrl: () => "https://gemini.google.com/app",
  },
];

function AIView({ data }) {
  const [openKey, setOpenKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [panel, setPanel] = useState(null);
  const panelRef = useRef(null);

  if (!data || !data.company) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        Company data unavailable
      </div>
    );
  }

  const prompts = buildPrompts(data.company);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAiClick = (item, target) => {
    setPanel({ category: item, target, confirmed: false });
    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handlePanelCopy = async () => {
    if (!panel) return;
    await copyToClipboard(panel.category.prompt);
    setCopiedKey("panel");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePanelOk = () => {
    if (!panel) return;
    const url = panel.target.buildUrl();
    window.open(url, "_blank", "noopener,noreferrer");
    setPanel({ ...panel, confirmed: true });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-8 transition-colors">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Deep Analysis Through Best AI Models
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
          Pick a question type, then choose an AI to research{" "}
          <strong className="text-gray-700 dark:text-gray-300">
            {data.company.name}
          </strong>{" "}
          with live web search.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {prompts.map((item) => {
            const Icon = item.icon;
            const isOpen = openKey === item.key;

            return (
              <div
                key={item.key}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span className="flex-1 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                  <ExternalLink
                    size={16}
                    className="text-gray-400 dark:text-gray-500 shrink-0"
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-primary/40 px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-around sm:justify-start gap-3 sm:gap-6">
                    {AI_TARGETS.map((target) => (
                      <button
                        key={target.key}
                        onClick={() => handleAiClick(item, target)}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 group"
                        title={`Copy prompt & open ${target.label}`}
                      >
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${target.bg} border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 group-hover:shadow-md transition`}
                        >
                          <img
                            src={target.iconImg}
                            alt={target.label}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                          {target.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared bottom panel */}
      {panel && (
        <div
          ref={panelRef}
          className="bg-white dark:bg-secondary border border-blue-300 dark:border-blue-700 rounded-xl p-4 sm:p-6 transition-colors"
        >
          {!panel.confirmed ? (
            <>
              <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 mb-4">
                Please copy this prompt before searching on {panel.target.label}{" "}
                for <strong>{panel.category.label}</strong>. Once copied, press
                OK below, then paste (Ctrl+V) into the chat box and press Enter.
              </p>
              <button
                onClick={handlePanelOk}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base"
              >
                OK, I've copied it — open {panel.target.label}
              </button>
            </>
          ) : (
            <p className="text-sm sm:text-base font-medium text-green-600 dark:text-green-400 mb-4">
              ✅ Success! Now paste the prompt into {panel.target.label} and
              press Enter to get your {panel.category.label} research.
            </p>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Prompt
              </span>
              <button
                onClick={handlePanelCopy}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                {copiedKey === "panel" ? (
                  <>
                    <Check size={14} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy prompt
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-primary/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-60 overflow-y-auto">
              {panel.category.prompt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIView;
