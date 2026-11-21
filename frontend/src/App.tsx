import { useEffect, useState } from "react";
import {
  analyzeLiveHeadline,
  drillDeeper,
  fetchFlagshipStory,
  fetchStoriesCatalog,
  fetchTrendingNews,
  interrogateClaim,
} from "./api/client";
import { HomeList } from "./components/HomeList";
import { Masthead } from "./components/Masthead";
import { StoryColumn } from "./components/StoryColumn";
import { applyStoryToRow, byLatest, projectFeedRow, projectStory, untracedRow } from "./reading/project";
import { FeedRow, ReadingStory } from "./reading/types";
import { GraphNode, InterrogationVerdict, StoryGraph } from "./types";

type Job = "idle" | "pending" | string;

const autoTraced = new Set<string>();
let traceSlots = 0;

function jobError(state: Job | undefined): string | null {
  if (!state || state === "idle" || state === "pending") return null;
  return state;
}

function oldestLineage(graph: StoryGraph): GraphNode | null {
  const lineage = graph.nodes.filter((node) => node.plane === "lineage");
  if (lineage.length === 0) return null;
  return lineage.reduce((best, node) => (node.depth_index < best.depth_index ? node : best));
}

export function App() {
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [headlinesError, setHeadlinesError] = useState<string | null>(null);
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [stories, setStories] = useState<Record<string, ReadingStory>>({});
  const [graphs, setGraphs] = useState<Record<string, StoryGraph>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [drilled, setDrilled] = useState<Record<string, true>>({});
  const [traceState, setTraceState] = useState<Record<string, Job>>({});
  const [drillState, setDrillState] = useState<Record<string, Job>>({});
  const [checkState, setCheckState] = useState<Record<string, Job>>({});
  const [checks, setChecks] = useState<Record<string, InterrogationVerdict | null>>({});
  const [checkVisible, setCheckVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancel = false;

    async function load() {
      let catalog;
      try {
        catalog = await fetchStoriesCatalog();
      } catch {
        if (!cancel) {
          setListError("Today’s list did not load.");
          setLoading(false);
        }
        return;
      }

      const trending = await fetchTrendingNews().then(
        (items) => ({ ok: true as const, items }),
        () => ({ ok: false as const, items: [] })
      );

      const loaded = await Promise.all(
        catalog.map(async (item) => {
          try {
            return { item, graph: await fetchFlagshipStory(item.id) };
          } catch {
            return { item, graph: null };
          }
        })
      );

      if (cancel) return;
      if (loaded.some((entry) => entry.graph === null)) {
        setListError("Today’s list did not load.");
        setLoading(false);
        return;
      }

      const nextGraphs: Record<string, StoryGraph> = {};
      const nextStories: Record<string, ReadingStory> = {};
      const catalogRows = loaded.map((entry) => {
        const graph = entry.graph as StoryGraph;
        const story = { ...projectStory(graph), id: entry.item.id };
        nextGraphs[entry.item.id] = graph;
        nextStories[entry.item.id] = story;
        const focus = graph.nodes.find((node) => node.plane === "focus");
        const link = focus?.source.url?.startsWith("http") ? focus.source.url : "";
        return { ...projectFeedRow(story, "catalog"), link };
      });

      const seen = new Set(catalogRows.map((row) => row.headline.trim().toLowerCase()));
      const liveRows = trending.ok
        ? trending.items
            .filter((item) => !seen.has(item.title.trim().toLowerCase()))
            .map(untracedRow)
        : [];

      setGraphs(nextGraphs);
      setStories(nextStories);
      setRows([...byLatest(liveRows), ...catalogRows]);
      setHeadlinesError(trending.ok ? null : "Today’s headlines did not load.");
      setLoading(false);
    }

    load();
    return () => {
      cancel = true;
    };
  }, []);

  const filtered = rows.filter((row) => row.headline.toLowerCase().includes(query.trim().toLowerCase()));
  const liveRows = filtered.filter((row) => row.origin === "live");
  const earlierRows = filtered.filter((row) => row.origin === "catalog");

  useEffect(() => {
    if (loading) return;
    const waiting = rows.filter(
      (row) => row.origin === "live" && row.status === "unchecked" && !autoTraced.has(row.id)
    );
    const room = 2 - traceSlots;
    waiting.slice(0, Math.max(0, room)).forEach((row) => {
      autoTraced.add(row.id);
      traceSlots += 1;
      traceStory(row).finally(() => {
        traceSlots -= 1;
      });
    });
  }, [loading, rows, traceState]);

  function openRow(id: string) {
    setOpenId(id);
    setExpandedStepId(null);
  }

  useEffect(() => {
    if (!openId) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  async function traceStory(row: FeedRow) {
    setTraceState((current) => ({ ...current, [row.id]: "pending" }));
    try {
      const graph = await analyzeLiveHeadline({
        title: row.headline,
        snippet: row.snippet,
        link: row.link,
        source: row.source,
        date: row.when,
      });
      const story = { ...projectStory(graph), id: row.id };
      setGraphs((current) => ({ ...current, [row.id]: graph }));
      setStories((current) => ({ ...current, [row.id]: story }));
      setRows((current) => current.map((item) => (item.id === row.id ? applyStoryToRow(item, story) : item)));
      setTraceState((current) => ({ ...current, [row.id]: "idle" }));
    } catch {
      setTraceState((current) => ({ ...current, [row.id]: "This story could not be traced. Try again." }));
    }
  }

  async function lookFurther(id: string) {
    const graph = graphs[id];
    const story = stories[id];
    const oldest = graph ? oldestLineage(graph) : null;
    if (!graph || !story || !oldest) return;
    setDrillState((current) => ({ ...current, [id]: "pending" }));
    try {
      const found = await drillDeeper(oldest.id, `precursor filing to ${oldest.title}`, `${oldest.year}-01-01`);
      const nextGraph: StoryGraph = {
        ...graph,
        nodes: [...graph.nodes, found.discovered_node],
        edges: [...graph.edges, found.discovered_edge],
      };
      const nextStory = { ...projectStory(nextGraph), id };
      setGraphs((current) => ({ ...current, [id]: nextGraph }));
      setStories((current) => ({ ...current, [id]: nextStory }));
      setRows((current) => current.map((item) => (item.id === id ? applyStoryToRow(item, nextStory) : item)));
      setDrilled((current) => ({ ...current, [id]: true }));
      setDrillState((current) => ({ ...current, [id]: "idle" }));
    } catch {
      setDrillState((current) => ({ ...current, [id]: "Nothing older turned up." }));
    }
  }

  async function askCheck(id: string) {
    const story = stories[id];
    if (!story) return;
    if (checks[id]) {
      setCheckVisible((current) => ({ ...current, [id]: true }));
      return;
    }
    setCheckState((current) => ({ ...current, [id]: "pending" }));
    try {
      const verdict = await interrogateClaim(id, story.claim);
      setChecks((current) => ({ ...current, [id]: verdict }));
      setCheckVisible((current) => ({ ...current, [id]: true }));
      setCheckState((current) => ({ ...current, [id]: "idle" }));
    } catch {
      setCheckState((current) => ({ ...current, [id]: "This claim could not be checked." }));
    }
  }

  const openRowData = rows.find((row) => row.id === openId) ?? null;

  return (
    <div className={openRowData ? "desk open" : "desk"}>
    <div className="sheet">
      <Masthead query={query} onQuery={setQuery} />
      {loading ? <p className="empty">Loading today’s list.</p> : null}
      {listError ? <p className="empty">{listError}</p> : null}
      {headlinesError ? <p className="empty">{headlinesError}</p> : null}
      {!loading && !listError && liveRows.length === 0 && earlierRows.length === 0 ? (
        <p className="empty">Nothing in today’s list matches that.</p>
      ) : null}
      {!loading && !listError ? (
        <HomeList
          rows={liveRows}
          openId={openId}
          onOpen={openRow}
          isTracing={(id) => traceState[id] === "pending"}
        />
      ) : null}
      {!loading && !listError && earlierRows.length > 0 ? (
        <>
          <h2 className="earlier">Earlier stories</h2>
          <HomeList
            rows={earlierRows}
            openId={openId}
            onOpen={openRow}
          />
        </>
      ) : null}
    </div>
    {openRowData ? (
      <aside className="panel" aria-label="The article">
        <StoryColumn
          key={openRowData.id}
          row={openRowData}
          story={stories[openRowData.id] ?? null}
          expandedStepId={expandedStepId}
          onToggleStep={(stepId) => setExpandedStepId((current) => (current === stepId ? null : stepId))}
          canDrill={Boolean(stories[openRowData.id] && graphs[openRowData.id] && oldestLineage(graphs[openRowData.id]) && !drilled[openRowData.id])}
          drillPending={drillState[openRowData.id] === "pending"}
          drillError={jobError(drillState[openRowData.id])}
          onDrill={() => lookFurther(openRowData.id)}
          tracePending={traceState[openRowData.id] === "pending"}
          traceError={jobError(traceState[openRowData.id])}
          onTrace={() => traceStory(openRowData)}
          onClose={() => setOpenId(null)}
          checkPending={checkState[openRowData.id] === "pending"}
          checkError={jobError(checkState[openRowData.id])}
          checkVerdict={checks[openRowData.id] ?? null}
          checkVisible={Boolean(checkVisible[openRowData.id])}
          onAsk={() => askCheck(openRowData.id)}
          onHide={() => setCheckVisible((current) => ({ ...current, [openRowData.id]: false }))}
        />
      </aside>
    ) : null}
    </div>
  );
}

export default App;
