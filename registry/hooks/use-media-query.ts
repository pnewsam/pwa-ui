"use client";

import * as React from "react";

export function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = React.useState(defaultValue);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
