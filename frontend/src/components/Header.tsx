import React from 'react';
import { ShieldCheck, GitFork, AlertTriangle, Radio, Sparkles, Newspaper, ChevronDown } from 'lucide-react';
import { StoryCatalogItem } from '../api/client';

interface HeaderProps {
  headline: string;
  epistemicScore: number;
  activeTab: 'lineage' | 'drift' | 'ripple';
  setActiveTab: (tab: 'lineage' | 'drift' | 'ripple') => void;
  selectedThread: string;
  setSelectedThread: (thread: string) => void;
  catalog: StoryCatalogItem[];
  selectedStoryId: string;
  onSelectStory: (id: string) => void;
  onOpenDiscovery: () => void;
  onChallengeFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  headline,
  epistemicScore,
  activeTab,
  setActiveTab,
  selectedThread,
  setSelectedThread,
  catalog,
  selectedStoryId,
  onSelectStory,
  onOpenDiscovery,
  onChallengeFocus,
}) => {
  return (
    <header className="border-b border-gray-800 bg-[#0B0F17]/95 backdrop-blur sticky top-0 z-40 px-6 py-3">
      {/* Top Bar: Brand, Stories Switcher, Score & Interrogation Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                PlaceWire
              </span>
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50">
                VeritasMesh
              </span>
            </div>
            <p className="text-xs text-gray-400">Connecting News Lineage & Claim Drift Engine</p>
          </div>
        </div>

        {/* Center: Story Preset Switcher & Live News Discovery Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-300">
            <span className="text-gray-400">Story:</span>
            <select
              value={selectedStoryId}
              onChange={(e) => onSelectStory(e.target.value)}
              className="bg-transparent font-semibold text-blue-400 outline-none cursor-pointer max-w-[200px] truncate"
            >
              {catalog.map((item) => (
                <option key={item.id} value={item.id} className="bg-gray-900 text-white">
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenDiscovery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Newspaper className="w-3.5 h-3.5" />
            Discover Live News (SerpApi)
          </button>
        </div>

        {/* Epistemic Gauge & Interrogation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-300">Epistemic Index:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {Math.round(epistemicScore * 100)}%
            </span>
          </div>

          <button
            onClick={onChallengeFocus}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold shadow-lg shadow-red-900/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Challenge Headline (You.com)
          </button>
        </div>
      </div>

      {/* Focus Headline Banner */}
      <div className="mt-3 px-3 py-2 rounded-lg bg-gray-900/80 border border-gray-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs truncate">
          <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60 text-red-400 font-semibold uppercase tracking-wider text-[10px]">
            Target Headline Under Investigation
          </span>
          <span className="text-gray-200 font-medium truncate italic">
            "{headline}"
          </span>
        </div>
        <span className="text-[11px] text-gray-400 font-mono hidden md:inline">
          SerpApi News &bull; You.com Search &bull; Gemini 2.5 Flash
        </span>
      </div>

      {/* Navigation Tabs & Thread Filter */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800/60 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('lineage')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'lineage'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            1. Connecting Lineage (What Led to This)
          </button>
          <button
            onClick={() => setActiveTab('drift')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'drift'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            2. Claim Drift (Telephone Game)
          </button>
          <button
            onClick={() => setActiveTab('ripple')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'ripple'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            3. Systemic Ripple (Exposure DAG)
          </button>
        </div>

        {activeTab === 'lineage' && (
          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 text-[11px]">Branch:</span>
            <select
              value={selectedThread}
              onChange={(e) => setSelectedThread(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1 outline-none focus:border-blue-500"
            >
              <option value="all">All Converging Streams</option>
              <option value="technical">Technical / Engineering</option>
              <option value="regulatory">Regulatory / Compliance</option>
            </select>
          </div>
        )}
      </div>
    </header>
  );
};
