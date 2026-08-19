"use client";

import * as React from "react";

import { AppShell } from "../../../../../registry/components/app-shell/app-shell";
import { StackNavigator, useStackNavigator, type StackNavigatorEntry } from "../../../../../registry/components/stack-navigator/stack-navigator";

function DetailView() {
  const { pop } = useStackNavigator();

  return (
    <div className="min-h-full p-4">
      <button className="rounded-lg border px-3 py-2" data-autofocus onClick={pop} type="button">Back to projects</button>
      <h2 className="mt-8 text-xl font-medium">Mobile foundations</h2>
      <p className="mt-2 text-sm text-muted-foreground">The detail view is controlled by the fixture, not by StackNavigator.</p>
    </div>
  );
}

export default function StackNavigatorTestFixture() {
  const [detailVisible, setDetailVisible] = React.useState(false);
  const entries: StackNavigatorEntry[] = [
    {
      key: "projects",
      label: "Projects",
      content: (
        <div className="min-h-full">
          <div className="sticky top-0 z-10 flex gap-2 border-b border-border bg-background p-3">
            <input aria-label="Project draft" className="min-w-0 flex-1 rounded-lg border px-3" />
            <button className="rounded-lg border px-3 py-2" onClick={() => setDetailVisible(true)} type="button">Open project</button>
          </div>
          <div className="space-y-2 p-3">
            {Array.from({ length: 24 }, (_, index) => <div className="h-16 rounded-xl bg-muted p-3" key={index}>Project {index + 1}</div>)}
          </div>
        </div>
      ),
    },
    ...(detailVisible ? [{ key: "project-detail", label: "Project detail", content: <DetailView /> }] : []),
  ];

  return (
    <AppShell className="h-[36rem]">
      <AppShell.Header className="border-b border-border px-4 py-3"><strong>Workspace</strong></AppShell.Header>
      <AppShell.Main className="overflow-hidden">
        <StackNavigator entries={entries} onPop={() => setDetailVisible(false)} />
      </AppShell.Main>
      <AppShell.Footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Persistent application chrome</AppShell.Footer>
    </AppShell>
  );
}
