"use client";

import * as React from "react";

import { PullToRefresh } from "../../../../../registry/components/pull-to-refresh/pull-to-refresh";

export default function PullToRefreshTestFixture() {
  const [refreshes, setRefreshes] = React.useState(0);
  const [ready, setReady] = React.useState(false);

  async function refresh() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setRefreshes((count) => count + 1);
  }

  return (
    <main className="p-5">
      <button
        className="mb-3 rounded-lg border px-3 py-2 text-sm"
        data-testid="hydration-ready"
        onClick={() => setReady(true)}
        type="button"
      >
        {ready ? "Ready" : "Enable test"}
      </button>
      <p className="mb-3 text-sm" data-testid="refresh-count">Refreshes: {refreshes}</p>
      <PullToRefresh
        data-testid="pull-region"
        data-ready={ready ? "true" : "false"}
        className="h-80 rounded-2xl border border-border bg-background"
        onRefresh={refresh}
      >
        <div className="space-y-3 p-4">
          {Array.from({ length: 16 }, (_, index) => (
            <div className="rounded-xl bg-muted p-4 text-sm" key={index}>Item {index + 1}</div>
          ))}
        </div>
      </PullToRefresh>
    </main>
  );
}
