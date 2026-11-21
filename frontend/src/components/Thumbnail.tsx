import { useState } from "react";

export function Thumbnail({ src, className }: { src: string; className: string }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return <img className={className} src={src} alt="" onError={() => setHidden(true)} />;
}
