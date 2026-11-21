import { hostLabel } from "../reading/project";
import { ReadingStep } from "../reading/types";

interface HistoryThreadProps {
  steps: ReadingStep[];
}

function sameText(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function filler(value: string): boolean {
  return (
    value.startsWith("Published report documenting") ||
    value.startsWith("Report published by") ||
    value.includes("outlining the preceding factors")
  );
}

export function HistoryThread({ steps }: HistoryThreadProps) {
  const ordered = steps;

  return (
    <ol className="thread">
      {ordered.map((step, index) => {
        const previous = ordered[index - 1];
        const followsSomethingElse = Boolean(step.linkFrom && step.linkFrom !== previous?.title);
        const quote = step.quote && !filler(step.quote) && !sameText(step.quote, step.summary) ? step.quote : "";
        const summary = step.summary && step.summary !== "No summary available" && !filler(step.summary) ? step.summary : "";
        const latest = index === ordered.length - 1;
        return (
          <li key={step.id} className={step.kind === "gap" ? "knot gap" : "knot"}>
            <span className="rail" aria-hidden="true"><span className="dot"></span></span>
            <div>
              {index > 0 ? (
                <p className="bridge">
                  <span className="meta">{step.kind === "gap" ? "A page is missing here" : "Then"}</span>
                  {step.kind !== "gap" && followsSomethingElse ? <> This follows {step.linkFrom}.</> : null}
                  {step.kind !== "gap" && step.link ? <> {step.link}</> : null}
                </p>
              ) : null}
              <p className="when-line">
                <span>{step.when}</span>
                {step.url ? (
                  <a className="src" href={step.url} target="_blank" rel="noopener noreferrer">
                    {hostLabel(step.url)}
                  </a>
                ) : (
                  <span className="meta">{step.source}</span>
                )}
              </p>
              {latest ? <p className="meta">This headline</p> : null}
              {step.kind !== "record" && step.kind !== "gap" ? (
                <p className={`status ${step.kind === "disagree" ? "disagree" : "thin"}`}>{step.kindText}</p>
              ) : null}
              <p><strong>{step.title}</strong></p>
              {summary ? <p>{summary}</p> : null}
              {quote ? <blockquote>{quote}</blockquote> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
