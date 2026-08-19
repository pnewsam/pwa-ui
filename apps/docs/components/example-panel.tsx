"use client";

import * as React from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  Download,
  Home,
  MoreHorizontal,
  Search,
  Send,
  Share2,
  Trash2,
  User,
} from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { ActionSheet } from "../../../registry/components/action-sheet/action-sheet";
import { AppShell } from "../../../registry/components/app-shell/app-shell";
import { BottomSheet } from "../../../registry/components/bottom-sheet/bottom-sheet";
import { KeyboardAvoidingView } from "../../../registry/components/keyboard-avoiding-view/keyboard-avoiding-view";
import { InstallPrompt } from "../../../registry/components/install-prompt/install-prompt";
import { NavigationBar } from "../../../registry/components/navigation-bar/navigation-bar";
import { OfflineBanner } from "../../../registry/components/offline-banner/offline-banner";
import { PWAProvider } from "../../../registry/components/pwa-provider/pwa-provider";
import { ResponsiveDialog } from "../../../registry/components/responsive-dialog/responsive-dialog";
import { SafeArea } from "../../../registry/components/safe-area/safe-area";
import { TabBar } from "../../../registry/components/tab-bar/tab-bar";
import { UpdatePrompt } from "../../../registry/components/update-prompt/update-prompt";
import type { ComponentSlug } from "@/lib/component-docs";

function DemoButton({ children }: { children: React.ReactNode }) {
  return <span className="demo-button">{children}</span>;
}

function DemoPhone({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div className={`demo-phone ${className}`}>
      <div className="demo-phone-viewport">{children}</div>
    </div>
  );
}

function AppShellDemo() {
  return (
    <DemoPhone className="demo-phone-tall">
      <AppShell className="demo-app-shell">
        <AppShell.Header>
          <NavigationBar>
            <NavigationBar.Leading><NavigationBar.BackButton aria-label="Go back" /></NavigationBar.Leading>
            <NavigationBar.Title>Today</NavigationBar.Title>
            <NavigationBar.Trailing><button className="demo-icon-button" aria-label="Notifications"><Bell size={17} /></button></NavigationBar.Trailing>
          </NavigationBar>
        </AppShell.Header>
        <AppShell.Main className="demo-feed">
          <p className="demo-overline">Friday, August 15</p>
          <h3>Good morning.</h3>
          <div className="demo-card demo-card-dark"><small>Next up</small><strong>Plan the product review</strong><span>10:30 AM · Studio</span></div>
          <div className="demo-card"><small>Later</small><strong>Check release notes</strong><span>2 items remaining</span></div>
        </AppShell.Main>
        <AppShell.Footer>
          <TabBar>
            <TabBar.Item icon={<Home size={19} />} label="Home" active />
            <TabBar.Item icon={<Search size={19} />} label="Search" />
            <TabBar.Item icon={<User size={19} />} label="Profile" />
          </TabBar>
        </AppShell.Footer>
      </AppShell>
    </DemoPhone>
  );
}

function PWAProviderDemo() {
  return (
    <PWAProvider>
      <div className="demo-center">
        <span className="docs-list-icon"><Check size={14} /></span>
        <strong>Viewport tokens are active</strong>
        <p className="demo-caption">One provider keeps application chrome and keyboard-aware layouts in sync.</p>
      </div>
    </PWAProvider>
  );
}

function SafeAreaDemo() {
  return (
    <div className="safe-area-stage">
      <div className="safe-area-device" style={{ "--pwa-safe-top": "28px", "--pwa-safe-right": "14px", "--pwa-safe-bottom": "24px", "--pwa-safe-left": "14px" } as React.CSSProperties}>
        <SafeArea className="safe-area-demo-content">
          <div className="safe-area-island" />
          <div className="safe-area-message"><strong>Content stays clear</strong><span>Insets are applied on every requested edge.</span></div>
          <div className="safe-area-home-indicator" />
        </SafeArea>
        <span className="inset-label inset-label-top">top</span>
        <span className="inset-label inset-label-bottom">bottom</span>
      </div>
    </div>
  );
}

