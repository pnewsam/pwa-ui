"use client";

import * as React from "react";
import { BookOpen, ChevronRight, Home, Inbox, LoaderCircle, Plus, Settings, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";

import { AppShell } from "../../../../../registry/components/app-shell/app-shell";
import { BottomSheet } from "../../../../../registry/components/bottom-sheet/bottom-sheet";
import { InstallPrompt } from "../../../../../registry/components/install-prompt/install-prompt";
import { NavigationBar } from "../../../../../registry/components/navigation-bar/navigation-bar";
import { OfflineBanner } from "../../../../../registry/components/offline-banner/offline-banner";
import { PullToRefresh } from "../../../../../registry/components/pull-to-refresh/pull-to-refresh";
import { StackNavigator, type StackNavigatorEntry } from "../../../../../registry/components/stack-navigator/stack-navigator";
import { TabBar } from "../../../../../registry/components/tab-bar/tab-bar";
import { UpdatePrompt } from "../../../../../registry/components/update-prompt/update-prompt";
import { useHaptics } from "../../../../../registry/hooks/use-haptics";
import { useInstallPrompt } from "../../../../../registry/hooks/use-install-prompt";
import { useNetworkStatus } from "../../../../../registry/hooks/use-network-status";
import { useScrollRestoration } from "../../../../../registry/hooks/use-scroll-restoration";
import { useServiceWorkerUpdate } from "../../../../../registry/hooks/use-service-worker-update";

type DemoTab = "home" | "activity" | "settings";

type Project = {
  id: string;
  title: string;
  note: string;
  status: string;
};

const initialProjects: Project[] = [
  { id: "native-feel", title: "Native feel layer", note: "Navigation, physics, and tactile feedback", status: "In progress" },
  { id: "offline", title: "Offline states", note: "Clear feedback without blocking work", status: "Review" },
  { id: "install", title: "Install flow", note: "One honest path per platform", status: "Ready" },
  { id: "qa", title: "Device QA", note: "iOS and Android verification matrix", status: "Planned" },
  { id: "registry", title: "Registry release", note: "Copy source into a clean consumer", status: "Ready" },
];

function FeelCaption({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-muted/55 px-3 py-2 text-[0.7rem] leading-4 text-muted-foreground" href={href}>
      <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />
      <span>{children}</span>
      <ChevronRight aria-hidden="true" className="ml-auto size-3.5 shrink-0" />
    </Link>
  );
}

function ProjectList({ projects, refreshCount, onOpen, onRefresh }: {
  projects: Project[];
  refreshCount: number;
  onOpen: (project: Project) => void;
  onRefresh: () => Promise<void>;
}) {
  return (
    <PullToRefresh className="h-full" data-testid="demo-refresh" onRefresh={onRefresh}>
      <FeelCaption href="/components/pull-to-refresh">Pull from the top. The content follows your finger, then refreshes once.</FeelCaption>
      <div className="px-4 pb-3 pt-5">
        <p className="text-xs font-medium text-muted-foreground">{refreshCount ? `Refreshed ${refreshCount} time${refreshCount === 1 ? "" : "s"}` : "Today"}</p>
        <h1 className="mt-1 text-2xl font-medium tracking-[-0.035em]">Projects</h1>
      </div>
      <div className="space-y-2 px-3 pb-8">
        {projects.map((project) => (
          <button
            className="flex min-h-[4.75rem] w-full items-center gap-3 rounded-2xl border border-border/75 bg-background px-4 text-left shadow-[0_1px_1px_rgb(0_0_0/0.02)] transition-colors hover:bg-muted/45 focus-visible:ring-2 focus-visible:ring-ring"
            key={project.id}
            onClick={() => onOpen(project)}
            type="button"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-900 text-xs font-semibold text-white">{project.title.slice(0, 1)}</span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-medium">{project.title}</strong>
              <small className="mt-0.5 block truncate text-xs text-muted-foreground">{project.note}</small>
            </span>
            <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </PullToRefresh>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="min-h-full bg-background px-5 py-7">
      <FeelCaption href="/components/stack-navigator">This view pushed over the mounted list. Swipe from the left edge when installed.</FeelCaption>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{project.status}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-[-0.045em]">{project.title}</h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.note}. Return to the list and its scroll position and DOM state are still there.</p>
      <div className="mt-8 space-y-3">
        {["Interaction model", "Accessibility pass", "Device verification"].map((item, index) => (
          <div className="flex items-center gap-3 rounded-2xl bg-muted/65 p-4" key={item}>
            <span className="grid size-7 place-items-center rounded-full bg-background text-xs font-medium">{index + 1}</span>
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <>
      <FeelCaption href="/hooks/use-scroll-restoration">Switch tabs after scrolling. This view returns to the same position.</FeelCaption>
      <div className="px-4 pb-8 pt-5">
        <h1 className="text-2xl font-medium tracking-[-0.035em]">Activity</h1>
        <div className="mt-5 space-y-2">
          {Array.from({ length: 22 }, (_, index) => (
            <div className="flex min-h-16 items-center gap-3 rounded-2xl border border-border/70 bg-background p-3" key={index}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium">{index + 1}</span>
              <span><strong className="block text-sm font-medium">Project update</strong><small className="text-xs text-muted-foreground">Native-feel checkpoint {index + 1}</small></span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function InstallExperience() {
  const install = useInstallPrompt();

  if (install.promptType === "native") {
    return <InstallPrompt icon={<Plus />} installing={install.status === "prompting"} onInstall={() => { void install.prompt(); }} title="Install the demo" />;
  }
  if (install.promptType === "ios-manual") {
    return <InstallPrompt icon={<Plus />} mode="manual" title="Install the demo" />;
  }
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <strong className="text-sm font-medium">{install.isInstalled ? "Running as an installed app" : "Install prompt unavailable here"}</strong>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{install.isInstalled ? "The focused standalone window is active." : "Open this demo in a supported mobile browser to try its native or manual install path."}</p>
    </div>
  );
}

function NoteSheet() {
  const [title, setTitle] = React.useState("");

  return (
    <BottomSheet>
      <BottomSheet.Trigger className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 text-left text-sm font-medium">
        <span className="grid size-8 place-items-center rounded-xl bg-muted"><Plus className="size-4" /></span>
        New note
        <ChevronRight className="ml-auto size-4 text-muted-foreground" />
      </BottomSheet.Trigger>
      <BottomSheet.Content>
        <BottomSheet.Header>
          <BottomSheet.Title>New project note</BottomSheet.Title>
          <BottomSheet.Description>The sheet follows the software keyboard instead of covering the field.</BottomSheet.Description>
        </BottomSheet.Header>
        <label className="grid gap-2 text-sm font-medium">
          Note title
          <input className="min-h-12 rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring" onChange={(event) => setTitle(event.target.value)} placeholder="Device QA observations" value={title} />
        </label>
        <BottomSheet.Footer>
          <BottomSheet.Close className="min-h-11 rounded-xl border border-border bg-muted/65 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-offset-2">Cancel</BottomSheet.Close>
          <BottomSheet.Close className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">Save note</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
}

function SettingsTab() {
  return (
    <>
      <FeelCaption href="/components/bottom-sheet">Open the form to feel a keyboard-aware sheet composed from the same registry source.</FeelCaption>
      <div className="space-y-4 px-4 pb-8 pt-5">
        <div><p className="text-xs font-medium text-muted-foreground">Demo controls</p><h1 className="mt-1 text-2xl font-medium tracking-[-0.035em]">Settings</h1></div>
        <NoteSheet />
        <InstallExperience />
        <Link className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 text-sm font-medium" href="/guides/app-layout">
          <span className="grid size-8 place-items-center rounded-xl bg-muted"><BookOpen className="size-4" /></span>
          Read the composition guide
          <ChevronRight className="ml-auto size-4 text-muted-foreground" />
        </Link>
      </div>
    </>
  );
}

function UpdateExperience() {
  const update = useServiceWorkerUpdate({ scope: "/", checkOnMount: true });
  const [phase, setPhase] = React.useState<"idle" | "applying" | "handoff">("idle");
  const startedAtRef = React.useRef(0);
  const handoffTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const reloadTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (handoffTimerRef.current) clearTimeout(handoffTimerRef.current);
    if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
  }, []);

  React.useEffect(() => {
    if (phase === "idle" || update.status !== "updated") return;
    const elapsed = performance.now() - startedAtRef.current;
    reloadTimerRef.current = setTimeout(() => window.location.reload(), Math.max(0, 900 - elapsed));
    return () => {
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    };
  }, [phase, update.status]);

  function applyUpdate() {
    if (phase !== "idle") return;
    startedAtRef.current = performance.now();
    setPhase("applying");
    if (!update.applyUpdate()) {
      setPhase("idle");
      return;
    }
    handoffTimerRef.current = setTimeout(() => setPhase("handoff"), 420);
  }

  if (phase === "handoff") {
    return (
      <div className="absolute inset-0 z-[60] grid place-items-center bg-background px-8 text-center" data-testid="update-handoff" role="status" aria-live="polite">
        <div>
          <LoaderCircle aria-hidden="true" className="mx-auto size-7 animate-spin text-muted-foreground motion-reduce:animate-none" />
          <p className="mt-4 text-base font-medium">Updating PWA UI</p>
          <p className="mt-1 text-sm text-muted-foreground">Reopening with the latest version…</p>
        </div>
      </div>
    );
  }

  if (update.status !== "waiting" && update.status !== "activating" && phase === "idle") return null;
  return (
    <div className="absolute inset-x-3 bottom-3 z-40">
      <UpdatePrompt updating={phase === "applying" || update.status === "activating"} onUpdate={applyUpdate} />
    </div>
  );
}

export default function DemoPage() {
  const [tab, setTab] = React.useState<DemoTab>("home");
  const [selected, setSelected] = React.useState<Project | null>(null);
  const [projects, setProjects] = React.useState(initialProjects);
  const [refreshCount, setRefreshCount] = React.useState(0);
  const network = useNetworkStatus();
  const haptics = useHaptics();
  const { ref: tabScrollRef } = useScrollRestoration(`demo:${tab}`, { storage: "session" });

  async function refresh() {
    await new Promise((resolve) => setTimeout(resolve, 220));
    const next = refreshCount + 1;
    setRefreshCount(next);
    setProjects((current) => [{ id: `fresh-${next}`, title: `Fresh from refresh ${next}`, note: "New demo data arrived", status: "New" }, ...current]);
    haptics.success();
  }

  function selectTab(next: DemoTab) {
    if (next === tab) return;
    haptics.tap();
    setSelected(null);
    setTab(next);
  }

  const entries: StackNavigatorEntry[] = [
    {
      key: "projects",
      label: "Projects",
      content: <ProjectList onOpen={setSelected} onRefresh={refresh} projects={projects} refreshCount={refreshCount} />,
    },
    ...(selected ? [{ key: selected.id, label: selected.title, content: <ProjectDetail project={selected} /> }] : []),
  ];
  const title = selected ? selected.title : tab === "home" ? "PWA UI Demo" : tab === "activity" ? "Activity" : "Settings";

  return (
    <div className="relative h-full w-full sm:h-[min(52rem,calc(100dvh-3rem))] sm:max-w-[27rem] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-zinc-300 sm:shadow-[0_24px_80px_rgb(0_0_0/0.16)]" data-testid="demo-frame">
      <AppShell className="h-full bg-zinc-50">
        <AppShell.Header className="bg-background">
          {network.status === "offline" ? <OfflineBanner>Offline demo mode. Your current view still works.</OfflineBanner> : null}
          <NavigationBar>
            <NavigationBar.Leading>
              {selected ? <NavigationBar.BackButton aria-label="Back to projects" onClick={() => setSelected(null)} /> : <SlidersHorizontal aria-hidden="true" className="ml-3 size-4 text-muted-foreground" />}
            </NavigationBar.Leading>
            <NavigationBar.Title>{title}</NavigationBar.Title>
            <NavigationBar.Trailing><Link className="inline-flex min-h-11 items-center rounded-lg px-2 text-xs font-medium text-muted-foreground" href="/">Docs</Link></NavigationBar.Trailing>
          </NavigationBar>
        </AppShell.Header>
        <AppShell.Main className="overflow-hidden">
          {tab === "home" ? <StackNavigator backGesture="auto" entries={entries} onPop={() => setSelected(null)} /> : null}
          {tab === "home" ? null : (
            <section className="h-full overflow-y-auto" data-testid={`${tab}-scroll`} ref={tabScrollRef}>
              {tab === "activity" ? <ActivityTab /> : <SettingsTab />}
            </section>
          )}
        </AppShell.Main>
        <AppShell.Footer keyboardBehavior="hide" className="bg-background">
          <TabBar>
            <TabBar.Item active={tab === "home"} icon={<Home />} label="Home" onClick={() => selectTab("home")} />
            <TabBar.Item active={tab === "activity"} icon={<Inbox />} label="Activity" onClick={() => selectTab("activity")} />
            <TabBar.Item active={tab === "settings"} icon={<Settings />} label="Settings" onClick={() => selectTab("settings")} />
          </TabBar>
        </AppShell.Footer>
      </AppShell>
      <UpdateExperience />
    </div>
  );
}
