# PlaceWire: Systemic Epistemic Knowledge Graph
### Final Product Requirements Document (Buildathon Edition)

**Project Name:** PlaceWire (Codename: *VeritasMesh*)  
**Tracks Targeted:** Track 1 (Best Use of SerpApi) & Track 2 (You.com: Live Cited Web Data)  
**Target Delivery:** 24-Hour Hackathon Functional Prototype + Polished Demo  

---

## 1. Executive Summary

PlaceWire transforms breaking news and viral claims from a noisy, unanchored firehose into an **investigative epistemic knowledge graph**. 

Traditional news readers and AI search engines answer: *"What happened?"*  
**PlaceWire answers the three questions that actually matter:**
1. **Lineage (The Past):** *"How did we get here, and what was the actual legal, technical, or civic origin?"*
2. **Drift (The Mutation):** *"How did the headline play the 'Telephone Game'—dropping hedge words or exaggerating metrics compared to the primary record?"*
3. **Systemic Ripple (The Future & Exposure):** *"If this claim is real, who and what is actually exposed across operational dependencies, regulatory dominoes, and physical infrastructure?"*

### One-Line Pitch
> *"Every headline arrives with its historical lineage, an honest audit of how claims mutated along the way, and a second-order systemic ripple graph of who is actually exposed."*

---

## 2. Core Epistemic Principles

1. **Honest Labels Over Binary Truth:** Never say *"Verified"* or *"True"*. Label states transparently: `Primary Document Confirmed`, `Single-Source Wire Echo`, `Contested`, or `Unsubstantiated Inference`.
2. **Evidence Beside Every Edge:** No link or causal connection exists without a verbatim citation sentence and source timestamp.
3. **Solid vs. Dashed Distinction:**
   - **Solid Edges:** Facts directly stated in official filings or primary coverage.
   - **Dashed Edges:** Second-order inferences or candidate entities in the ripple zone.
4. **Honesty About Information Gaps:** Explicitly render gap markers: *"Coverage Gap (March–June): No public filings or news coverage found."*
5. **Separation of Geography from Consequence:** Geography is treated as one possible consequence dimension (facilities, ports, corridors), not an artificial cage that limits stories to local civic news.

---

## 3. Product Architecture: The "Two-Gear" Model

To guarantee both **100% demo stability on stage** and **undeniable live agentic intelligence**, PlaceWire runs on a dual-gear architecture:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ GEAR 1: Staged Knowledge Graph Pipeline (Pre-indexed Flagship Dataset)          │
│ • Runs during preparation / ingestion                                           │
│ • SerpApi (News, Search, Extract) pulls backward timeline & primary PDFs        │
│ • You.com & LLM extracts structured claim tuples & computes semantic drift diffs│
│ • Caches full graph to JSON/SQLite for instant (0.1s) canvas rendering          │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ Interactive Visual Canvas             │
                     │ (Lineage Spine + Drift Diff + Ripple) │
                     └───────────────────┬───────────────────┘
                                         │
┌────────────────────────────────────────┴────────────────────────────────────────┐
│ GEAR 2: Live "Interrogation" Agent (Live in Front of Judges)                     │
│ • User clicks [Challenge Claim] or [Audit Gap] on any graph node                │
│ • Agent executes a real-time, targeted adversarial tool call:                   │
│   → you_com_live_search(query="evidence contradicting [claim]", cited=True)    │
│ • Returns live cited rebuttal/confirmation in under 4 seconds                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Functional Pillars

### Pillar 1: The Lineage Spine ("How Did We Get Here?")
* **Backward Temporal Reconstruction:** Traces the paper trail 3–6 steps backward from the viral headline.
* **Autonomous Lead Detection:** When news mentions secondary clues (*"following memo 402"*, *"under the 2023 clean water directive"*), the ingestion agent drills down into SerpApi Search/Extract to find the primary document.
* **Gap Markers:** Highlights suspicious silences or missing public disclosures between milestones.

### Pillar 2: The Claim Drift Strip ("The Telephone Game")
* **Side-by-Side Semantic Diff:** Displays the original primary filing on the left and downstream viral headlines on the right.
* **Mutation Classifications:**
  - `Hedging Lost`: *"Evaluating feasibility of 15% reduction"* $\rightarrow$ *"City defunds department"*.
  - `Metric Inflation`: Local phase budget (\$40M) reported as total regional program cost (\$450M).
  - `Attribution Erasure`: Anonymous industry rumor reported as an official confirmation.
* **Quantitative Drift Index:** Computes a score based on removed hedges, metric deviation, and source degrees of separation.

