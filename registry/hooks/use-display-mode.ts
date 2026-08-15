"use client";

import * as React from "react";

export type DisplayMode =
  | "browser"
  | "standalone"
  | "fullscreen"
  | "minimal-ui"
  | "unknown";

function readDisplayMode(): DisplayMode {
  if (typeof window === "undefined") return "unknown";

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  if (navigatorWithStandalone.standalone) return "standalone";
  if (window.matchMedia("(display-mode: fullscreen)").matches) return "fullscreen";
  if (window.matchMedia("(display-mode: standalone)").matches) return "standalone";
  if (window.matchMedia("(display-mode: minimal-ui)").matches) return "minimal-ui";
  return "browser";
}

export function useDisplayMode(): DisplayMode {
  const [mode, setMode] = React.useState<DisplayMode>("unknown");

  React.useEffect(() => {
    const queries = ["fullscreen", "standalone", "minimal-ui"].map((value) =>
      window.matchMedia(`(display-mode: ${value})`),
    );
    const update = () => setMode(readDisplayMode());

    update();
    queries.forEach((query) => query.addEventListener("change", update));
    return () => queries.forEach((query) => query.removeEventListener("change", update));
  }, []);

  return mode;
}
