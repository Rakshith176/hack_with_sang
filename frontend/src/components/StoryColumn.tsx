import { useEffect, useRef, useState } from "react";
import { InterrogationVerdict } from "../types";
import { hostLabel } from "../reading/project";
import { FeedRow, ReadingStory } from "../reading/types";
import { CheckClaim } from "./CheckClaim";
import { HistoryThread } from "./HistoryThread";
import { WhatChanged } from "./WhatChanged";

type StoryView = "article" | "connects";

interface StoryColumnProps {
  row: FeedRow;
  story: ReadingStory | null;
  expandedStepId: string | null;
  onToggleStep: (id: string) => void;
  canDrill: boolean;
  drillPending: boolean;
  drillError: string | null;
  onDrill: () => void;
  tracePending: boolean;
  traceError: string | null;
  onTrace: () => void;
  onClose: () => void;
  checkPending: boolean;
  checkError: string | null;
  checkVerdict: InterrogationVerdict | null;
  checkVisible: boolean;
  onAsk: () => void;
  onHide: () => void;
}

function CloseStory({ onClose }: { onClose: () => void }) {
  return (
    <button className="close-story" type="button" onClick={onClose} aria-label="Close this story">
      <span aria-hidden="true">×</span>
    </button>
  );
}

function ViewSwitch({ view, onView }: { view: StoryView; onView: (view: StoryView) => void }) {
  return (
    <div className="views" role="group" aria-label="Story view">
      <button type="button" aria-pressed={view === "article"} onClick={() => onView("article")}>The article</button>
      <button type="button" aria-pressed={view === "connects"} onClick={() => onView("connects")}>How it connects</button>
    </div>
  );
}

function faviconFor(link: string): string {
  try {
    return new URL("/favicon.ico", link).href;
  } catch {
    return "";
  }
}

function PublisherSite({ link, headline }: { link: string; headline: string }) {
  const host = hostLabel(link);
  const favicon = faviconFor(link);
  const [showIcon, setShowIcon] = useState(Boolean(favicon));

  return (
    <div className="browser">
      <div className="browser-tabs">
        <div className="browser-tab" title={headline}>
          {showIcon && favicon ? (
            <img src={favicon} alt="" onError={() => setShowIcon(false)} />
          ) : (
            <span className="browser-glyph" aria-hidden="true" />
          )}
          <span>{host}</span>
        </div>
      </div>
      <div className="browser-omnibox">
        <p className="browser-url">{link}</p>
      </div>
      <iframe className="browser-frame" src={link} title={headline} />
    </div>
  );
}

export function StoryColumn(props: StoryColumnProps) {
  const { row, story, onClose } = props;
  const articleRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<StoryView>("article");
  const showingSite = view === "article" && Boolean(row.link);

  useEffect(() => {
    const panel = articleRef.current?.closest(".panel");
    if (panel instanceof HTMLElement) panel.scrollTo({ top: 0 });
  }, [row.id, view]);

  const when = story?.when || row.when;
  const source = story?.source || row.source;
  const headline = story?.headline || row.headline;

  return (
    <article className={showingSite ? "open site" : "open"} ref={articleRef}>
      {showingSite ? (
        <div className="site-bar">
          <ViewSwitch view={view} onView={setView} />
          <CloseStory onClose={onClose} />
        </div>
      ) : (
        <>
          <div className="story-bar">
            <p className="meta">{when}{source ? `, ${source}` : ""}</p>
            <CloseStory onClose={onClose} />
          </div>
          <h3>{headline}</h3>
          <ViewSwitch view={view} onView={setView} />
        </>
      )}
      {view === "article" ? (
        row.link ? (
          <PublisherSite link={row.link} headline={headline} />
        ) : (
          <p>This story has no page to open.</p>
        )
      ) : (
        <Connections {...props} />
      )}
    </article>
  );
}

function Connections({
  story,
  canDrill,
  drillPending,
  drillError,
  onDrill,
  tracePending,
  traceError,
  onTrace,
  checkPending,
  checkError,
  checkVerdict,
  checkVisible,
  onAsk,
  onHide,
}: StoryColumnProps) {
  if (!story) {
    return (
      <>
        <p className="status unchecked">Not checked yet</p>
        <div className="note">
          <p><strong>Reading note.</strong> This headline is not on a trail yet. Tracing looks for the record behind it, then shows what changed, how we got here, and who it reaches.</p>
        </div>
        {traceError ? <p>{traceError}</p> : null}
        <button className="action" type="button" disabled={tracePending} onClick={onTrace}>
          {tracePending ? "Tracing this story" : "Trace this story"}
        </button>
      </>
    );
  }

  return (
    <>
      <p className={`status ${story.status}`}>{story.statusText}</p>
      {story.status === "changed" ? <WhatChanged changes={story.changes} /> : null}
      <section>
        <h4>How we got here</h4>
        <p className="meta">Read from the oldest report down to this headline. Each “Then” says how the next report follows.</p>
        {drillError ? <p>{drillError}</p> : null}
        <HistoryThread steps={story.history} />
        {canDrill ? (
          <button className="action" type="button" disabled={drillPending} onClick={onDrill}>
            Look further back
          </button>
        ) : null}
      </section>
      {story.status === "changed" ? null : <WhatChanged changes={story.changes} />}
      <CheckClaim
        claim={story.claim}
        pending={checkPending}
        error={checkError}
        verdict={checkVerdict}
        visible={checkVisible}
        onAsk={onAsk}
        onHide={onHide}
      />
    </>
  );
}
