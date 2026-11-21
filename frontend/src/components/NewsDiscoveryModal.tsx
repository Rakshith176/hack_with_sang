import React, { useEffect, useState } from 'react';
import { TrendingNewsItem, fetchTrendingNews } from '../api/client';
import { Newspaper, Search, ExternalLink, X, Sparkles, Loader2, Clock } from 'lucide-react';

interface NewsDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: TrendingNewsItem) => void;
  analyzing: boolean;
}

export const NewsDiscoveryModal: React.FC<NewsDiscoveryModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  analyzing,
}) => {
  const [topic, setTopic] = useState('technology OR business');
  const [customQuery, setCustomQuery] = useState('');
  const [articles, setArticles] = useState<TrendingNewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadNews(topic);
  }, [isOpen, topic]);

  const loadNews = async (queryStr: string) => {
    setLoading(true);
    try {
      const items = await fetchTrendingNews(queryStr);
      setArticles(items);
    } catch (err) {
      console.error('Error fetching trending news', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      loadNews(customQuery.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0F141F] border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live News Feed & Lineage Generator</h3>
              <p className="text-[11px] text-gray-400 font-mono">
                Powered directly by SerpApi Google News (`engine=google_news`)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Topic Selector Bar */}
        <div className="p-4 bg-gray-900/60 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTopic('technology'); loadNews('technology'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                topic === 'technology' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              Technology
            </button>
            <button
              onClick={() => { setTopic('business OR economy'); loadNews('business OR economy'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                topic === 'business OR economy' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              Business & Markets
            </button>
            <button
              onClick={() => { setTopic('aviation OR aerospace'); loadNews('aviation OR aerospace'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                topic === 'aviation OR aerospace' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              Aviation & Transport
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search any live news topic..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="bg-gray-950 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-56"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {analyzing && (
            <div className="p-6 rounded-xl bg-blue-950/40 border border-blue-800 text-center space-y-3 mb-4">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-white">
                Autonomous Epistemic Agent Generating Connecting Lineage...
              </p>
              <p className="text-[11px] text-gray-300 font-mono">
                Tracing preceding news milestones, identifying claim mutations, and mapping downstream exposure.
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-7 h-7 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-400">Querying SerpApi Google News Engine...</p>
            </div>
          ) : (
            articles.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-600/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 mb-1">
                    <span className="font-bold text-blue-400">{item.source_name}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">{item.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{item.snippet}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    title="View Original Article"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onSelectArticle(item)}
                    disabled={analyzing}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Trace Lineage
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
