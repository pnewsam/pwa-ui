"use client";

import * as React from "react";
import {
  Bell,
  ChevronRight,
  Compass,
  Copy,
  Home,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  Share2,
  Trash2,
  User,
} from "lucide-react";

import { ActionSheet } from "../../../../registry/components/action-sheet/action-sheet";
import { AppShell } from "../../../../registry/components/app-shell/app-shell";
import { BottomSheet } from "../../../../registry/components/bottom-sheet/bottom-sheet";
import { KeyboardAvoidingView } from "../../../../registry/components/keyboard-avoiding-view/keyboard-avoiding-view";
import { NavigationBar } from "../../../../registry/components/navigation-bar/navigation-bar";
import { ResponsiveDialog } from "../../../../registry/components/responsive-dialog/responsive-dialog";
import { SafeArea } from "../../../../registry/components/safe-area/safe-area";
import { TabBar } from "../../../../registry/components/tab-bar/tab-bar";

const components = [
  ["app-shell", "AppShell", "A dynamic-viewport frame that keeps app chrome fixed while content scrolls independently."],
  ["safe-area", "SafeArea", "Explicit inset padding powered by CSS environment variables, never device detection."],
  ["bottom-sheet", "BottomSheet", "Base UI Drawer composition with swipe dismissal, focus management, snap points, and keyboard handling."],
  ["responsive-dialog", "ResponsiveDialog", "One stateful content tree that becomes a dialog on wide screens and a sheet on narrow ones."],
  ["action-sheet", "ActionSheet", "Large, grouped, touch-first actions with destructive and cancel treatments."],
  ["navigation-bar", "NavigationBar", "Safe-area-aware top chrome with a title that remains optically centered."],
  ["tab-bar", "TabBar", "Router-agnostic bottom navigation with active state, labels, and badges."],
  ["keyboard-avoiding-view", "KeyboardAvoidingView", "A focused Visual Viewport solution for forms and fixed composers outside drawers."],
] as const;

const triggerClass = "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#171918] px-4 text-sm font-semibold text-white outline-none transition hover:bg-[#2b2f2c] focus-visible:ring-2 focus-visible:ring-[#7357ff] focus-visible:ring-offset-2 active:scale-[0.98]";
const secondaryClass = "inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#171918] outline-none transition hover:bg-black/[0.04] focus-visible:ring-2 focus-visible:ring-[#7357ff]";

