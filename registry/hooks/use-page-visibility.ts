"use client";

import * as React from "react";

export type PageVisibilityState = "unknown" | DocumentVisibilityState;

function subscribe(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  window.addEventListener("pageshow", callback);
  window.addEventListener("pagehide", callback);

  return () => {
    document.removeEventListener("visibilitychange", callback);
    window.removeEventListener("pageshow", callback);
    window.removeEventListener("pagehide", callback);
  };
}

function getSnapshot(): PageVisibilityState {
  return document.visibilityState;
}

function getServerSnapshot(): PageVisibilityState {
  return "unknown";
}

function getWasDiscarded() {
  return Boolean((document as Document & { wasDiscarded?: boolean }).wasDiscarded);
}

export function usePageVisibility() {
  const visibilityState = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const wasDiscarded = visibilityState === "unknown" ? false : getWasDiscarded();

  return React.useMemo(() => ({
    visibilityState,
    isVisible: visibilityState === "unknown" ? null : visibilityState === "visible",
    wasDiscarded,
  }), [visibilityState, wasDiscarded]);
}
