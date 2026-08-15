"use client";

import * as React from "react";

export type NetworkStatus = "unknown" | "online" | "offline";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot(): NetworkStatus {
  return window.navigator.onLine ? "online" : "offline";
}

function getServerSnapshot(): NetworkStatus {
  return "unknown";
}

export function useNetworkStatus() {
  const status = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return React.useMemo(() => ({
    status,
    isOnline: status === "unknown" ? null : status === "online",
  }), [status]);
}
