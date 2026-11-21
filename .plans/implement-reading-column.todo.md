# Implement the reading column

## Summary

Replace the forensic canvas with the locked reading column: today’s list is the home page, and opening a story unfolds the reading note, what changed, the history thread, who it reaches, and an on-demand claim check in that same column. The screen speaks plain language. The existing story graph stays the source of truth and is projected in the client. No backend change.

## Type
Feature

## Source Issue/Task

Conversation task, not a GitHub issue. The locked design is `final-reading.html` (served at `http://127.0.0.1:8765/final-reading.html`). The request being planned is: implement that design in the React frontend.

The earlier product request this plan still has to satisfy:

- A news view that connects to lineage, simple enough for daily reading.
- Truths, claims, and older history visible without specialist module names.
- The other modules simplified the same way, not left as separate tabs.
- AI insight shown clearly, and only where it belongs.
- Each history date paired with the website it came from.
- Home is the list. Opening a story shows the other modules in place.
- Backend may change only if the screen cannot be built from current data. It can, so this plan does not change it.

## Original Requirements (100% Coverage Required)

| # | Requirement | Plan Step(s) |
|---|-------------|--------------|
| 1 | Home is today’s list and replaces the news modal and the story switcher | Steps 5, 7 |
| 2 | Each home row shows when, source, a plain status, the headline, one sentence, and how far back the trail goes | Steps 2, 5 |
| 3 | An untraced live headline says “Not checked yet”; opening it offers “Trace this story” | Steps 5, 7 |
| 4 | Tracing a live headline calls the existing analyze endpoint and then shows the same story column | Step 7 |
| 5 | Opening a traced story unfolds in the same column, in this order: headline, reading note, What changed, How we got here, Who this reaches, Check this claim, Close | Step 6 |
| 6 | The reading note is labeled “Reading note.”, sits with the sources, and never says true or false | Steps 2, 6 |
| 7 | What changed shows the record and the headline, each with its site when a URL exists | Steps 2, 6 |
| 8 | How we got here is one thread. The date and the site link sit on the same line. The link is a real anchor outside the date button | Steps 3, 6 |
| 9 | A gap step is a dashed knot and has no link | Steps 2, 6 |
| 10 | “Look further back” calls the existing drill-deeper endpoint and appends the older page to the thread | Steps 6, 7 |
| 11 | Who this reaches lists known, reported, and possible effects from ripple nodes | Steps 2, 6 |
| 12 | Check this claim runs only when asked, then shows one sentence plus the citation links | Steps 4, 6, 7 |
| 13 | Plain statuses only: Matches the record, The telling changed, People disagree, Not enough yet, Not checked yet | Steps 2, 4 |
| 14 | Search filters headlines. Filters are All, The telling changed, People disagree, Not enough yet, Not checked yet | Step 5 |
| 15 | Epistemic index, telephone factor, mutation enums, relevancy percents, and product jargon stay off the screen | Steps 2, 4, 6, 8 |
| 16 | Visual system: Fraunces headlines, Atkinson Hyperlegible body, paper `#F4F7F8`, ink `#1B2428`, muted `#3E4C51`, line `#D5DEE2`, record green `#0F6E56`, changed red `#9F2D2D`, thread rust `#C4552A` only on the history line, left-aligned column about `40rem`, no cards, no all-caps labels, no middle-dot meta strings, no arrow icons | Steps 3, 6, 8 |
| 17 | Catalog stories and live headlines share one list. Catalog stories load through the existing flagship endpoint | Step 7 |
| 18 | Failed loads, a failed trace, a failed check, and a failed look-further-back stay in the column as a sentence, and do not insert invented pages | Step 7 |
| 19 | The old header, tabs, spine, drift inspector, ripple board, and both modals are removed in the same change | Step 8 |
| 20 | Verify the reading flows in the browser | Step 9 |

**Coverage Check**: 20 of 20 requirements mapped to plan steps.

## Status
Todo (rename to `.done.md` when complete)

## Context

The Paper Trail currently opens on a dark full-screen canvas. News is a popup. Lineage, drift, and ripple are tabs with specialist names. The claim check is a second modal. A person who wants to read the news has to learn the tool before they can read the story.

The locked design is one paper column. Today’s headlines are the page. The history is a line you open under the headline you are already reading. The graph, the drift records, and the live check stay in the API. Only the projection and the screen change.

## Current State

