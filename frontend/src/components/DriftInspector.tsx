import React from 'react';
import { ClaimDriftRecord } from '../types';
import { AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, Split, FileWarning } from 'lucide-react';

interface DriftInspectorProps {
  records: ClaimDriftRecord[];
  onChallengeClaim: (claimText: string) => void;
}

export const DriftInspector: React.FC<DriftInspectorProps> = ({ records, onChallengeClaim }) => {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Intro Header */}
      <div className="mb-6 p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 mt-0.5">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">The "Telephone Game" Semantic Mutation Auditor</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              News distortion rarely starts with outright lies. Outlets systematically strip <strong>hedges</strong>,
              inflate <strong>metrics</strong>, and replace internal technical errors with sensational foreign threats.
            </p>
          </div>
        </div>
      </div>

      {/* Drift Comparison Cards */}
      <div className="space-y-6">
        {records.map((rec) => (
          <div
            key={rec.claim_id}
            className="rounded-xl border border-gray-800 bg-gray-900/90 overflow-hidden shadow-lg"
          >
            {/* Mutation Classification Bar */}
            <div className="px-4 py-2.5 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-gray-200">{rec.subject}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800/50">
                  {rec.mutation_type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span>Telephone Drift:</span>
                <span className="font-bold text-amber-400">{Math.round(rec.telephone_factor * 100)}%</span>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
              {/* Origin Claim (Primary Document) */}
              <div className="p-4 bg-emerald-950/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Node 0 Origin: {rec.original_claim.source_name}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">PRIMARY RECORD</span>
                </div>
                <blockquote className="text-xs text-gray-200 italic leading-relaxed pl-3 border-l-2 border-emerald-500">
                  "{rec.original_claim.raw_text}"
                </blockquote>

                {rec.original_claim.hedges.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
                      Original Hedges & Technical Qualifiers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.original_claim.hedges.map((h, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
                        >
                          + {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Viral Mutated Claim */}
              <div className="p-4 bg-rose-950/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <FileWarning className="w-4 h-4" /> Downstream Viral Headline
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">{rec.viral_claim.outlet_name}</span>
                </div>
                <blockquote className="text-xs text-gray-200 italic leading-relaxed pl-3 border-l-2 border-rose-500">
                  "{rec.viral_claim.raw_text}"
                </blockquote>

                <div className="mt-3">
                  <span className="text-[10px] uppercase font-mono text-rose-400 block mb-1">
                    Stripped Hedges / Sensationalized Shift:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] font-mono line-through px-2 py-0.5 rounded bg-rose-900/40 text-rose-300 border border-rose-700/50">
                      &times; Hedges Discarded
                    </span>
                    {rec.viral_claim.metric_value && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50">
                        Metric Escalated: {rec.viral_claim.metric_value}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Audit Summary */}
            <div className="p-3 bg-gray-950/70 border-t border-gray-800 flex items-center justify-between gap-3 text-xs">
              <p className="text-gray-300 text-xs leading-relaxed">
                <strong className="text-amber-400 font-mono">Cognitive Audit: </strong>
                {rec.drift_explanation}
              </p>
              <button
                onClick={() => onChallengeClaim(rec.viral_claim.raw_text)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium transition-colors cursor-pointer"
              >
                Challenge Mutated Claim
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
