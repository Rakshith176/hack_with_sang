import React, { useState } from 'react';
import { InterrogationVerdict } from '../types';
import { interrogateClaim } from '../api/client';
import { Sparkles, AlertCircle, CheckCircle2, HelpCircle, ExternalLink, X, Loader2 } from 'lucide-react';

interface InterrogateModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
  claimText: string;
}

export const InterrogateModal: React.FC<InterrogateModalProps> = ({ isOpen, onClose, claimId, claimText }) => {
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<InterrogationVerdict | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interrogateClaim(claimId, claimText);
      setVerdict(res);
    } catch (err: any) {
      setError(err.message || 'Audit request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0F141F] border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Adversarial Interrogation Agent</h3>
              <p className="text-[11px] text-gray-400 font-mono">You.com Live Cited Index &bull; Gemini 2.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Claim Box */}
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">
              Target Statement Under Audit:
            </span>
            <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-100 italic">
              "{claimText}"
            </div>
          </div>

          {/* Trigger Audit Button */}
          {!verdict && !loading && (
            <div className="text-center py-6">
              <p className="text-xs text-gray-400 mb-4 max-w-md mx-auto">
                Click below to dispatch an autonomous adversarial agent that queries <strong>You.com's live web index</strong> for retractions, official statements, and counter-evidence.
              </p>
              <button
                onClick={handleRunAudit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Dispatch Live Adversarial Audit
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-10 space-y-3">
              <Loader2 className="w-7 h-7 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-300">
                1. Querying You.com Live Cited Index (`POST https://ydc-index.io/v1/search`)...
              </p>
              <p className="text-[11px] font-mono text-gray-500">
                2. Synthesizing counter-evidence with Gemini 2.5 Flash...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Interrogation Verdict Display */}
          {verdict && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Verdict Classification Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  verdict.verdict === 'rebuttal_found'
                    ? 'bg-rose-950/20 border-rose-800/60 text-rose-300'
                    : verdict.verdict === 'uncontested'
                    ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                    : 'bg-amber-950/20 border-amber-800/60 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {verdict.verdict === 'rebuttal_found' ? (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <span className="text-xs uppercase font-mono font-bold block">
                      Verdict: {verdict.verdict.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      Timestamp: {verdict.as_of_timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini Epistemic Synthesis */}
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block mb-1">
                  Gemini 2.5 Flash Epistemic Synthesis:
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">{verdict.summary}</p>
              </div>

              {/* Live Web Citations from You.com */}
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block mb-2">
                  Live Citations Retrieved from You.com Index:
                </span>
                <div className="space-y-2">
                  {verdict.citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-gray-950/80 border border-gray-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-200">{c.title}</span>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-gray-400 text-[11px] italic">"{c.snippet}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