- `frontend/src/App.tsx` loads the catalog and one flagship graph, then renders `Header` plus one of `LineageSpine`, `DriftInspector`, or `SystemicRipple`. `NewsDiscoveryModal` and `InterrogateModal` cover the page.
- `frontend/src/api/client.ts` already calls every endpoint the new screen needs: `GET /api/story/trending`, `GET /api/story/catalog`, `GET /api/story/flagship?story_id=`, `POST /api/story/analyze`, `POST /api/story/drill-deeper`, `POST /api/interrogate`.
- `StoryGraph` in `frontend/src/types/index.ts` is the payload: nodes (`lineage` / `focus` / `ripple`), edges, and `drift_records`. Node `status` is `confirmed | inferred | disputed | unresolved`. Node `category` includes `gap_marker`. Drift has `original_claim`, `viral_claim`, `mutation_type`, `drift_explanation`, and `telephone_factor`. There is no URL on a claim, only on `node.source`.
- The three catalog graphs (CrowdStrike flagship, Nvidia export, Boeing FAA) all contain drift records, and each focus node is `disputed`. None of them contains a `gap_marker`. Live analyze also returns a drift record.
- `StoryGraph.summary` on the flagship is specialist copy (“forensic DAG”, “Telephone Game”). It must not be shown as the reading note.
- `@xyflow/react`, `lucide-react`, `clsx`, and `tailwind-merge` are dependencies. xyflow, clsx, and tailwind-merge are unused in `src`. Lucide is only used by the components this plan deletes.
- No `CLAUDE.md` exists in the repo. No frontend test runner is configured. `npm run build` is `tsc && vite build`.
- Vite proxies `/api` to `127.0.0.1:8000`, but the client calls `http://127.0.0.1:8000` directly. Leave that base URL alone.

## Desired State

The app opens on a paper column titled The Paper Trail, with today’s date, a search box, status filters, and one list. Catalog stories are already traced. Live headlines are not. Clicking a row expands it in place. Closing it returns to the list. The old canvas is gone.

## CLAUDE.md Requirements

No `CLAUDE.md` exists at the repo root or under `frontend/`. Follow the conventions already in the frontend:

### Naming conventions
- React components are PascalCase `.tsx` files in `frontend/src/components/`.
- Shared types live in `frontend/src/types/`. New reading-only types live next to the projector in `frontend/src/reading/`, because they are a view model, not the API contract.
- API functions stay in `frontend/src/api/client.ts` and keep their current names.

### Architecture requirements
- The API client returns `StoryGraph`. A pure function projects that graph into the reading view model. Components render the view model and do not re-derive status, labels, or hostnames.
- Network calls stay in `App` (or a hook used only by `App`), matching the current pattern in `App.tsx`. Presentational components receive data and callbacks.
- Do not add a second source of truth, a feature flag, or a fallback renderer for the old canvas.

### Type requirements
- Reuse `StoryGraph`, `GraphNode`, `GraphEdge`, `ClaimDriftRecord`, `InterrogationVerdict`, `TrendingNewsItem`, and `StoryCatalogItem`.
- No `any`. Catch errors with `instanceof Error`.
- Do not widen API unions. Map them to the plain-language unions in the projector.

### Other guidelines
- The design reference is `final-reading.html`. Copy its behavior and tokens. Do not copy its hand-written sample stories into the app.
- Prototype files (`final-reading.html`, `news-reader-directions.html`, `design-directions.html`, `reading-screens.html`) stay where they are. They are not part of the app and are not deleted by this plan.

## Existing Types

### Types to reuse
- `StoryGraph`, `GraphNode`, `GraphEdge`, `ClaimDriftRecord`, `SourceEvidence` from `frontend/src/types/index.ts` — the graph the projector reads.
- `InterrogationVerdict`, `CitationHit` from `frontend/src/types/index.ts` — the on-demand check response.
- `TrendingNewsItem`, `StoryCatalogItem` from `frontend/src/api/client.ts` — the two inputs to the home list.
- `fetchFlagshipStory`, `fetchStoriesCatalog`, `fetchTrendingNews`, `analyzeLiveHeadline`, `interrogateClaim`, `drillDeeper` from `frontend/src/api/client.ts` — unchanged.

### Types to create
In `frontend/src/reading/types.ts`:

- `PlainStatus` — `"record" | "changed" | "disagree" | "thin" | "unchecked"`.
- `StepKind` — `"record" | "guess" | "disagree" | "thin" | "gap"`.
- `ReachCertainty` — `"Known" | "Reported" | "Possible"`.
- `ReadingStep` — one thread knot: `id`, `when`, `title`, `summary`, `quote`, `kind`, `kindText`, `source`, `url` (`string | null`; null means no link).
- `ReachLine` — one ripple line: `id`, `title`, `certainty`, `detail`, `url`.
- `ChangedPair` — one drift comparison: record who/text/url, headline who/text/url, `explanation`.
- `ReadingStory` — the opened story: identity, row fields, `note`, `changes`, `history`, `reaches`, `claim`.
- `FeedRow` — a list row before or without a graph: `id`, `origin: "catalog" | "live"`, row fields, and for live rows the `title`, `snippet`, `link`, and `source` needed to call analyze.

### Type guidelines
- No `any`.
- No `unknown` except the `catch` binding, which is immediately narrowed with `instanceof Error`.
- Do not put `telephone_factor`, `epistemic_score`, `mutation_type`, or `relevancy_percent` on the view model. If the screen cannot render a field, the projector drops it.

## Impact Analysis

### Files to modify
- `frontend/src/App.tsx` — replace canvas state with list, open story, search, filter, trace, drill, and check state. This is the only place that calls the API.
- `frontend/src/index.css` — replace the dark terminal theme with the reading-column tokens and layout classes from `final-reading.html`.
- `frontend/index.html` — load Fraunces and Atkinson Hyperlegible, set the document title to `The Paper Trail`, and drop the dark body classes.
- `frontend/tailwind.config.js` — remove the unused `mesh` dark palette so the old colors cannot leak back. Tailwind stays installed because the build already wires it, but the reading layout is written as the CSS classes in `index.css`, not as dark utility strings.
- `frontend/package.json` and `frontend/package-lock.json` — remove `@xyflow/react`, `lucide-react`, `clsx`, and `tailwind-merge` after the components that imported them are gone.

### Files to create
- `frontend/src/reading/types.ts` — view-model types.
- `frontend/src/reading/labels.ts` — the only map from API enums to on-screen words.
- `frontend/src/reading/project.ts` — pure `projectStory(graph: StoryGraph): ReadingStory` plus the home-row helpers.
- `frontend/src/components/Masthead.tsx` — brand, date, search, filters.
- `frontend/src/components/HomeList.tsx` — the list, including the empty line.
- `frontend/src/components/StoryColumn.tsx` — the unfolded story, composing the sections below.
- `frontend/src/components/WhatChanged.tsx`
- `frontend/src/components/HistoryThread.tsx`
- `frontend/src/components/WhoThisReaches.tsx`
- `frontend/src/components/CheckClaim.tsx`

### Files to delete
- `frontend/src/components/Header.tsx`
- `frontend/src/components/LineageSpine.tsx`
- `frontend/src/components/DriftInspector.tsx`
- `frontend/src/components/SystemicRipple.tsx`
- `frontend/src/components/NewsDiscoveryModal.tsx`
- `frontend/src/components/InterrogateModal.tsx`

### Dependencies affected
- `frontend/src/main.tsx` still mounts `App`. No change beyond the CSS it already imports.
- The FastAPI app is not modified. The screen must keep working against the current `StoryGraph` JSON.
- Nothing else in the repo imports the deleted components. Confirmed: only `App.tsx` imports them.

### Breaking changes
- The in-app navigation changes completely: tabs, the story `<select>`, the discovery modal, and the interrogation modal go away. There is no external consumer of those components.
- Visible copy changes. Epistemic score, “Challenge headline”, thread filters, and “VeritasMesh” are not carried over.

### Data fact the screen must not paper over
Every current catalog graph has at least one drift record, and live analyze returns one too. With the status rule in Step 2, those stories read **The telling changed**. “People disagree” still appears on a thread step whose node is `disputed`, and as a row status only when a graph disagrees and has no drift record. “Not enough yet” is the row status for a traced graph that is thin and has no drift. Do not special-case `flagship_crowdstrike_2024`, `story_nvidia_export`, or `story_boeing_faa` to imitate the sample labels in the HTML prototype.

## Implementation Steps