### Pillar 3: The Systemic Ripple Graph (Second-Order Consequences)
Rather than a basic geographic pin, PlaceWire models downstream impact across three explicit exposure dimensions:
1. **Operational / Tech Dependencies:** Upstream vendors, downstream software packages, supply-chain bottlenecks.
2. **Regulatory & Market Dominoes:** Compliance triggers, competitor gains/losses, legal liability risks.
3. **Physical & Geographic Footprint (When Applicable):** Affected ports, facilities, transit lines, or municipal boundaries.

### Pillar 4: Live Interrogation Panel (Agentic Verification)
* Every node and claim features interactive action buttons:
  - **`[Challenge Claim]`:** Runs an adversarial search via You.com for retractions, official statements, or contradictory filings.
  - **`[Audit Primary]`:** Direct link and preview of the extracted raw paragraph from the original PDF/filing via SerpApi Extract API.
  - **`[Trace Provenance]`:** Visualizes how many outlets merely copied a single Reuters or AP wire versus reporting independently.

---

## 5. Track Integration & API Contracts

### Track 1: SerpApi (The Historical & Documentary Foundation)
* **`SerpApi Google News & Search API`:** Used with temporal filters (`tbs=cdr:1,cd_min:...,cd_max:...`) to build the chronological lineage spine backward in time.
* **`SerpApi Extract API`:** Scrapes and parses the text of non-paywalled primary PDFs, municipal meeting agendas, regulatory notices, and SEC filings.
* **`SerpApi Google Maps API` (Optional Lens):** Resolves geographic coordinates and nearby infrastructure entities when a physical location node is selected.

### Track 2: You.com (Live Cited Epistemics & Contradiction)
* **Live Cited Web Search:** Powers the real-time **Interrogation Agent**. When a user challenges a claim, You.com's live web index searches for real-time updates and counter-claims.
* **Structured Claim Extraction:** Feeds raw text into You.com / LLM to extract normalized tuples: `(Subject, Action, Metric, Conditionality/Hedge)`.
* **Adversarial Synthesis:** Produces cited summaries explaining specifically *why* a claim is contested or unproven.

---

## 6. TypeScript Data Models

```typescript
// 1. Lineage & Ripple Node Schema
export interface GraphNode {
  id: string;
  plane: "lineage" | "focus" | "ripple";
  category: "primary_doc" | "regulatory" | "dependency" | "market" | "geographic";
  title: string;
  timestamp: string; // ISO format or relative
  summary: string;
  source: {
    outlet_or_issuer: string;
    url: string;
    is_primary: boolean;
    evidence_quote: string; // Verbatim snippet supporting the node
  };
  link_to_parent?: {
    parent_id: string;
    relationship_type: "triggered" | "responded_to" | "contradicts" | "likely_affects";
    is_solid: boolean; // true = explicitly stated; false = inferred candidate
    confidence_score: number; // 0.0 - 1.0
  };
}

// 2. Claim Drift Schema (The Telephone Game)
export interface ClaimDriftRecord {
  claim_id: string;
  subject: string;
  original_claim: {
    source_name: string;
    source_type: "official_filing" | "press_release" | "primary_interview";
    raw_text: string;
    hedges_present: string[]; // e.g. ["preliminary", "subject to vote"]
    metric_value?: string;
  };
  viral_claim: {
    outlet_name: string;
    raw_text: string;
    hedges_dropped: string[]; // e.g. ["preliminary"]
    metric_mutated?: string;
  };
  mutation_type: "hedging_lost" | "metric_inflated" | "scope_expanded" | "attribution_dropped";
  drift_explanation: string;
}

// 3. Live Interrogation Agent Verdict
export interface InterrogationVerdict {
  target_claim_id: string;
  query_run: string;
  verdict: "rebuttal_found" | "uncontested" | "active_dispute" | "insufficient_data";
  summary: string;
  citations: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  as_of_timestamp: string;
}
```

---

## 7. The Flagship Demo Scenario

To guarantee a memorable pitch, the prototype features a high-stakes, multi-faceted story with rich lineage, demonstrable drift, and clear systemic ripples:

### Scenario: The Critical Cloud Infrastructure & Supply-Chain Shock
* **Viral Headline (Node 0):**  
  *"Catastrophic Global Cloud Outage Paralyzes Healthcare and Financial Sectors Indefinitely."*

