"use client";

import * as React from "react";

export function ServiceWorkerRegistration() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    }).catch((error: unknown) => {
      console.warn("PWA UI docs service worker registration failed.", error);
    });
  }, []);

  return null;
}