### Step 1: Add the reading view-model types
**File**: `frontend/src/reading/types.ts`
**Action**: Add the types listed under “Types to create”. Export them. Do not edit `frontend/src/types/index.ts`.
**Why**: The API types stay the contract. The screen reads a smaller model.
**Details**:
- `url` fields that can be absent are `string | null`, not optional strings, so a missing link and an empty link are the same case.
- `FeedRow.status` uses `PlainStatus` so an untraced row and a projected row share one filter.

### Step 2: Project a story graph into the reading model
**File**: `frontend/src/reading/project.ts` and `frontend/src/reading/labels.ts`
**Action**: Write pure functions. No React, no `fetch`.
**Why**: Status, copy, order, and links have to be decided once, from fields the API already sends.

**Labels** (`labels.ts`):

| API value | On screen |
|---|---|
| row `record` | Matches the record |
| row `changed` | The telling changed |
| row `disagree` | People disagree |
| row `thin` | Not enough yet |
| row `unchecked` | Not checked yet |
| node `confirmed` | On the record |
| node `inferred` | A reasonable guess |
| node `disputed` | People disagree |
| node `unresolved` | Not enough yet |
| node `gap_marker`, or an incoming edge `gap_preceded` | Not enough yet, and `StepKind` `"gap"` |
| verdict `rebuttal_found` | A disagreement was found |
| verdict `uncontested` | No disagreement found |
| verdict `active_dispute` | People disagree |
| verdict `insufficient_data` | Not enough yet |

Do not map `mutation_type` or `telephone_factor` to visible text. `drift_explanation` is already a sentence.

**Row status**, first match:

1. No graph yet → `unchecked`.
2. `drift_records.length > 0` → `changed`.
3. Any node `status === "disputed"`, or any edge `relationship === "contradicts"` → `disagree`.
4. Any node `category === "gap_marker"` or `status === "unresolved"`, or fewer than two `lineage` nodes → `thin`.
5. Otherwise → `record`.

**Reading note**: the first drift record’s `drift_explanation`. If there is no drift record, the focus node’s `summary`. If that is missing, the sentence “The pages below are the record behind this headline.” Never use `StoryGraph.summary`. Never prefix the note with a verdict.

**What changed**: one `ChangedPair` per drift record, in array order.
- Record who and text come from `original_claim`.
- Record URL: the `source.url` of a `lineage` node with `source.is_primary` whose `outlet_or_issuer` shares a word of five or more letters with `original_claim.source_name`. If none matches, use the primary lineage node with the greatest `depth_index` (closest to the headline). If none is primary, `url` is null and the name still shows.
- Headline who and text come from `viral_claim`.
- Headline URL is the focus node’s `source.url`.
- Explanation is `drift_explanation`.
- A claim has no URL field. Do not invent one, and do not copy the focus URL onto the record side.

**Thread** (`history`): `lineage` and `focus` nodes, sorted by `depth_index` descending so the latest step is first.
- `when` is `timestamp`. `title` is `title`. `summary` is `summary`. `quote` is `source.evidence_quote`. `source` is `source.outlet_or_issuer`.
- A step is a gap when `category === "gap_marker"` or the edge whose `target` is this node has `relationship === "gap_preceded"`. Gap steps set `url` to null even if a URL is present.
- Every other step sets `url` to `source.url` when it is an `http` or `https` URL, otherwise null.
- Do not insert a synthetic gap between dates. The current catalog has no gap nodes; the thread simply has none until the data has one.
- Host label is the URL hostname with a leading `www.` removed. The component does that display step so the projector keeps the full URL.

**Trail line**:
- Untraced row: “Not traced yet”.
- Traced, with a lineage node: `Goes back to ${oldest.timestamp}` using the lineage node with the smallest `depth_index`.
- Traced, with no lineage node: “Not enough yet”.

**One sentence**: the same text as the reading note for a traced story. For a live untraced row, `TrendingNewsItem.snippet`.

**Who this reaches**: `ripple` nodes sorted by `depth_index` ascending. Certainty comes from that node and the edge whose `target` is the node:
- `relationship === "cascaded_to"` and `is_solid` and node `status === "confirmed"` → `Known`.
- `relationship === "likely_affects"`, or `is_solid === false`, or node `status === "inferred"` → `Possible`.
- Otherwise → `Reported`.
- `detail` is `summary`. `url` follows the same http(s) rule. A gap node does not appear here because gaps are lineage.

**Claim sentence**: the first drift record’s `viral_claim.raw_text`, otherwise `focus_headline`.

