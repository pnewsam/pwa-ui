"use client";

import * as React from "react";

export function ShowcaseContainment({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const hadAttribute = root.hasAttribute("data-pwa-app-root");
    root.setAttribute("data-pwa-app-root", "");

    return () => {
      if (!hadAttribute) root.removeAttribute("data-pwa-app-root");
    };
  }, []);

  return (
    <div className="h-full min-h-0 w-full bg-zinc-100 sm:grid sm:place-items-center sm:p-6" data-pwa-app-mount>
      {children}
    </div>
  );
}
