import { GraphEdge, GraphNode, StoryGraph } from "../types";
import { statusText, stepKindText } from "./labels";
import { ChangedPair, FeedRow, PlainStatus, ReachCertainty, ReachLine, ReadingStep, ReadingStory, StepKind, TrendingItem } from "./types";

const FALLBACK_NOTE = "The pages below are the record behind this headline.";

export function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function httpUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return url;
  } catch {
    return null;
  }
  return null;
}

function wordsOf(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 5);
}

function sharedCount(left: string, right: string): number {
  const rightWords = new Set(wordsOf(right));
  return wordsOf(left).filter((word) => rightWords.has(word)).length;
}

function storyStatus(graph: StoryGraph): PlainStatus {
  const hasDrift = graph.drift_records.length > 0;
  const disagrees =
    graph.nodes.some((node) => node.status === "disputed") ||
    graph.edges.some((edge) => edge.relationship === "contradicts");
  const lineageCount = graph.nodes.filter((node) => node.plane === "lineage").length;
  const thin = graph.nodes.some((node) => node.category === "gap_marker" || node.status === "unresolved") || lineageCount < 2;
  if (hasDrift) return "changed";
  if (disagrees) return "disagree";
  if (thin) return "thin";
  return "record";
}

function incomingEdge(edges: GraphEdge[], nodeId: string): GraphEdge | undefined {
  return edges.find((edge) => edge.target === nodeId);
}

function isGap(node: GraphNode, edge: GraphEdge | undefined): boolean {
  return node.category === "gap_marker" || edge?.relationship === "gap_preceded";
}

function stepKind(node: GraphNode, gap: boolean): StepKind {
  if (gap) return "gap";
  if (node.status === "inferred") return "guess";
  if (node.status === "disputed") return "disagree";
  if (node.status === "unresolved") return "thin";
  return "record";
}

function readingNote(graph: StoryGraph, focus: GraphNode | undefined): string {
  const explanation = graph.drift_records[0]?.drift_explanation?.trim();
  if (explanation) return explanation;
  const summary = focus?.summary?.trim();
  if (summary) return summary;
  return FALLBACK_NOTE;
}

function claimNode(graph: StoryGraph, sourceName: string, rawText: string): GraphNode | undefined {
  const nodes = graph.nodes.filter((node) => node.plane === "lineage");
  let best: { node: GraphNode; score: number } | undefined;
  for (const node of nodes) {
    const nameScore = sharedCount(sourceName, node.source.outlet_or_issuer);
    const textScore = sharedCount(rawText, `${node.title} ${node.summary} ${node.source.evidence_quote}`);
    const score = Math.max(nameScore >= 2 ? nameScore : 0, textScore >= 2 ? textScore : 0);
    if (score > 0 && (!best || score > best.score)) best = { node, score };
  }
  return best?.node;
}

function changedPairs(graph: StoryGraph, focus: GraphNode | undefined): ChangedPair[] {
  return graph.drift_records.map((record) => {
    const recordWho = record.original_claim.source_name || "The record";
    const headlineWho = record.viral_claim.source_name || record.viral_claim.outlet_name || focus?.source.outlet_or_issuer || "The headline";
    const recordNode = claimNode(graph, recordWho, record.original_claim.raw_text);
    return {
      subject: record.subject,
      recordWho,
      recordWhen: recordNode?.timestamp ?? "",
      recordText: record.original_claim.raw_text,
      recordUrl: httpUrl(recordNode?.source.url),
      headlineWho,
      headlineWhen: focus?.timestamp ?? "",
      headlineText: record.viral_claim.raw_text,
      headlineUrl: httpUrl(focus?.source.url),
      explanation: record.drift_explanation,
    };
  });
}

