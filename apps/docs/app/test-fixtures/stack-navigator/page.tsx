"use client";

import * as React from "react";

import { AppShell } from "../../../../../registry/components/app-shell/app-shell";
import { StackNavigator, useStackNavigator, type StackNavigatorEntry } from "../../../../../registry/components/stack-navigator/stack-navigator";
import type { StackBackGestureMode } from "../../../../../registry/components/stack-navigator/use-stack-back-gesture";

function DetailView() {
  const { pop } = useStackNavigator();
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  return (
    <div className="min-h-[52rem] p-4">
      <button className="rounded-lg border px-3 py-2" data-autofocus onClick={pop} type="button">Back to projects</button>
      <h2 className="mt-8 text-xl font-medium">Mobile foundations</h2>
      <p className="mt-2 text-sm text-muted-foreground">The detail view is controlled by the fixture, not by StackNavigator.</p>
      <output className="mt-2 block text-xs text-muted-foreground" data-testid="detail-render-count">Render {renderCount.current}</output>
      <div className="mt-8 overflow-x-auto" data-testid="horizontal-scroller">
        <div className="flex w-max gap-3">
          {Array.from({ length: 8 }, (_, index) => <div className="h-24 w-36 rounded-xl bg-muted p-3" key={index}>Card {index + 1}</div>)}
        </div>
      </div>
    </div>
  );
}

export default function StackNavigatorTestFixture() {
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [gestureMode, setGestureMode] = React.useState<StackBackGestureMode>("on");
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
      <AppShell.Header className="flex items-center justify-between border-b border-border px-4 py-3">
        <strong>Workspace</strong>
        <button
          className="rounded-lg border px-2 py-1 text-xs"
          onClick={() => setGestureMode((current) => current === "off" ? "on" : "off")}
          type="button"
        >
          Gesture {gestureMode}
        </button>
      </AppShell.Header>
      <AppShell.Main className="overflow-hidden">
        <StackNavigator backGesture={gestureMode} entries={entries} onPop={() => setDetailVisible(false)} />
      </AppShell.Main>
      <AppShell.Footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Persistent application chrome</AppShell.Footer>
    </AppShell>
  );
}
