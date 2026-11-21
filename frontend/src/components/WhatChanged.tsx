import { hostLabel } from "../reading/project";
import { ChangedPair } from "../reading/types";

const PLACEHOLDER_SUBJECT = "scale and permanence of disruption";
const HIDDEN_TEXT = [
  "A targeted administrative or backlog friction point was sensationalized into a permanent, total industry collapse.",
  "Localized technical adjustment reported as a widespread crisis.",
  "Regulatory adjustments announced for specific application tiers.",
  "Operational adjustments applied to specific tier-1 protocols.",
];
const VAGUE_WHEN = new Set(["", "Breaking Today", "Today", "Recent", "Immediate Aftermath"]);

function SourceLink({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <p>
      <a className="src" href={url} target="_blank" rel="noopener noreferrer">{hostLabel(url)}</a>
    </p>
  );
}

function shown(text: string): string {
  const trimmed = text.trim();
  return HIDDEN_TEXT.includes(trimmed) ? "" : trimmed;
}

function saidAt(when: string, who: string): string {
  if (VAGUE_WHEN.has(when.trim())) return `${who} said`;
  return `At ${when}, ${who} said`;
}

function partLabel(subject: string): string {
  const trimmed = subject.trim();
  if (!trimmed || trimmed.toLowerCase() === PLACEHOLDER_SUBJECT) return "What the headline claims";
  return trimmed;
}

export function WhatChanged({ changes }: { changes: ChangedPair[] }) {
  if (changes.length === 0) return null;

  return (
    <section>
      <h4>Which part, and when</h4>
      <p className="meta">The telling changed means the headline does not say what the earlier record said.</p>
      {changes.map((change) => {
        const recordText = shown(change.recordText);
        const headlineText = shown(change.headlineText);
        const explanation = shown(change.explanation);
        const repeatsQuotes = Boolean(recordText && headlineText && explanation.includes(recordText) && explanation.includes(headlineText));
        return (
          <div className="pair" key={`${change.subject}-${change.headlineText}`}>
            <p><strong>{partLabel(change.subject)}</strong></p>
            {explanation && !repeatsQuotes ? (
              <div className="why">
                <p><strong>Why it does not line up.</strong> {explanation}</p>
              </div>
            ) : null}
            <div>
              <p>{saidAt(change.recordWhen, change.recordWho)}</p>
              {recordText ? <blockquote>{recordText}</blockquote> : <p className="meta">The earlier wording was not in the record.</p>}
              <SourceLink url={change.recordUrl} />
            </div>
            <div>
              <p>{saidAt(change.headlineWhen, change.headlineWho)}</p>
              {headlineText ? <blockquote>{headlineText}</blockquote> : null}
              <SourceLink url={change.headlineUrl} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
