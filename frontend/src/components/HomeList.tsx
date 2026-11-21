import { FeedRow } from "../reading/types";
import { Thumbnail } from "./Thumbnail";

interface HomeListProps {
  rows: FeedRow[];
  openId: string | null;
  onOpen: (id: string) => void;
  isTracing?: (id: string) => boolean;
}

export function HomeList({ rows, openId, onOpen, isTracing }: HomeListProps) {
  if (rows.length === 0) return null;

  return (
    <div>
      {rows.map((row) => (
        <button
          key={row.id}
          className={row.id === openId ? "row selected" : "row"}
          type="button"
          aria-current={row.id === openId ? "true" : undefined}
          onClick={() => onOpen(row.id)}
        >
          <div className={row.thumbnail ? "row-with-thumb" : undefined}>
            <div>
              <p className="meta">{row.when}{row.source ? `, ${row.source}` : ""}</p>
              <p className={`status ${isTracing?.(row.id) ? "thin" : row.status}`}>
                {isTracing?.(row.id) ? "Tracing this story" : row.statusText}
              </p>
              <h3>{row.headline}</h3>
              <p className="meta">{row.oneLine}</p>
              <p className="meta">{row.trail}</p>
            </div>
            {row.thumbnail ? <Thumbnail src={row.thumbnail} className="thumb" /> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
