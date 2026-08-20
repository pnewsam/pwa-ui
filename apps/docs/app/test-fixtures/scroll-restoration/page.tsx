"use client";

import * as React from "react";
import { Bookmark, Home, User } from "lucide-react";

import { AppShell } from "../../../../../registry/components/app-shell/app-shell";
import { TabBar } from "../../../../../registry/components/tab-bar/tab-bar";
import { useScrollRestoration } from "../../../../../registry/hooks/use-scroll-restoration";

const tabs = ["Feed", "Saved", "Profile"] as const;
type Tab = (typeof tabs)[number];
const tabIcons = { Feed: <Home />, Saved: <Bookmark />, Profile: <User /> };

export default function ScrollRestorationTestFixture() {
  const [activeTab, setActiveTab] = React.useState<Tab>("Feed");
  const { ref } = useScrollRestoration(activeTab);

  return (
    <AppShell className="h-[36rem]" data-testid="scroll-restoration-fixture">
      <AppShell.Header className="border-b border-border px-4 py-3">
        <strong>{activeTab}</strong>
      </AppShell.Header>
      <AppShell.Main className="overflow-hidden">
        <div className="h-full overflow-y-auto" data-testid="tab-scroller" ref={ref}>
          <div className="space-y-2 p-3">
            {Array.from({ length: 30 }, (_, index) => (
              <div className="h-16 rounded-xl bg-muted p-3" key={`${activeTab}-${index}`}>
                {activeTab} item {index + 1}
              </div>
            ))}
          </div>
        </div>
      </AppShell.Main>
      <AppShell.Footer>
        <TabBar>
          {tabs.map((tab) => (
            <TabBar.Item
              active={tab === activeTab}
              icon={tabIcons[tab]}
              key={tab}
              label={tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </TabBar>
      </AppShell.Footer>
    </AppShell>
  );
}