**Home helpers** in the same file:
- `projectFeedRow(story: ReadingStory, origin): FeedRow` copies the row fields.
- `untracedRow(item: TrendingNewsItem): FeedRow` sets status `unchecked`, trail “Not traced yet”, `when` from `date`, `source` from `source_name`, headline from `title`.

### Step 3: Replace the visual system
**Files**: `frontend/index.html`, `frontend/src/index.css`, `frontend/tailwind.config.js`
**Action**: Put the column on paper and delete the dark theme.
**Why**: The reading column is the whole product surface. Leaving the old tokens in Tailwind invites the forensic look back.
**Details**:
- In `index.html`, add the Google fonts stylesheet used by `final-reading.html` (`Fraunces` at 500 and 600, `Atkinson Hyperlegible` at 400 and 700). Title: `The Paper Trail`. Remove `bg-[#090D14]`, `text-slate-100`, and the blue selection classes from `body`.
- Move the prototype’s custom properties and classes into `index.css`: `--bg`, `--ink`, `--muted`, `--line`, `--record`, `--changed`, `--thread`, `.sheet` at `max-width: 40rem`, `.brand`, `.meta`, search input, `.filters`, `.row`, `.open`, `.note`, `.pair`, `.src`, `.thread`, `.knot`, `.rail`, `.dot`, `.knot.gap`, `.when-line`, `.reach`, `.action`, `.verdict`, `.empty`.
- Body background is `--bg` for the full viewport. Text is `--ink`. Headlines use Fraunces. Body uses Atkinson Hyperlegible.
- `.status.changed` uses `--changed`. `.status.record` uses `--record`. `.status.thin` and `.status.unchecked` use `--muted`. `.status.disagree` stays ink.
- `.src` uses `--record`. `.verdict` uses a left rule in `--changed`. `.note` uses a left rule in `--record`.
- Rust appears only on `.rail::before` and `.dot`.
- Focus styles match the prototype: `outline: 2px solid var(--ink); outline-offset: 2px` on links, buttons, and the search box.
- Buttons that are dates (`.line-btn`) have no border, so they are not mistaken for filters. Action buttons (Trace, Look further back, Check, Close) keep the ink border from `.action`.
- Delete `.evidence-block`, the dark scrollbar colors, and the `@apply bg-[#090D14]` body rule.
- In `tailwind.config.js`, delete the `mesh` color extension. Leave `content` as it is.
- No cards, no uppercase tracking labels, no `·` separators, no lucide icons, no gradient header.

### Step 4: Build the claim-check copy
**File**: `frontend/src/reading/labels.ts` (verdict map from Step 2) and `frontend/src/components/CheckClaim.tsx`
**Action**: Render the check as a block inside the column, not a modal.
**Why**: The check is the AI insight a reader asks for. It has to be recognizable as a check, and it has to stay next to the claim.
**Details**:
- Props: `claim: string`, `pending: boolean`, `error: string | null`, `verdict: InterrogationVerdict | null`, `onAsk: () => void`, `onHide: () => void`.
- The claim is a paragraph. The button reads “Check this claim” before a result and “Hide this check” after one.
- While pending, the button is disabled and the line under it reads “Checking this claim.”
- On error, that line is the error sentence. Do not mention You.com, Gemini, or an audit agent.
- On a verdict, show the plain verdict label in bold, then `verdict.summary`. Under it, one link per citation: hostname, `target="_blank"`, `rel="noopener noreferrer"`, class `src`. Skip a citation with no http(s) URL. Do not print `query_run` or the raw verdict enum.
- The result sits in `.verdict`.

### Step 5: Build the masthead and the home list
**Files**: `frontend/src/components/Masthead.tsx`, `frontend/src/components/HomeList.tsx`
**Action**: Render the closed list.
**Why**: Home replaces both the story switcher and the news modal.
**Details**:
- Masthead: “The Paper Trail” and the date from `Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" })`, which produces “Saturday 21 November”.
- Search: `type="search"`, `aria-label="Search today’s headlines"`, placeholder “Search today’s headlines”, `width: 100%`.
- Filters are a `role="group"` with `aria-label="Filter by what we know"`. Each is a button with `aria-pressed`. Labels, in order: All, The telling changed, People disagree, Not enough yet, Not checked yet. The pressed style is the existing underline on that button, so a wrapped label still has its own underline.
- `HomeList` receives `FeedRow[]` and `onOpen(id)`. Each closed row is a `<button class="row">` containing when and source, the status, an `<h3>` headline, the one sentence, and the trail. No links inside the row button.
- When the filtered list is empty: “Nothing in today’s list matches that.”
- Filtering rules live in `App`, not in the list: case-insensitive match of the query against the headline, then status filter (`all` skips the status test).

