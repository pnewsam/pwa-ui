"use client";

import * as React from "react";
import { Home, Search, User } from "lucide-react";

import { AppShell } from "../../../../../registry/components/app-shell/app-shell";
import { NavigationBar } from "../../../../../registry/components/navigation-bar/navigation-bar";
import { TabBar } from "../../../../../registry/components/tab-bar/tab-bar";

export default function AppShellTestFixture() {
  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const hadAttribute = root.hasAttribute("data-pwa-app-root");
    root.setAttribute("data-pwa-app-root", "");

    return () => {
      if (!hadAttribute) root.removeAttribute("data-pwa-app-root");
    };
  }, []);

  return (
    <div data-pwa-app-mount data-testid="app-mount">
      <AppShell>
        <AppShell.Header>
          <NavigationBar><NavigationBar.Title>Layout fixture</NavigationBar.Title></NavigationBar>
        </AppShell.Header>
        <AppShell.Main data-testid="app-scroll-region" className="bg-muted/35 px-4 py-5">
          <div className="grid gap-3">
            {Array.from({ length: 30 }, (_, index) => (
              <div className="rounded-xl border border-border bg-background p-4" key={index}>Scrollable row {index + 1}</div>
            ))}
          </div>
        </AppShell.Main>
        <AppShell.Footer>
          <TabBar>
            <TabBar.Item icon={<Home />} label="Home" active />
            <TabBar.Item icon={<Search />} label="Search" />
            <TabBar.Item icon={<User />} label="Profile" />
          </TabBar>
        </AppShell.Footer>
      </AppShell>
    </div>
  );
}
