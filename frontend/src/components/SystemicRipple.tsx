import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { Network, Server, Plane, TrendingUp, Building2, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

interface SystemicRippleProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onInterrogateNode: (node: GraphNode) => void;
}

export const SystemicRipple: React.FC<SystemicRippleProps> = ({ nodes, edges, onInterrogateNode }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'dependency' | 'geographic' | 'market' | 'regulatory'>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Focus node + Ripple nodes
  const rippleNodes = nodes.filter((n) => n.plane === 'ripple');
  const filteredNodes = rippleNodes.filter((n) => (selectedFilter === 'all' ? true : n.category === selectedFilter));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dependency':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'geographic':
        return <Plane className="w-5 h-5 text-emerald-400" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'regulatory':
        return <Building2 className="w-5 h-5 text-purple-400" />;
      default:
        return <Network className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Overview Header */}
      <div className="mb-6 p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 mt-0.5">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Systemic Second-Order Ripple Graph</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Instead of an arbitrary pin on a map, PlaceWire maps downstream casualties across 
              <strong> Operational Dependencies (+1)</strong>, <strong>Geographic Ground-stops (+1)</strong>, and 
              <strong> Market/Regulatory Dominoes (+2)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          All Downstream Casualties ({rippleNodes.length})
        </button>
        <button
          onClick={() => setSelectedFilter('dependency')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedFilter === 'dependency' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Direct Tech Dependencies (+1)
        </button>
        <button
          onClick={() => setSelectedFilter('geographic')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedFilter === 'geographic' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Physical Airport Hubs (+1)
        </button>
        <button
          onClick={() => setSelectedFilter('market')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedFilter === 'market' ? 'bg-amber-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Market Valuations (+2)
        </button>
        <button
          onClick={() => setSelectedFilter('regulatory')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedFilter === 'regulatory' ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Congressional Inquiries (+2)
        </button>
      </div>

      {/* Ripple Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map((node) => {
          const incomingEdge = edges.find((e) => e.target === node.id);

          return (
            <div
              key={node.id}
              className="rounded-xl border border-gray-800 bg-gray-900/90 p-5 hover:border-gray-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category & Hop Degree */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(node.category)}
                    <span className="text-xs font-mono uppercase font-bold text-gray-300">
                      {node.category} &bull; Depth +{node.depth_index}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{node.timestamp}</span>
                </div>

                {/* Title & Summary */}
                <h4 className="text-sm font-bold text-white mb-2">{node.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">{node.summary}</p>

                {/* Direct Causal Relationship Link */}
                {incomingEdge && (
                  <div className="p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-[11px] font-mono text-gray-300 mb-4">
                    <span className="text-indigo-400 font-bold uppercase">&bull; Causal Link: </span>
                    <span>{incomingEdge.evidence_quote}</span>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <a
                  href={node.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-gray-200 flex items-center gap-1 text-[11px]"
                >
                  <span>{node.source.outlet_or_issuer}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onInterrogateNode(node)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Audit Exposure <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
