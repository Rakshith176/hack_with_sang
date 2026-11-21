from typing import List, Optional, Literal
from pydantic import BaseModel

class SourceEvidence(BaseModel):
    outlet_or_issuer: str
    url: str
    is_primary: bool  # True for government filing, SEC, engineering RFC, official PR
    evidence_quote: str  # Verbatim sentence supporting this node
    published_date: str

class GraphNode(BaseModel):
    id: str
    plane: Literal["lineage", "focus", "ripple"]
    category: Literal[
        "primary_doc", "regulatory", "technical", "financial",
        "dependency", "market", "geographic", "gap_marker"
    ]
    thread: Optional[str] = "main"  # e.g., "technical", "regulatory", "financial"
    depth_index: int  # Negative for lineage (e.g. -6, -4, -1), 0 for focus, positive for ripple (+1, +2)
    year: int
    title: str
    timestamp: str
    summary: str
    source: SourceEvidence
    status: Literal["confirmed", "inferred", "disputed", "unresolved"] = "confirmed"

class GraphEdge(BaseModel):
    id: str
    source: str  # Source node ID
    target: str  # Target node ID
    relationship: Literal[
        "triggered", "amended", "complied_with", "escalated", 
        "contradicts", "cascaded_to", "likely_affects", "gap_preceded"
    ]
    is_solid: bool  # True = confirmed by source; False = inferred candidate
    evidence_quote: Optional[str] = None
    confidence_score: float = 1.0
    connective_tissue: Optional[str] = None  # Why this event connects to the next
    relevancy_label: Optional[str] = "Direct Causal Antecedent"  # e.g., "Direct Legal Precursor"
    relevancy_percent: Optional[int] = 95  # Percentage score (e.g., 95%)

class ClaimDetail(BaseModel):
    source_name: Optional[str] = None
    outlet_name: Optional[str] = None
    source_type: Optional[str] = None
    raw_text: str
    hedges: List[str] = []
    metric_value: Optional[str] = None

    def get_source_label(self) -> str:
        return self.source_name or self.outlet_name or "Unknown Source"

class ClaimDriftRecord(BaseModel):
    claim_id: str
    subject: str
    original_claim: ClaimDetail
    viral_claim: ClaimDetail
    mutation_type: Literal["hedging_lost", "metric_inflated", "scope_expanded", "attribution_dropped"]
    drift_explanation: str
    telephone_factor: float = 0.85  # Quantitative drift metric (0.0 to 1.0)

class StoryGraph(BaseModel):
    story_id: str
    focus_headline: str
    summary: str
    epistemic_score: float  # 0.0 - 1.0 (ratio of primary evidence, independence)
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    drift_records: List[ClaimDriftRecord]

class InterrogationRequest(BaseModel):
    claim_id: str
    claim_text: str
    context: Optional[str] = None

class CitationHit(BaseModel):
    title: str
    url: str
    snippet: str

class InterrogationVerdict(BaseModel):
    target_claim_id: str
    query_run: str
    verdict: Literal["rebuttal_found", "uncontested", "active_dispute", "insufficient_data"]
    summary: str
    citations: List[CitationHit]
    as_of_timestamp: str

class DrillDeeperRequest(BaseModel):
    node_id: str
    query: str
    date_before: Optional[str] = None
