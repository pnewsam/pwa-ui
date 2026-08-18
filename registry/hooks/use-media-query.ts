"use client";

import * as React from "react";

export function useMediaQuery(query: string, defaultValue = false) {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", onStoreChange);
    return () => media.removeEventListener("change", onStoreChange);
  }, [query]);

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = React.useCallback(() => defaultValue, [defaultValue]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