### Step 6: Build the unfolded story
**Files**: `frontend/src/components/StoryColumn.tsx`, `WhatChanged.tsx`, `HistoryThread.tsx`, `WhoThisReaches.tsx`
**Action**: Render `ReadingStory` in the locked order, plus the untraced state.
**Why**: This is the page a person actually reads.
**Details**:
- `StoryColumn` props cover both states. If the row is untraced, render the meta, “Not checked yet”, the headline, the reading note “This headline is not on a trail yet. Tracing looks for the record behind it, then shows what changed, how we got here, and who it reaches.”, the button “Trace this story”, and “Close this story”. While a trace is in flight, the trace button is disabled and reads “Tracing this story”. On failure, show the error sentence above the button and keep the row untraced.
- Traced order inside `<article class="open">`:
  1. when, source, status, `<h3>` headline
  2. reading note in `.note`, starting with the bold words “Reading note.”
  3. `<h4>What changed</h4>`, then each pair: “What the record says”, who, link, quote; “What the headline says”, who, link, quote; the explanation. A missing URL omits the anchor and keeps the name.
  4. `<h4>How we got here</h4>`, the trail sentence “The date sits with the page it came from.”, then the thread
  5. “Look further back” only when the parent says it is still available. After a success the button is gone. On failure the sentence “Nothing older turned up.” stays above the thread and the button remains.
  6. `<h4>Who this reaches</h4>` as a `<ul class="reach">`. Each item is the title, the certainty word, the detail, and the site link when `url` is set.
  7. `<h4>Check this claim</h4>` and `CheckClaim`
  8. “Close this story”
- `HistoryThread`: an `<ol class="thread">`. Each knot is a grid with the rust rail. The date is `<button class="line-btn" aria-expanded>`. The site is `<a class="src">` as a sibling, never a child of the button. Activating the date toggles that step’s quote and summary. Only one step is open. A gap knot has class `gap` and renders no anchor.
- Section headings are sentence case in the element text, not CSS uppercase.
- Do not render hedges, metric values, confidence, relevancy, or thread names (`technical`, `regulatory`).

### Step 7: Wire the column to the existing API
**File**: `frontend/src/App.tsx`
**Action**: Replace the canvas state machine. Keep using the functions in `frontend/src/api/client.ts`.
**Why**: The screen has to be the real app, fed by the catalog and by live headlines.
**Details**:
- On mount, `Promise.all` of `fetchStoriesCatalog()`, `fetchTrendingNews()`, and one `fetchFlagshipStory(id)` per catalog id. Three catalog stories is the current payload. Project each graph immediately so its row status is real.
- State:
  - `rows: FeedRow[]` — catalog rows first, then live rows whose title is not already a catalog headline
  - `stories: Record<string, ReadingStory>` — filled for catalog ids, and for a live id after analyze
  - `graphs: Record<string, StoryGraph>` — kept so drill-deeper can append a node and re-project
  - `openId: string | null`, `query: string`, `filter: PlainStatus | "all"`
  - `expandedStepId: string | null`
  - `drilled: Record<string, true>` — hides “Look further back” after one success for that story
  - `traceState`, `drillState`, and `checkState` keyed by story id: idle, pending, or an error string
  - `checks: Record<string, InterrogationVerdict | null>`
