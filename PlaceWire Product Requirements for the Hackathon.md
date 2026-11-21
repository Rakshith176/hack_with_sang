# PlaceWire: Product Requirements for the Hackathon

*Working requirements document. Tracks used: SerpApi and you.com. Nexconn is out of scope for the first version.*

## 1. Summary

PlaceWire is a place-based knowledge graph of how news events connect. It is not a news feed. Every headline on the map arrives with its **history** (what led to it), its **consequences** (what it affects), and an honest account of **how well its claims check out**.

**One-line pitch:** Every headline arrives with its history and its consequences, and shows how much to trust each claim.

**Original idea (from the team):** News sorted by location with maps integration. Navigate to a place and see trending stories there. Sections of verified information on tech and other topics. Subscribe to topics and get updates backed by sources.

**Direction added since:** The product should not feel like a feed. For any headline, the user wants to see all previous events and touchpoints that led to it, and any nodes affected by it.

## 2. Problem and goals

### Problem

- News apps show stories in isolation, so readers cannot see how an event came about or what it touches.
- Readers cannot easily tell whether a claim is well supported, repeated from a single source, or has changed as it spread.
- Local activity that matters (council decisions, planning filings, closures) often goes unreported or is hard to connect to coverage.

### Goals

1. Let a user open any headline and see its lineage and its ripple effects.
2. Make evidence and uncertainty visible instead of hiding them.
3. Anchor everything to place, using a map.
4. Deliver one polished end-to-end situation for the hackathon demo.

### Non-goals for the first version

- Complete coverage of arbitrary headlines.
- Multiple cities, user accounts, or a human review queue.
- Live chat rooms and push alerts.
- Any claim of "full truth" or guaranteed verification.

## 3. Principles

- **Honest labels over strong labels.** Say "confirmed by 2 independent sources as of 3:40 PM," never just "verified."
- **Evidence beside every conclusion.** Every label, edge, and answer shows the source sentence behind it.
- **Stated versus inferred.** Facts a source explicitly states appear solid. Anything the system infers appears dashed and labeled "possible."
- **Say what is missing.** "Origin not found," "no coverage found between these dates," and "source not accessible" are valid outputs.
- **Related is not caused.** Do not imply causation from timing alone.

## 4. Users

- **Curious local resident:** wants to understand what is happening nearby and why.
- **Student or researcher:** wants to trace how a story developed.
- **Journalist or analyst (secondary):** wants provenance and drift to check a claim.

## 5. Core concepts

- **Situation:** an evolving event or issue, such as a rezoning decision. A situation holds a graph of nodes and edges.
- **Node:** a touchpoint, such as an event, document, statement, reaction, correction, place, group, organization, policy, or scheduled follow-up.
- **Edge:** a typed link between nodes, with an evidence quote and a check time.
- **Claim:** a specific factual statement (number, date, name, decision) extracted from a source, with a source ID.
- **Provenance:** where a claim originated and which outlets repeated it.
- **Drift:** how a claim's details changed as it spread from its origin.

## 6. Functional requirements

### 6.1 Map view (must have)

- FR-1: The user can select a city and see situations as pins on a map.
- FR-2: Each pin shows a confidence indicator and a recency stamp.
- FR-3: Pins use event location, not publication location, and show uncertainty when the location is unclear (for example, a shaded area instead of an exact pin).
- FR-4: Tapping a pin opens the situation page.

### 6.2 Story lineage: "How did we get here?" (must have)

- FR-5: For a headline, show a backward chain of touchpoints, ordered in time.
- FR-6: Node types: origin, decision, statement, reaction, reversal or correction, background.
- FR-7: Edge types: triggered, responded to, contradicts, updated or corrected, background for, and related. Each edge carries an evidence quote.
- FR-8: Show gap markers where no coverage or documents were found between two nodes.
- FR-9: Support branches (side threads such as a legal challenge) that the user can expand.
- FR-10: Offer a "start here" node for newcomers.
- FR-11: Limit search depth to two levels and a defined date window to avoid runaway expansion.
- FR-12: Mark nodes whose sources are paywalled or inaccessible, without summarizing them from guesswork.

### 6.3 Ripple graph: "What does this touch?" (must have)

- FR-13: For a headline, show a forward graph of affected nodes.
- FR-14: Affected node types: places, groups of people, organizations, policies and rules, other situations, and future events.
- FR-15: Edge types: directly affects (stated in a source), likely affects (inferred, shown dashed and labeled "possible"), scheduled follow-up, and contested.
- FR-16: Every solid edge cites the supporting sentence. Inferred edges are visually distinct.
- FR-17: Use map data to find nearby candidate nodes such as schools, hospitals, transit routes, and neighborhoods, and keep them as candidates unless a source confirms the effect.
- FR-18: Show an impact radius on the map for the affected area.
- FR-19 (nice to have): a "near me" filter that shows only nodes within a chosen distance of a saved place.