function parsedWhen(value: string): number | null {
  const text = value.trim().replace(/\s*UTC$/i, "");
  const clock = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s+(\d{1,2}):(\d{2})\s*(AM|PM)(?:,\s*([+-]\d{4}))?$/i);
  if (clock) {
    let hour = Number(clock[4]) % 12;
    if (clock[6].toUpperCase() === "PM") hour += 12;
    const utc = Date.UTC(Number(clock[3]), Number(clock[1]) - 1, Number(clock[2]), hour, Number(clock[5]));
    const offset = clock[7];
    if (!offset) return utc;
    const sign = offset.startsWith("-") ? -1 : 1;
    const minutes = Number(offset.slice(1, 3)) * 60 + Number(offset.slice(3, 5));
    return utc - sign * minutes * 60 * 1000;
  }
  const day = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/);
  if (day) {
    return Date.UTC(Number(day[1]), Number(day[2]) - 1, Number(day[3]), Number(day[4] ?? 0), Number(day[5] ?? 0));
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function byTime(nodes: GraphNode[]): GraphNode[] {
  const dated = nodes.length > 0 && nodes.every((node) => parsedWhen(node.timestamp) !== null);
  if (!dated) return [...nodes].sort((a, b) => a.depth_index - b.depth_index);
  return [...nodes].sort((a, b) => (parsedWhen(a.timestamp) ?? 0) - (parsedWhen(b.timestamp) ?? 0));
}

function historyOf(graph: StoryGraph): ReadingStep[] {
  const lineage = byTime(graph.nodes.filter((node) => node.plane === "lineage"));
  const focus = graph.nodes.filter((node) => node.plane === "focus");
  return [...lineage, ...focus].map((node) => {
      const edge = incomingEdge(graph.edges, node.id);
      const from = edge ? graph.nodes.find((item) => item.id === edge.source) : undefined;
      const gap = isGap(node, edge);
      const kind = stepKind(node, gap);
      const tissue = edge ? (edge.connective_tissue || "").trim() : "";
      const evidence = edge ? (edge.evidence_quote || "").trim() : "";
      const link = tissue || (evidence.startsWith("Causal link:") ? "" : evidence);
      return {
        id: node.id,
        when: node.timestamp,
        title: node.title,
        summary: node.summary,
        quote: node.source.evidence_quote,
        kind,
        kindText: stepKindText(kind),
        source: node.source.outlet_or_issuer,
        url: gap ? null : httpUrl(node.source.url),
        linkFrom: from?.title ?? null,
        link: link || null,
      };
    });
}

function trailOf(graph: StoryGraph): string {
  const lineage = graph.nodes.filter((node) => node.plane === "lineage");
  if (lineage.length === 0) return "Not enough yet";
  const oldest = byTime(lineage)[0];
  return `Goes back to ${oldest.timestamp}`;
}

function certaintyOf(node: GraphNode, edge: GraphEdge | undefined): ReachCertainty {
  if (edge?.relationship === "likely_affects" || edge?.is_solid === false || node.status === "inferred") return "Possible";
  if (edge?.relationship === "cascaded_to" && edge.is_solid && node.status === "confirmed") return "Known";
  return "Reported";
}

function reachesOf(graph: StoryGraph): ReachLine[] {
  return graph.nodes
    .filter((node) => node.plane === "ripple")
    .sort((a, b) => a.depth_index - b.depth_index)
    .map((node) => ({
      id: node.id,
      title: node.title,
      certainty: certaintyOf(node, incomingEdge(graph.edges, node.id)),
      detail: node.summary,
      url: httpUrl(node.source.url),
    }));
}

export function projectStory(graph: StoryGraph): ReadingStory {
  const focus = graph.nodes.find((node) => node.plane === "focus");
  const status = storyStatus(graph);
  const note = readingNote(graph, focus);
  return {
    id: graph.story_id,
    when: focus?.timestamp ?? "",
    source: focus?.source.outlet_or_issuer ?? "",
    headline: graph.focus_headline,
    oneLine: note,
    trail: trailOf(graph),
    status,
    statusText: statusText(status),
    note,
    changes: changedPairs(graph, focus),
    history: historyOf(graph),
    reaches: reachesOf(graph),
    claim: graph.drift_records[0]?.viral_claim.raw_text || graph.focus_headline,
  };
}

export function projectFeedRow(story: ReadingStory, origin: FeedRow["origin"]): FeedRow {
  return {
    id: story.id,
    origin,
    when: story.when,
    source: story.source,
    headline: story.headline,
    oneLine: story.oneLine,
    trail: story.trail,
    status: story.status,
    statusText: story.statusText,
    snippet: "",
    link: "",
    thumbnail: null,
  };
}

export function untracedRow(item: TrendingItem): FeedRow {
  return {
    id: item.id,
    origin: "live",
    when: item.date,
    source: item.source_name,
    headline: item.title,
    oneLine: item.snippet,
    trail: "Not traced yet",
    status: "unchecked",
    statusText: statusText("unchecked"),
    snippet: item.snippet,
    link: item.link,
    thumbnail: httpUrl(item.thumbnail),
  };
}

export function byLatest(rows: FeedRow[]): FeedRow[] {
  const timeOf = (when: string): number | null => {
    const parsed = Date.parse(when);
    return Number.isNaN(parsed) ? null : parsed;
  };
  return [...rows].sort((a, b) => {
    const left = timeOf(a.when);
    const right = timeOf(b.when);
    if (left !== null && right !== null) return right - left;
    if (left !== null) return -1;
    if (right !== null) return 1;
    return 0;
  });
}

export function applyStoryToRow(row: FeedRow, story: ReadingStory): FeedRow {
  return {
    ...row,
    when: story.when,
    source: story.source,
    headline: story.headline,
    oneLine: story.oneLine,
    trail: story.trail,
    status: story.status,
    statusText: story.statusText,
  };
}
