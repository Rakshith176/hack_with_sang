import { InterrogationVerdict } from "../types";
import { verdictText } from "../reading/labels";
import { hostLabel } from "../reading/project";

interface CheckClaimProps {
  claim: string;
  pending: boolean;
  error: string | null;
  verdict: InterrogationVerdict | null;
  visible: boolean;
  onAsk: () => void;
  onHide: () => void;
}

export function CheckClaim({ claim, pending, error, verdict, visible, onAsk, onHide }: CheckClaimProps) {
  const shown = visible && verdict !== null;
  const citations = (verdict?.citations ?? []).filter((citation) => {
    try {
      const protocol = new URL(citation.url).protocol;
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  });

  return (
    <section>
      <h4>Check this claim</h4>
      <p>{claim}</p>
      <button className="action" type="button" disabled={pending} onClick={shown ? onHide : onAsk}>
        {shown ? "Hide this check" : "Check this claim"}
      </button>
      {pending ? <p className="meta">Checking this claim.</p> : null}
      {error && !pending ? <p>{error}</p> : null}
      {shown && verdict ? (
        <div className="verdict">
          <p><strong>{verdictText(verdict.verdict)}</strong> {verdict.summary}</p>
          {citations.length > 0 ? (
            <p className="meta">
              {citations.map((citation) => (
                <a key={citation.url} className="src" href={citation.url} target="_blank" rel="noopener noreferrer">
                  {hostLabel(citation.url)}
                </a>
              ))}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