* **The Lineage Spine (Uncovered via SerpApi):**
  - **Node -3 (6 Months Ago):** Vendor pushes architectural RFC proposing kernel-level driver bypass for telemetry.
  - **Node -2 (3 Weeks Ago):** Regulatory patch compliance mandate issued by cybersecurity standard board.
  - **Node -1 (4 Hours Prior):** Logic error in dynamic configuration file deployment (Channel File 291).
  - **Node 0 (Today):** Global media frenzy reporting "Unprecedented Cyberattack on Western Infrastructure."

* **The Claim Drift (Audited via You.com / SerpApi Extract):**
  - **Primary Incident Report:** *"A logic flaw in dynamic channel file 291 caused memory read out-of-bounds on Windows systems running Sensor v7.11."*
  - **Viral News Evolution:** Dropped all mention of configuration files; transformed an internal pointer error into *"Coordinated State-Sponsored Cyber Assault"*.

* **The Systemic Ripple Graph:**
  - **Operational Dependencies:** 8.5M client machines running Kernel v7.11 $\rightarrow$ Automated airline crew-scheduling platforms $\rightarrow$ Electronic health record sync services.
  - **Market & Regulatory Dominoes:** Stock volatility across cybersecurity sector competitors; class-action filings initiated under SLA breaches.
  - **Physical Footprint (Geographic Lens):** Grounded flights at 14 major international airport hubs; emergency 911 dispatch centers switched to manual radios.

---

## 8. Hackathon 24-Hour Implementation Scope

### Must Build (Demo Deliverable)
1. **Interactive Split-Screen UI (Vite + React + Tailwind + React Flow):**
   - **Left:** The Lineage Spine (chronological cards, primary badge indicator, evidence drawer).
   - **Center:** The Drift Inspector (side-by-side text comparator with color-coded diff highlights).
   - **Right:** The Systemic Ripple Canvas (interactive node-link graph with dependency, market, and geographic filters).
2. **Backend API (Node.js/Express or Python/FastAPI):**
   - Pre-computed flagship story endpoint serving the verified graph payload.
   - Interactive `/api/interrogate` endpoint executing a live **You.com** adversarial search query with citation returns.
3. **Interactive "Challenge Claim" Modal:**
   - Lets judges click any claim live and watch the agent fetch and display live cited counter-evidence.

### Deliberately Out of Scope
* ❌ User authentication and profile settings.
* ❌ Open-ended arbitrary URL crawling (which risks slow response times or rate limits during the presentation).
* ❌ Generic public comment threads.

---

## 9. 2.5-Minute Pitch Script for Judges

* **0:00 - 0:35 | The Hook & Status Quo:**  
  *"Judges, every day we make crucial decisions based on breaking headlines. But today's news feeds lie in three distinct ways: they erase history, they play the 'Telephone Game' by sensationalizing claims, and they fail to show second-order consequences. This is PlaceWire."*
* **0:35 - 1:15 | The Lineage Spine (SerpApi):**  
  *"We take this headline claiming a massive cyber crisis. Instead of just summarizing it, our agent used SerpApi to trace the paper trail backward. Look at Node -2: this wasn't a sudden attack; it traces back to an unvalidated configuration file deployed four hours earlier following a compliance update."*
* **1:15 - 1:45 | The Drift Inspector:**  
  *"Now look at our Claim Drift view. On the left is the raw engineer release extracted via SerpApi Extract API. On the right are the viral headlines. Notice how 'potential memory read anomaly' mutated into 'catastrophic hostile assault'—our engine automatically flags the dropped hedges and exaggerated metrics."*
* **1:45 - 2:15 | The Systemic Ripple Graph:**  
  *"What does this actually touch? Rather than just pinning a pin on a map, PlaceWire builds the systemic ripple graph: software dependencies in red, market dominoes in yellow, and physical airport groundings in blue."*
* **2:15 - 2:40 | Live Interrogation (You.com):**  
  *"You might ask: 'Is this claim still contested right now?' I click [Challenge Claim]. In real-time, our agent queries You.com's live cited web index and brings back an official vendor statement posted just 30 minutes ago."*
* **2:40 - 2:50 | The Closing Punchline:**  
  *"PlaceWire makes information accountable. Every headline arrives with its lineage, its drift, and its consequences. Thank you."*

---

## 10. Success Metrics

1. **Epistemic Clarity:** A judge can identify the original primary document within 15 seconds of viewing the dashboard.
2. **Deterministic Speed:** Initial flagship case study renders in under 200ms.
3. **Live Demonstration:** The You.com live interrogation agent returns cited counter-evidence in under 4 seconds.
4. **Visual Differentiation:** The UI looks like an intelligence agency forensic tool rather than another generic AI chatbot or newsfeed.