- Opening a catalog row sets `openId` and scrolls that article into view with `scrollIntoView({ block: "start" })`. Do not remount the search box in a way that drops the query. Keep search focus only when the user is typing.
- Opening a live row that has no story yet shows the untraced column. “Trace this story” calls `analyzeLiveHeadline({ title, snippet, link, source })`. On success, store the graph, project it, replace that row’s status, trail, one-liner, and source from the projection, and leave the story open. On failure, leave status `unchecked` and show “This story could not be traced. Try again.”
- “Look further back” calls `drillDeeper` with the oldest lineage node’s id, the query `precursor filing to ${node.title}`, and `dateBefore` of `${node.year}-01-01`, which is what `LineageSpine` sends today. Append `discovered_node` and `discovered_edge` to that graph and re-project. The new step appears at the older end because of the depth sort. On failure, do not append a node.
- “Check this claim” calls `interrogateClaim(story.id, story.claim)`. Store the verdict for that id. “Hide this check” collapses it without clearing the verdict, so opening it again does not repeat the request. A new check after an error retries.
- Load failure: if trending fails and the catalog succeeded, still show the catalog and the line “Today’s headlines did not load.” If the catalog or a flagship fetch fails, show “Today’s list did not load.” in the column. The loading state is the sentence “Loading today’s list.” on the paper background. No full-screen dark spinner.
- Closing sets `openId` to null and returns the row button. Filters and the query are unchanged.
- Delete the `activeTab`, `selectedThread`, modal, and `selectedStoryId` state with the rewrite. There is no thread switcher.

### Step 8: Remove the forensic UI and its dependencies
**Files**: the six component files listed for deletion, `frontend/package.json`, `frontend/package-lock.json`
**Action**: Delete the old components and uninstall the packages only they needed.
**Why**: Leaving them in the tree keeps a second UI one import away.
**Details**:
- Delete the six files. `App.tsx` must have no remaining imports of them, of `lucide-react`, or of xyflow.
- Run `npm uninstall @xyflow/react lucide-react clsx tailwind-merge` in `frontend/`.
- Grep `frontend/src` for `Header`, `LineageSpine`, `DriftInspector`, `SystemicRipple`, `NewsDiscoveryModal`, `InterrogateModal`, `epistemic_score`, `telephone_factor`, `VeritasMesh`, `lucide-react`, and `@xyflow/react`. The only allowed hit for the two metrics is inside `frontend/src/types/index.ts`, where they remain part of the API type and are unread by the UI.

### Step 9: Verify
**Action**: Typecheck, build, and walk the column in the browser against a running API on port 8000.
**Why**: This change replaces every screen. A typecheck does not prove the thread links, the trace, or the check.
**Details**:
- `npm run build` in `frontend/` (`tsc` and Vite).
- With the API up, open `http://127.0.0.1:5173` and do all of the following:
  - Home shows The Paper Trail, the date, search, the five filters, catalog rows with “The telling changed”, and live rows with “Not checked yet”.
  - Search narrows by headline. A nonsense query shows the empty line. Clearing it restores the list.
  - Each status filter hides the other rows. “All” restores them. On a narrow viewport the pressed filter’s underline stays on its own label.
  - Open the CrowdStrike row. Confirm the reading note, both drift pairs, the thread with the date and a hostname link on the same line, ripple lines with Known / Reported / Possible, and Close. Click a hostname and confirm it is an anchor to the node URL. Click a date and confirm the quote opens without navigating. Confirm a gap, if the payload has none, is simply absent.
  - “Look further back” adds one older step or shows “Nothing older turned up.” It does not add a step with a made-up title when the request fails.
  - “Check this claim” shows a plain verdict and citation hostnames, or an error sentence. Hide and show again does not require a second request after success.
  - Close returns to the list with the same search text.
  - Open a live row, choose “Trace this story”, and confirm the status leaves “Not checked yet” only after analyze returns. A failed analyze keeps “Not checked yet”.
  - Desktop width and a narrow width both keep the column at or under `40rem` with no horizontal page scroll.
- Fix anything that fails and repeat the failed path.

## REMOVAL SPECIFICATION

### Code to remove

#### From `frontend/src/App.tsx`
- The whole current component: tab state, thread state, both modal states, the dark loading screen, and the canvas branches.
- **Why removing**: replaced by the list and the unfolded column.
- **Replacement**: Step 7.
- **Dependencies**: the six components below. They are deleted in Step 8, not left imported.

#### File to delete: `frontend/src/components/Header.tsx`
- **Why removing**: the brand bar, story `<select>`, “Discover Live News”, epistemic score, “Challenge headline”, and lineage/drift/ripple tabs.
- **Replacement**: `Masthead.tsx` (Step 5). Story choice moves into the list. The score is not shown.
- **Dependencies**: imported only by `App.tsx`.

#### File to delete: `frontend/src/components/LineageSpine.tsx`
- **Why removing**: the card timeline, thread filter, and drill button.
- **Replacement**: `HistoryThread.tsx` plus the drill call in `App` (Steps 6 and 7). The drill request body stays the same.
- **Dependencies**: imported only by `App.tsx`.

