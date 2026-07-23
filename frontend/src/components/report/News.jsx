// src/components/report/News.jsx

import { ExternalLink, Calendar } from "lucide-react";

function News({ data }) {
  if (!data || !data.news || data.news.length === 0) {
    return (
      <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400">
        No news available
      </div>
    );
  }

  const news = data.news;

  return (
    <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6 transition-colors">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">📰 Latest News</h2>

      <div className="space-y-3 sm:space-y-4">
        {news.map((article, index) => (
          <article
            key={index}
            className="p-3 sm:p-4 bg-gray-50 dark:bg-primary border border-gray-200 dark:border-gray-700 rounded hover:border-blue-500 transition group"
          >
            {/* News Title */}
            <h3 className="text-sm sm:text-base text-gray-900 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1.5 sm:mb-2 leading-snug">
              {article.title}
            </h3>

            {/* Description */}
            {article.description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 text-justify leading-relaxed">
                {article.description}
              </p>
            )}

            {/* Date and Source */}
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 gap-2">
              <div className="flex items-center gap-1 shrink-0">
                <Calendar size={12} />
                {new Date(article.pubDate).toLocaleDateString()}
              </div>

              {/* Read More Link */}
              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition shrink-0"
                >
                  Read
                  <ExternalLink size={12} />

                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default News;