### 6.4 Claim lifecycle and confidence (must have, simple version)

- FR-20: Each claim has a state: Emerging, Corroborated, Contested, Corrected, or Settled.
- FR-21: Each situation shows a confidence meter with its reasons: independent origins, presence of a primary source, agreement on specifics, and recency.
- FR-22: Tapping the meter shows each factor. The scoring rules are simple and visible.
- FR-23: Every label carries an "as of" timestamp.
- FR-24: A time scrubber replays how claims changed over time.

### 6.5 Provenance tracing (must have)

- FR-25: For each claim, show an origin chain, for example: official notice, outlet A, then outlets B, C, and D.
- FR-26: Compute independence by origin, so outlets repeating one source count as one.
- FR-27: If the origin cannot be found, show "origin not found" instead of guessing.

### 6.5a Claim drift (must have, one example is enough)

- FR-28: For a claim repeated across sources, show a drift strip with the origin wording on the left and later versions to the right, with changed details highlighted.
- FR-29: Track at least four change types: hedging lost, unit changed, scale changed, and duration or deadline changed.
- FR-30: Label changes as "differs from original," not "wrong," since later outlets may have newer information. Check later versions against newer official updates.
- FR-31: Show the original text beside every highlighted change.

### 6.6 Interrogation panel (should have)

- FR-32: The user can select a claim and choose Trace (show origin chain), Challenge (search for evidence against it), or Ask (free question).
- FR-33: Answers use only the situation's evidence, include citations and an "as of" time, and state what could not be established.
- FR-34: Challenge returns evidence against the claim, or states that none was found.

### 6.7 What changed digest (should have)

- FR-35: A user can follow a place or situation. On return, they see a diff: claims upgraded, corrected, or contested, and new gaps found.
- FR-36: This replaces push alerts in the first version.

### 6.8 Coverage gap layer (could have)

- FR-37: Compare official or local sources (agendas, notices, public records) with news coverage, and shade map areas where activity exists but little reporting was found.
- FR-38: Show "What we don't know" on each situation: open questions such as "vote count not yet published."

### 6.9 Topic sections (could have)

- FR-39: Simple lists for Tech, Local, and Science, using the same confidence indicators.

### 6.10 Cross-situation links (could have)

- FR-40: If two situations share a node (the same developer, law, or corridor), show the bridge and allow navigation between them.

## 7. Track usage

### SerpApi (Track 1): required

- News and web search filtered by location and topic.
- Maps data for locating events, finding nearby places, and building the impact radius.
- Extract API for full article text and official documents (agendas, filings, notices).
- Backward searches for lineage and forward searches for ripple candidates.

### you.com (Track 2): required

- Extract structured claims from text.
- Classify node types and propose edges, each with an evidence quote.
- Verify proposed edges and claims against sources, downgrading unsupported links to "related" or "possible."
- Run the Challenge search for contradicting evidence.
- Answer questions in the interrogation panel using only stored evidence, with citations.

### Nexconn (Track 3): out of scope for now

- Reason: the core experience does not need live chat, and a verification and knowledge-graph product is stronger with two tracks done well than three done thinly.
- Future fit: story discussion rooms and alert delivery for subscriptions.

**Open item:** Confirm from each API's documentation the available location filters, date filters, response fields, and rate limits before finalizing the design. These details have not been verified, and the lineage search and gap detection depend on them.

## 8. Processing pipeline

1. **Seed:** Take a headline and extract its full text.
2. **Reference pull:** Find named entities, dates, documents, and earlier events mentioned in the article.
3. **Backward search:** Use references to find earlier coverage and primary documents, to depth two.
4. **Forward search:** Find stated impacts in the text and nearby candidate places from map data.
5. **Claim extraction:** Split each source into factual claims with source IDs.
6. **Provenance and drift:** Find each claim's earliest or most official source, compare later versions field by field.
7. **Classify and link:** Label node types and propose typed edges with evidence quotes.
8. **Verify:** Check each solid edge and flagged claim against sources. Downgrade unsupported edges.
9. **Label and timestamp:** Assign states, confidence reasons, and "as of" times.
10. **Cache:** Store results so the demo does not depend on live calls.

## 9. Data model (draft)

**Node:** id, type, title, date, location (optional, with confidence), sources, summary, situation ids.

