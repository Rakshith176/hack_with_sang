import { StoryGraph, InterrogationVerdict, GraphNode, GraphEdge } from '../types';

const API_BASE = 'http://127.0.0.1:8000';

export interface TrendingNewsItem {
  id: string;
  title: string;
  snippet: string;
  date: string;
  source_name: string;
  link: string;
  thumbnail?: string;
}

export interface StoryCatalogItem {
  id: string;
  title: string;
  category: string;
  timeframe: string;
  summary: string;
}

export async function fetchFlagshipStory(storyId: string = 'flagship_crowdstrike_2024'): Promise<StoryGraph> {
  const res = await fetch(`${API_BASE}/api/story/flagship?story_id=${encodeURIComponent(storyId)}`);
  if (!res.ok) throw new Error('Failed to fetch story graph');
  return res.json();
}

export async function fetchStoriesCatalog(): Promise<StoryCatalogItem[]> {
  const res = await fetch(`${API_BASE}/api/story/catalog`);
  if (!res.ok) throw new Error('Failed to fetch stories catalog');
  return res.json();
}

export interface ArticleBlock {
  kind: "paragraph" | "image" | string;
  text: string;
  url: string;
}

export async function fetchArticle(url: string): Promise<{ url: string; blocks: ArticleBlock[]; limited?: boolean }> {
  const res = await fetch(`${API_BASE}/api/story/article?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error('The article did not load.');
  return res.json();
}

export async function fetchTrendingNews(topic: string = 'technology OR business'): Promise<TrendingNewsItem[]> {
  const res = await fetch(`${API_BASE}/api/story/trending?q=${encodeURIComponent(topic)}`);
  if (!res.ok) throw new Error('Failed to fetch trending news from SerpApi');
  return res.json();
}

export async function analyzeLiveHeadline(item: { title: string; snippet?: string; link?: string; source?: string; date?: string }): Promise<StoryGraph> {
  const res = await fetch(`${API_BASE}/api/story/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to analyze live headline');
  return res.json();
}

export async function interrogateClaim(claimId: string, claimText: string): Promise<InterrogationVerdict> {
  const res = await fetch(`${API_BASE}/api/interrogate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim_id: claimId, claim_text: claimText }),
  });
  if (!res.ok) throw new Error('Live interrogation request failed');
  return res.json();
}

export async function drillDeeper(nodeId: string, query: string, dateBefore?: string): Promise<{ discovered_node: GraphNode; discovered_edge: GraphEdge }> {
  const res = await fetch(`${API_BASE}/api/story/drill-deeper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ node_id: nodeId, query, date_before: dateBefore }),
  });
  if (!res.ok) throw new Error('Drill deeper archival search failed');
  return res.json();
}