function BottomSheetDemo() {
  return (
    <div className="demo-center">
      <BottomSheet>
        <BottomSheet.Trigger><DemoButton>Open bottom sheet</DemoButton></BottomSheet.Trigger>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <BottomSheet.Title>Choose a workspace</BottomSheet.Title>
            <BottomSheet.Description>Switch where your next note will be saved.</BottomSheet.Description>
          </BottomSheet.Header>
          <div className="sheet-options">
            {['Product', 'Personal', 'Research'].map((label, index) => <BottomSheet.Close key={label} className="sheet-option"><span className="sheet-option-mark">{label[0]}</span><span><strong>{label}</strong><small>{index + 3} collaborators</small></span>{index === 0 ? <Check size={17} /> : null}</BottomSheet.Close>)}
          </div>
        </BottomSheet.Content>
      </BottomSheet>
      <p className="demo-caption">Opens as a touch-first drawer with focus management and swipe dismissal.</p>
    </div>
  );
}

function ResponsiveDialogDemo() {
  return (
    <div className="demo-center">
      <ResponsiveDialog>
        <ResponsiveDialog.Trigger className="demo-button">Edit profile</ResponsiveDialog.Trigger>
        <ResponsiveDialog.Content>
          <ResponsiveDialog.Header>
            <ResponsiveDialog.Title>Edit profile</ResponsiveDialog.Title>
            <ResponsiveDialog.Description>This opens as a dialog here and a bottom sheet on smaller screens.</ResponsiveDialog.Description>
          </ResponsiveDialog.Header>
          <label className="demo-field"><span>Display name</span><input defaultValue="Alex Morgan" /></label>
          <div className="demo-dialog-actions">
            <ResponsiveDialog.Close className="demo-secondary-button">Cancel</ResponsiveDialog.Close>
            <ResponsiveDialog.Close className="demo-primary-button">Save changes</ResponsiveDialog.Close>
          </div>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
      <p className="demo-caption">Resize the browser to see the presentation change.</p>
    </div>
  );
}

function ActionSheetDemo() {
  return (
    <div className="demo-center">
      <ActionSheet>
        <ActionSheet.Trigger><DemoButton>Open actions</DemoButton></ActionSheet.Trigger>
        <ActionSheet.Content>
          <ActionSheet.Header>
            <ActionSheet.Title>Project actions</ActionSheet.Title>
            <ActionSheet.Description>Choose what to do with Mobile foundations.</ActionSheet.Description>
          </ActionSheet.Header>
          <ActionSheet.Group>
            <ActionSheet.Item><Share2 size={17} /> Share project</ActionSheet.Item>
            <ActionSheet.Item><MoreHorizontal size={17} /> More options</ActionSheet.Item>
            <ActionSheet.Item variant="destructive"><Trash2 size={17} /> Delete project</ActionSheet.Item>
          </ActionSheet.Group>
          <ActionSheet.Cancel>Cancel</ActionSheet.Cancel>
        </ActionSheet.Content>
      </ActionSheet>
      <p className="demo-caption">Grouped actions use comfortable, touch-sized targets.</p>
    </div>
  );
}

function NavigationBarDemo() {
  return (
    <DemoPhone className="demo-phone-short">
      <NavigationBar>
        <NavigationBar.Leading><NavigationBar.BackButton aria-label="Back"><ArrowLeft size={18} /></NavigationBar.BackButton></NavigationBar.Leading>
        <NavigationBar.Title>Project settings</NavigationBar.Title>
        <NavigationBar.Trailing><button className="demo-text-button">Done</button></NavigationBar.Trailing>
      </NavigationBar>
      <div className="demo-settings-body"><div /><div /><div /></div>
    </DemoPhone>
  );
}