**Edge:** from, to, type, evidence quote, source id, solid or inferred, checked at.

**Claim:** id, text, structured fields (subject, quantity, unit, date, hedge words), source id, node id, state.

**Source:** id, outlet or issuer, URL, publication time, type (official, news, social), accessible or not.

**Provenance record:** claim id, origin source id (or "not found"), chain of repeating sources, independence count.

**Drift record:** claim id, ordered versions, per-field changes, original text and changed text.

## 10. Non-functional requirements

- **Reliability for demo:** Pre-run and store the flagship situation. Disclose that the demo uses saved results.
- **Transparency:** Every label, edge, and answer links to its evidence.
- **Performance:** The situation page opens instantly from cached data. Live refresh may be slower and is labeled as such.
- **Source quality:** Use an allowlist of reputable outlets and official sites. Treat official records as primary sources.
- **Safety of language:** Avoid wording such as "verified" or "the truth." Use "confirmed by N independent sources as of time."
- **Duplicates:** Cluster near-identical stories so one event produces one pin.

## 11. Hackathon scope

### Must build

- One city, one flagship situation with real data.
- Lineage spine with 4 to 6 past nodes and at least one gap marker.
- Ripple graph with 5 to 8 affected nodes, 2 or 3 with map locations, and the solid versus dashed distinction.
- Provenance chain and one drift strip on a real claim.
- Confidence meter with visible reasons and timestamps.
- Map with pins and an impact radius.

### Should build if time allows

- Interrogation panel (Trace, Challenge, Ask).
- What-changed digest.

### Present as next steps

- Coverage gap layer, topic sections, cross-situation bridges, "near me" personalization.
- Nexconn discussion rooms and alerts.
- Multiple cities, user accounts, human review queue, outlet reliability scores, live graph updates.

### Suggested build order

1. Gather and extract for the flagship situation.
2. Claim extraction and provenance for one claim.
3. Lineage nodes and edges with evidence quotes.
4. Ripple nodes and edges, plus map candidates.
5. Verification pass and confidence labels.
6. Map view, situation canvas, drift strip.
7. Interrogation panel and what-changed digest.
8. Polish, caching, and a recorded backup.

## 12. Demo plan (about 2.5 minutes)

1. Open today's headline on the map. Say: "Most apps hide when sources disagree and ignore history. This one shows both."
2. Tap "How did we get here?" and watch the lineage spine build backward. Open the origin node, then a gap marker.
3. Open a claim that drifted across nodes and show the drift strip.
4. Show the provenance chain: "8 outlets, 2 independent origins."
5. Switch to the ripple view. Explain solid versus dashed edges. Click an affected place and show the supporting sentence.
6. Show the impact radius on the map.
7. Challenge a claim and show the result, or the statement that nothing contradicting was found.
8. Close with: "Every headline arrives with its history and its consequences."

**Demo rules:** Pre-run and store the flagship data. Disclose that results are saved. Rehearse three times. Keep a screen recording as a backup. Choose a story with a clear paper trail (for example a local rezoning or transit project), reputable sources, an official record, and nothing still developing.

## 13. Risks and mitigations

- **Invented causality or impacts:** Require an evidence quote for every solid edge. Show "related" or "possible" otherwise.
- **Overreach by proximity:** Keep map-derived nodes as candidates until a source confirms them.
- **Incomplete history:** Label the view "history found," not "complete history."
- **Wrong pins:** Use event location, show uncertainty, and verify pin placement for the flagship story by hand.
- **Extraction errors:** Show original text beside every highlighted change or edge.
- **Overclaiming:** Keep label wording modest and timestamped.
- **Scope creep:** Protect one polished situation over breadth.
- **API limits:** Confirm rate limits and date filters early. Cache everything the demo needs.
- **Competition from cited AI search:** Differentiate on the map, the visible lineage and ripple graph, provenance, and drift, not on citations alone.

## 14. Success criteria

- A judge can open the flagship headline and, within two minutes, see its history, its consequences, and why its claims are or are not trusted.
- At least one gap marker, one drift example, and one provenance chain work on real data.
- Every solid edge and every label links to a source sentence.
- The product can state clearly what it could not establish.

## 15. Open questions

- Which city and flagship situation will be used?
- What location and date filters do the two APIs actually support?
- How will the source allowlist be defined?
- Which two or three should-have features are worth the remaining time?
- Does the team want Nexconn added back later for discussion rooms and alerts?

## 16. Self-assessment

With lineage, ripple, provenance, and drift working on one real situation, the idea is a strong 8 to 9 for a hackathon. The main risk is ambition, so the plan favors one complete, well-evidenced situation over wide coverage.