export function ComponentShowcase() {
  return (
    <>
      <section className="demo-gallery" aria-labelledby="composed-title">
        <div className="demo-gallery-heading">
          <p className="section-number">01 / COMPOSED</p>
          <h2 id="composed-title">Application behavior,<br />not isolated decoration.</h2>
          <p>Resize the page, use the keyboard, open every overlay, and scroll each app surface independently.</p>
        </div>
        <div className="demo-grid">
          <SettingsDemo />
          <FormDemo />
          <FeedDemo />
        </div>
      </section>

      <section className="component-index" aria-labelledby="index-title">
        <div className="component-index-heading">
          <p className="section-number">02 / REGISTRY</p>
          <h2 id="index-title">Install only what the screen needs.</h2>
          <p>Every item includes its explicit source and dependencies. Once copied, it belongs to your application.</p>
        </div>
        <div className="component-list">
          {components.map(([slug, name, description], index) => (
            <article id={slug} key={slug} className="component-row">
              <span className="component-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{name}</h3><p>{description}</p></div>
              <code>pnpm dlx shadcn@latest add &lt;registry&gt;/{slug}</code>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function DemoFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="demo-column">
      <div className="demo-label"><span>LIVE</span>{title}</div>
      <div className="demo-device">{children}</div>
    </article>
  );
}

function SettingsDemo() {
  const [active, setActive] = React.useState("settings");
  return (
    <DemoFrame title="Settings application">
      <AppShell className="h-full min-h-0 bg-[#f7f8f4] text-[#171918]">
        <AppShell.Header>
          <NavigationBar className="border-black/8 bg-[#f7f8f4]/90">
            <NavigationBar.Leading><NavigationBar.BackButton aria-label="Go back" /></NavigationBar.Leading>
            <NavigationBar.Title>Settings</NavigationBar.Title>
            <NavigationBar.Trailing><button className="min-h-11 px-2 text-xs font-semibold text-[#7357ff]">Done</button></NavigationBar.Trailing>
          </NavigationBar>
        </AppShell.Header>
        <AppShell.Main className="px-4 py-5">
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#171918] p-4 text-white">
            <span className="grid size-11 place-items-center rounded-full bg-[#7357ff] text-xs font-bold">PN</span>
            <div><strong className="block text-sm">Paul Newsam</strong><span className="text-[0.65rem] text-white/55">PWA UI workspace</span></div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
            <SettingRow icon={<Bell size={16} />} label="Notifications" />
            <ResponsiveDialog>
              <ResponsiveDialog.Trigger className="flex min-h-14 w-full items-center gap-3 border-b border-black/8 px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7357ff]">
                <span className="grid size-8 place-items-center rounded-lg bg-[#e9e5ff] text-[#7357ff]"><User size={16} /></span>
                <span className="flex-1 text-xs font-medium">Profile</span><ChevronRight size={15} className="text-black/30" />
              </ResponsiveDialog.Trigger>
              <ResponsiveDialog.Content>
                <ResponsiveDialog.Header>
                  <ResponsiveDialog.Title>Edit profile</ResponsiveDialog.Title>
                  <ResponsiveDialog.Description>The same content becomes a centered dialog on wider screens.</ResponsiveDialog.Description>
                </ResponsiveDialog.Header>
                <label className="grid gap-1.5 text-sm font-medium">Display name<input className="h-11 rounded-xl border border-black/15 bg-white px-3 outline-none focus:ring-2 focus:ring-[#7357ff]" defaultValue="Paul Newsam" /></label>
                <ResponsiveDialog.Close className={`${triggerClass} mt-5 w-full`}>Save changes</ResponsiveDialog.Close>
              </ResponsiveDialog.Content>
            </ResponsiveDialog>
            <ActionSheet>
              <ActionSheet.Trigger className="flex min-h-14 w-full items-center gap-3 px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7357ff]">
                <span className="grid size-8 place-items-center rounded-lg bg-[#e8ffd1] text-[#3e6b0a]"><MoreHorizontal size={16} /></span>
                <span className="flex-1 text-xs font-medium">Workspace actions</span><ChevronRight size={15} className="text-black/30" />
              </ActionSheet.Trigger>
              <ActionSheet.Content>
                <ActionSheet.Header className="px-2"><ActionSheet.Title>Workspace actions</ActionSheet.Title><ActionSheet.Description>Choose an action for PWA UI.</ActionSheet.Description></ActionSheet.Header>
                <ActionSheet.Group><ActionSheet.Item><Share2 size={17} className="mr-2" />Share</ActionSheet.Item><ActionSheet.Item><Copy size={17} className="mr-2" />Duplicate</ActionSheet.Item></ActionSheet.Group>
                <ActionSheet.Group><ActionSheet.Item variant="destructive"><Trash2 size={17} className="mr-2" />Delete workspace</ActionSheet.Item></ActionSheet.Group>
                <ActionSheet.Cancel>Cancel</ActionSheet.Cancel>
              </ActionSheet.Content>
            </ActionSheet>
          </div>
        </AppShell.Main>
        <AppShell.Footer>
          <TabBar className="border-black/8 bg-white/92">
            <TabBar.Item icon={<Home size={18} />} label="Home" active={active === "home"} onClick={() => setActive("home")} />
            <TabBar.Item icon={<Search size={18} />} label="Browse" active={active === "search"} onClick={() => setActive("search")} />
            <TabBar.Item icon={<Settings size={18} />} label="Settings" active={active === "settings"} onClick={() => setActive("settings")} />
          </TabBar>
        </AppShell.Footer>
      </AppShell>
    </DemoFrame>
  );
}

function FormDemo() {
  return (
    <DemoFrame title="Mobile form">
      <AppShell className="h-full min-h-0 bg-[#171918] text-white">
        <AppShell.Header><NavigationBar className="border-white/10 bg-[#171918]/92"><NavigationBar.Leading><NavigationBar.BackButton aria-label="Close form" /></NavigationBar.Leading><NavigationBar.Title>New message</NavigationBar.Title><NavigationBar.Trailing /></NavigationBar></AppShell.Header>
        <AppShell.Main>
          <KeyboardAvoidingView className="flex min-h-full flex-col px-4 py-5">
            <div className="mb-auto">
              <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#c9ff3d] text-[#171918]"><MessageCircle size={22} /></span>
              <h3 className="text-2xl font-semibold tracking-[-0.05em]">Start with a clear thought.</h3>
              <p className="mt-2 text-xs leading-5 text-white/55">Visual Viewport values are exposed as CSS variables when the software keyboard opens.</p>
            </div>
            <BottomSheet>
              <BottomSheet.Trigger className={`${secondaryClass} mt-5 w-full`}>Open form sheet</BottomSheet.Trigger>
              <BottomSheet.Content>
                <BottomSheet.Header><BottomSheet.Title>Compose message</BottomSheet.Title><BottomSheet.Description>Base UI’s keyboard provider keeps focused fields visible.</BottomSheet.Description></BottomSheet.Header>
                <form className="grid gap-4">
                  <label className="grid gap-1.5 text-sm font-medium">Recipient<input className="h-11 rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="name@example.com" /></label>
                  <label className="grid gap-1.5 text-sm font-medium">Message<textarea className="min-h-28 rounded-xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-ring" placeholder="Write something useful…" /></label>
                  <BottomSheet.Close className={triggerClass}>Send message</BottomSheet.Close>
                </form>
              </BottomSheet.Content>
            </BottomSheet>
          </KeyboardAvoidingView>
        </AppShell.Main>
      </AppShell>
    </DemoFrame>
  );
}

function FeedDemo() {
  return (
    <DemoFrame title="Content feed">
      <AppShell className="h-full min-h-0 bg-[#f7f8f4] text-[#171918]">
        <AppShell.Header><NavigationBar className="border-black/8 bg-[#f7f8f4]/92"><NavigationBar.Leading><Compass size={18} /></NavigationBar.Leading><NavigationBar.Title>Field notes</NavigationBar.Title><NavigationBar.Trailing><button aria-label="Search" className="grid min-h-11 min-w-11 place-items-center"><Search size={18} /></button></NavigationBar.Trailing></NavigationBar></AppShell.Header>
        <AppShell.Main className="px-4 py-4">
          <SafeArea edges={["left", "right"]}>
            <FeedCard color="bg-[#c9ff3d]" label="Platform" title="The browser already knows more than we ask it." />
            <FeedCard color="bg-[#e9e5ff]" label="Interaction" title="A bottom sheet should feel anchored, not animated in." />
            <FeedCard color="bg-[#dff4ff]" label="Viewport" title="100vh was never the whole story on a phone." />
          </SafeArea>
        </AppShell.Main>
        <AppShell.Footer><TabBar className="border-black/8 bg-white/92"><TabBar.Item icon={<Home size={18} />} label="Today" active /><TabBar.Item icon={<ImageIcon size={18} />} label="Library" badge={3} /><TabBar.Item icon={<User size={18} />} label="Profile" /></TabBar></AppShell.Footer>
      </AppShell>
    </DemoFrame>
  );
}

function SettingRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button className="flex min-h-14 w-full items-center gap-3 border-b border-black/8 px-3 text-left"><span className="grid size-8 place-items-center rounded-lg bg-[#e8ffd1] text-[#3e6b0a]">{icon}</span><span className="flex-1 text-xs font-medium">{label}</span><ChevronRight size={15} className="text-black/30" /></button>;
}

function FeedCard({ color, label, title }: { color: string; label: string; title: string }) {
  return <article className="mb-3 overflow-hidden rounded-2xl border border-black/8 bg-white"><div className={`h-20 ${color}`} /><div className="p-4"><span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-black/40">{label}</span><h3 className="mt-2 text-base font-semibold leading-5 tracking-[-0.035em]">{title}</h3><button className="mt-3 flex min-h-11 items-center gap-2 text-xs font-semibold">Read note <ChevronRight size={14} /></button></div></article>;
}