#### File to delete: `frontend/src/components/DriftInspector.tsx`
- **Why removing**: the telephone-factor cards and mutation badges.
- **Replacement**: `WhatChanged.tsx` (Step 6), fed by `ChangedPair` (Step 2).
- **Dependencies**: imported only by `App.tsx`.

#### File to delete: `frontend/src/components/SystemicRipple.tsx`
- **Why removing**: the casualty board and category filters.
- **Replacement**: `WhoThisReaches.tsx` (Step 6).
- **Dependencies**: imported only by `App.tsx`.

#### File to delete: `frontend/src/components/NewsDiscoveryModal.tsx`
- **Why removing**: live news is the home list, not a modal. The topic query stays the client default already used by `fetchTrendingNews` (`technology OR business`). There is no second search topic box.
- **Replacement**: untraced rows in `HomeList.tsx` (Steps 5 and 7).
- **Dependencies**: imported only by `App.tsx`.

#### File to delete: `frontend/src/components/InterrogateModal.tsx`
- **Why removing**: the check is inline.
- **Replacement**: `CheckClaim.tsx` (Step 4). `interrogateClaim` stays in the API client.
- **Dependencies**: imported only by `App.tsx`.

#### From `frontend/src/index.css` and `frontend/tailwind.config.js`
- Dark body background, `.evidence-block`, dark scrollbars, and the `mesh` palette.
- **Why removing**: they belong to the canvas.
- **Replacement**: Step 3.
- **Dependencies**: no other file references `mesh.` or `.evidence-block`.

#### From `frontend/package.json`
- `@xyflow/react`, `lucide-react`, `clsx`, `tailwind-merge`.
- **Why removing**: unused once the canvas components are gone. xyflow, clsx, and tailwind-merge are already unused in `src`.
- **Replacement**: none. The column does not need a graph canvas, an icon set, or a class combiner.
- **Dependencies**: lockfile updated by `npm uninstall` in Step 8.

### Removal checklist
- [ ] All six forensic components deleted
- [ ] `App.tsx` no longer imports them
- [ ] Dark theme classes and `mesh` colors removed
- [ ] Unused packages uninstalled
- [ ] No remaining screen copy of epistemic score, telephone factor, VeritasMesh, SerpApi, or Gemini
- [ ] Grep for the old component names returns nothing under `frontend/src`

**VERIFICATION**: At completion, grep `frontend/src` for `LineageSpine`, `DriftInspector`, `SystemicRipple`, `NewsDiscoveryModal`, `InterrogateModal`, `activeTab`, `selectedThread`, and `lucide-react`.

## Anti-Patterns to Avoid

Do not include:
- A feature flag or query param that still mounts the forensic canvas
- Keeping the six components “for reference” or rendering them when the new list is empty
- A parallel `StoryGraphV2` type or a `*-new.tsx` file
- Hard-coded status labels for the three catalog ids so they imitate `final-reading.html`
- A fake gap knot, a fake older page, or a copied URL when the graph has none
- Showing `StoryGraph.summary`, `epistemic_score`, `telephone_factor`, `mutation_type`, or `relevancy_percent`
- A second backend reading endpoint in this change
- Migration copy such as “new reader” or a temporary bridge component

Replace the screen completely. The API client and the API types stay, because they are the data source, not the old UI.

## Validation Criteria

### Pre-implementation checklist
- [x] No project `CLAUDE.md` to apply; frontend file layout checked
- [x] API types identified and reused
- [x] Affected files identified, including the six deletions
- [x] New files use final names (`reading/`, `StoryColumn`, `HistoryThread`)
- [x] Catalog and live payloads checked so status rules match real fields
- [x] Backend left unchanged on purpose

### Post-implementation checklist
- [ ] All steps completed
- [ ] Removal checklist completed
- [ ] `npm run build` passes in `frontend/`
- [ ] No `any` added
- [ ] Browser checks in Step 9 pass, including trace, drill, check, search, filters, and a narrow viewport
- [ ] A story with no gap node does not show a dashed knot
- [ ] Date links are anchors outside the date button
- [ ] The reading note never uses `StoryGraph.summary`

## Ready to implement

The plan covers the locked column only. It does not change FastAPI, the graph schema, or the design HTML prototypes. Start at Step 1 and finish with the browser pass in Step 9.