function TabBarDemo() {
  const [active, setActive] = React.useState("Home");
  const items = [
    { label: "Home", icon: <Home size={20} /> },
    { label: "Search", icon: <Search size={20} /> },
    { label: "Updates", icon: <Bell size={20} />, badge: 3, badgeLabel: "3 unread updates" },
    { label: "Profile", icon: <User size={20} /> },
  ];
  return (
    <DemoPhone className="demo-phone-short tab-bar-demo-phone">
      <div className="tab-demo-content"><small>Selected destination</small><strong>{active}</strong></div>
      <TabBar>{items.map((item) => <TabBar.Item key={item.label} icon={item.icon} label={item.label} badge={item.badge} badgeLabel={item.badgeLabel} active={active === item.label} onClick={() => setActive(item.label)} />)}</TabBar>
    </DemoPhone>
  );
}

function KeyboardAvoidingViewDemo() {
  return (
    <DemoPhone className="demo-phone-tall composer-demo-phone">
      <KeyboardAvoidingView className="composer-demo">
        <div className="composer-thread">
          <span className="message received">Are the mobile components ready?</span>
          <span className="message sent">The first pass is. I’m checking keyboard behavior now.</span>
        </div>
        <div className="composer-bar">
          <label><span className="sr-only">Message</span><input placeholder="Write a message…" /></label>
          <button aria-label="Send message"><Send size={16} /></button>
        </div>
      </KeyboardAvoidingView>
    </DemoPhone>
  );
}

function InstallPromptDemo() {
  const [state, setState] = React.useState<"visible" | "installed" | "dismissed">("visible");

  if (state !== "visible") {
    return (
      <div className="demo-center">
        <p className="demo-caption">{state === "installed" ? "Install action selected." : "Prompt dismissed."}</p>
        <button className="demo-secondary-button" onClick={() => setState("visible")}>Show again</button>
      </div>
    );
  }

  return (
    <div className="prompt-demo">
      <InstallPrompt
        icon={<Download />}
        title="Install Field Notes"
        description="Open notes faster in a focused app window."
        onInstall={() => setState("installed")}
        onDismiss={() => setState("dismissed")}
      />
    </div>
  );
}

function UpdatePromptDemo() {
  const [updating, setUpdating] = React.useState(false);

  return (
    <div className="prompt-demo">
      <UpdatePrompt
        updating={updating}
        onUpdate={() => setUpdating(true)}
        onDismiss={() => setUpdating(false)}
      />
    </div>
  );
}

function OfflineBannerDemo() {
  const [visible, setVisible] = React.useState(true);

  return (
    <div className="offline-banner-demo">
      {visible ? <OfflineBanner action={<button onClick={() => setVisible(false)}>Retry</button>} /> : <p>Connection check requested.</p>}
      <div className="offline-banner-demo-body"><span /><span /><span /></div>
    </div>
  );
}

function ComponentDemo({ slug }: { slug: ComponentSlug }) {
  switch (slug) {
    case "pwa-provider": return <PWAProviderDemo />;
    case "app-shell": return <AppShellDemo />;
    case "safe-area": return <SafeAreaDemo />;
    case "bottom-sheet": return <BottomSheetDemo />;
    case "responsive-dialog": return <ResponsiveDialogDemo />;
    case "action-sheet": return <ActionSheetDemo />;
    case "navigation-bar": return <NavigationBarDemo />;
    case "tab-bar": return <TabBarDemo />;
    case "keyboard-avoiding-view": return <KeyboardAvoidingViewDemo />;
    case "install-prompt": return <InstallPromptDemo />;
    case "update-prompt": return <UpdatePromptDemo />;
    case "offline-banner": return <OfflineBannerDemo />;
  }
}

export function ExamplePanel({ slug, code }: { slug: ComponentSlug; code: string }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  return (
    <div className="example-panel">
      <div className="example-tabs" aria-label="Example view">
        <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>Preview</button>
        <button type="button" aria-pressed={tab === "code"} onClick={() => setTab("code")}>Code</button>
      </div>
      <div className="example-content">
        {tab === "preview" ? <div className="example-preview"><ComponentDemo slug={slug} /></div> : <div><CodeBlock code={code} compact /></div>}
      </div>
    </div>
  );
}
