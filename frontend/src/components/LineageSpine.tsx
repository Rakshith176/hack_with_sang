import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { FileText, ExternalLink, Search, CheckCircle2, ChevronRight, GitCommit, ArrowDown } from 'lucide-react';
import { drillDeeper } from '../api/client';

interface LineageSpineProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedThread: string;
  onInterrogateNode: (node: GraphNode) => void;
  onNodesUpdated: (newNode: GraphNode, newEdge: GraphEdge) => void;
}

export const LineageSpine: React.FC<LineageSpineProps> = ({
  nodes,
  edges,
  selectedThread,
  onInterrogateNode,
  onNodesUpdated,
}) => {
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [drillingNodeId, setDrillingNodeId] = useState<string | null>(null);

  // Lineage + Focus nodes sorted chronologically (earliest preceding -> focus event)
  const lineageNodes = nodes
    .filter((n) => n.plane === 'lineage' || n.plane === 'focus')
    .filter((n) => (selectedThread === 'all' ? true : n.thread === selectedThread || n.plane === 'focus'))
    .sort((a, b) => a.depth_index - b.depth_index);

  const handleDrillDeeper = async (node: GraphNode) => {
    setDrillingNodeId(node.id);
    try {
      const res = await drillDeeper(node.id, `precursor filing to ${node.title}`, `${node.year}-01-01`);
      onNodesUpdated(res.discovered_node, res.discovered_edge);
    } catch (err) {
      console.error('Failed to drill deeper', err);
    } finally {
      setDrillingNodeId(null);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Retrospective Context Banner */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-gray-900 border border-blue-900/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 mt-0.5">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Connecting News Lineage ("How Did We Get Here?")</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              News feeds present breaking headlines as isolated events. PlaceWire reconstructs the chain of 
              <strong> connecting news stories, prior filings, and regulatory touchpoints</strong> that directly triggered the current event.
            </p>
          </div>
        </div>
      </div>

      {/* Preceding Story Chain */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-rose-500">
        {lineageNodes.map((node) => {
          const isFocus = node.plane === 'focus';
          const isExpanded = expandedQuoteId === node.id;
          const isDrilling = drillingNodeId === node.id;
          const outgoingEdge = edges.find((e) => e.source === node.id);

          return (
            <div
              key={node.id}
              className={`relative rounded-xl p-4 transition-all border ${
                isFocus
                  ? 'bg-red-950/20 border-red-800/80 shadow-lg shadow-red-950/30'
                  : 'bg-gray-900/90 border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Timeline Pip */}
              <div
                className={`absolute -left-[29px] top-5 w-4 h-4 rounded-full border-2 ${
                  isFocus
                    ? 'bg-red-500 border-red-200 animate-ping'
                    : node.category === 'regulatory'
                    ? 'bg-purple-500 border-purple-200'
                    : 'bg-blue-500 border-blue-200'
                }`}
              />

              {/* Node Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-800 text-blue-300 border border-gray-700">
                    {node.timestamp}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      isFocus
                        ? 'bg-red-900/40 text-red-300 border border-red-800/50'
                        : node.thread === 'regulatory'
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-800/50'
                        : 'bg-blue-900/40 text-blue-300 border border-blue-800/50'
                    }`}
                  >
                    {isFocus ? 'Breaking Headline' : node.thread === 'regulatory' ? 'Regulatory Stream' : 'Engineering / Technical'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {node.source.is_primary && (
                    <span className="text-[10px] flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Primary Record
                    </span>
                  )}
                  <button
                    onClick={() => onInterrogateNode(node)}
                    className="text-xs font-medium px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Challenge <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Title & Summary */}
              <h4 className="text-sm font-bold text-gray-100">{node.title}</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{node.summary}</p>

              {/* Causal Link Indicator */}
              {outgoingEdge && (
                <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400 font-mono bg-gray-950/60 px-2.5 py-1 rounded border border-gray-800/80">
                  <span className="text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <ArrowDown className="w-3 h-3" /> {outgoingEdge.relationship.replace('_', ' ')}:
                  </span>
                  <span className="truncate">{outgoingEdge.evidence_quote}</span>
                </div>
              )}

              {/* Action Strip */}
              <div className="mt-3 pt-2.5 border-t border-gray-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setExpandedQuoteId(isExpanded ? null : node.id)}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {isExpanded ? 'Hide Citation Snippet' : 'Inspect Verbatim Citation'}
                </button>

                <div className="flex items-center gap-3">
                  {node.depth_index <= -3 && (
                    <button
                      onClick={() => handleDrillDeeper(node)}
                      disabled={isDrilling}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                    >
                      <Search className="w-3 h-3" />
                      {isDrilling ? 'Searching SerpApi...' : 'Drill Prior Touchpoint'}
                    </button>
                  )}

                  <a
                    href={node.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-gray-200 flex items-center gap-1 text-[11px]"
                  >
                    <span>{node.source.outlet_or_issuer}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Verbatim Citation Drawer */}
              {isExpanded && (
                <div className="mt-2.5 p-3 rounded-lg evidence-block text-xs text-gray-200 leading-relaxed border-blue-500/80 animate-in fade-in duration-150">
                  <div className="text-[10px] font-mono uppercase text-blue-400 font-semibold mb-1">
                    [Evidence Snippet via SerpApi Extract API]
                  </div>
                  "{node.source.evidence_quote}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
