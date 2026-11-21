export interface SourceEvidence {
  outlet_or_issuer: string;
  url: string;
  is_primary: boolean;
  evidence_quote: string;
  published_date: string;
}

export interface GraphNode {
  id: string;
  plane: "lineage" | "focus" | "ripple";
  category: "primary_doc" | "regulatory" | "technical" | "financial" | "dependency" | "market" | "geographic" | "gap_marker";
  thread?: string;
  depth_index: number;
  year: number;
  title: string;
  timestamp: string;
  summary: string;
  source: SourceEvidence;
  status: "confirmed" | "inferred" | "disputed" | "unresolved";
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: "triggered" | "amended" | "complied_with" | "escalated" | "contradicts" | "cascaded_to" | "likely_affects" | "gap_preceded";
  is_solid: boolean;
  evidence_quote?: string;
  confidence_score: number;
  connective_tissue?: string;
  relevancy_label?: string;
  relevancy_percent?: number;
}

export interface ClaimDetail {
  source_name?: string;
  outlet_name?: string;
  source_type?: string;
  raw_text: string;
  hedges: string[];
  metric_value?: string;
}

export interface ClaimDriftRecord {
  claim_id: string;
  subject: string;
  original_claim: ClaimDetail;
  viral_claim: ClaimDetail;
  mutation_type: "hedging_lost" | "metric_inflated" | "scope_expanded" | "attribution_dropped";
  drift_explanation: string;
  telephone_factor: number;
}

export interface StoryGraph {
  story_id: string;
  focus_headline: string;
  summary: string;
  epistemic_score: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  drift_records: ClaimDriftRecord[];
}

export interface CitationHit {
  title: string;
  url: string;
  snippet: string;
}

export interface InterrogationVerdict {
  target_claim_id: string;
  query_run: string;
  verdict: "rebuttal_found" | "uncontested" | "active_dispute" | "insufficient_data";
  summary: string;
  citations: CitationHit[];
  as_of_timestamp: string;
}
