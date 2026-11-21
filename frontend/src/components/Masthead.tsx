interface MastheadProps {
  query: string;
  onQuery: (value: string) => void;
}

export function Masthead({ query, onQuery }: MastheadProps) {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date()).replace(",", "");

  return (
    <header>
      <div className="brand">
        <strong>The Paper Trail</strong>
        <span className="meta">{today}</span>
      </div>
      <input
        type="search"
        aria-label="Search today’s headlines"
        placeholder="Search today’s headlines"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
      />
    </header>
  );
}
