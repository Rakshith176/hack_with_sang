import { TrendingNewsItem } from "../api/client";

export type PlainStatus = "record" | "changed" | "disagree" | "thin" | "unchecked";

export type StepKind = "record" | "guess" | "disagree" | "thin" | "gap";

export type ReachCertainty = "Known" | "Reported" | "Possible";

export interface ReadingStep {
  id: string;
  when: string;
  title: string;
  summary: string;
  quote: string;
  kind: StepKind;
  kindText: string;
  source: string;
  url: string | null;
  linkFrom: string | null;
  link: string | null;
}

export interface ReachLine {
  id: string;
  title: string;
  certainty: ReachCertainty;
  detail: string;
  url: string | null;
}

export interface ChangedPair {
  subject: string;
  recordWho: string;
  recordWhen: string;
  recordText: string;
  recordUrl: string | null;
  headlineWho: string;
  headlineWhen: string;
  headlineText: string;
  headlineUrl: string | null;
  explanation: string;
}

export interface ReadingStory {
  id: string;
  when: string;
  source: string;
  headline: string;
  oneLine: string;
  trail: string;
  status: PlainStatus;
  statusText: string;
  note: string;
  changes: ChangedPair[];
  history: ReadingStep[];
  reaches: ReachLine[];
  claim: string;
}

export interface FeedRow {
  id: string;
  origin: "catalog" | "live";
  when: string;
  source: string;
  headline: string;
  oneLine: string;
  trail: string;
  status: PlainStatus;
  statusText: string;
  snippet: string;
  link: string;
  thumbnail: string | null;
}

export type TrendingItem = TrendingNewsItem;
