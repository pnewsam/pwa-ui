import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ActionSheet } from "../../../registry/components/action-sheet/action-sheet";
import { AppShell } from "../../../registry/components/app-shell/app-shell";
import { BottomSheet } from "../../../registry/components/bottom-sheet/bottom-sheet";
import { InstallPrompt } from "../../../registry/components/install-prompt/install-prompt";
import { NavigationBar } from "../../../registry/components/navigation-bar/navigation-bar";
import { OfflineBanner } from "../../../registry/components/offline-banner/offline-banner";
import { PWAProvider } from "../../../registry/components/pwa-provider/pwa-provider";
import { PullToRefresh } from "../../../registry/components/pull-to-refresh/pull-to-refresh";
import { ResponsiveDialog } from "../../../registry/components/responsive-dialog/responsive-dialog";
import { SafeArea } from "../../../registry/components/safe-area/safe-area";
import { StackNavigator, useStackNavigator } from "../../../registry/components/stack-navigator/stack-navigator";
import { TabBar } from "../../../registry/components/tab-bar/tab-bar";
import { UpdatePrompt } from "../../../registry/components/update-prompt/update-prompt";
import { CodeBlock } from "@/components/code-block";

const defaultMatchMedia = window.matchMedia;

afterEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: defaultMatchMedia });
});

describe("PWA UI components", () => {
  it("syntax highlights code without changing its contents", () => {
    const code = 'const label: string = "Save";';
    const { container } = render(<CodeBlock code={code} language="tsx" />);

    expect(screen.getByText("const")).toHaveClass("token", "keyword");
    expect(container.querySelector("pre")).toHaveTextContent(code);
  });

  it("renders an application frame with semantic regions", () => {
    render(
      <AppShell>
        <AppShell.Header>Header</AppShell.Header>
        <AppShell.Main>Content</AppShell.Main>
        <AppShell.Footer keyboardBehavior="hide">Footer</AppShell.Footer>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Header");
    expect(screen.getByRole("main")).toHaveTextContent("Content");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Footer");
    expect(screen.getByRole("contentinfo")).toHaveAttribute("data-keyboard-behavior", "hide");
  });

  it("publishes shared viewport tokens and restores the document root", async () => {
    const view = render(<PWAProvider><span>Application</span></PWAProvider>);

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue("--pwa-viewport-height")).toBe(`${window.innerHeight}px`);
    });

    view.unmount();
    expect(document.documentElement.style.getPropertyValue("--pwa-viewport-height")).toBe("");
  });

  it("applies only requested safe-area edges", () => {
    render(<SafeArea edges={["top", "bottom"]} data-testid="safe">Content</SafeArea>);
    const safeArea = screen.getByTestId("safe");

    expect(safeArea.style.paddingTop).toContain("--pwa-safe-top");
    expect(safeArea.style.paddingBottom).toContain("--pwa-safe-bottom");
    expect(safeArea.style.paddingLeft).toBe("");
  });

  it("marks the active tab semantically", () => {
    render(<TabBar><TabBar.Item icon={<span />} label="Home" active className={({ active }) => active ? "consumer-active" : undefined} /></TabBar>);
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Home" })).toHaveClass("consumer-active");
  });

  it("passes props and events through both tab item variants", async () => {
    const user = userEvent.setup();
    const onAnchorClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const onButtonClick = vi.fn();

    render(
      <TabBar>
        <TabBar.Item href="/home" icon={<span />} label="Home" data-testid="home-tab" onClick={onAnchorClick} />
        <TabBar.Item icon={<span />} label="Search" data-testid="search-tab" onClick={onButtonClick} />
      </TabBar>,
    );

    await user.click(screen.getByTestId("home-tab"));
    await user.click(screen.getByTestId("search-tab"));

    expect(screen.getByTestId("home-tab")).toHaveAttribute("href", "/home");
    expect(onAnchorClick).toHaveBeenCalledOnce();
    expect(onButtonClick).toHaveBeenCalledOnce();
  });

  it("composes tab items with router links and forwards their ref", () => {
    function RouterLink({ to, ...props }: { to: string } & React.ComponentPropsWithRef<"a">) {
      return <a href={to} {...props} />;
    }

    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <TabBar>
        <TabBar.Item
          render={<RouterLink to="/updates" className="router-link" />}
          ref={ref}
          icon={<span />}
          label="Updates"
          badge={3}
          badgeLabel="3 unread updates"
        />
      </TabBar>,
    );

    const item = screen.getByRole("link", { name: "Updates, 3 unread updates" });
    expect(item).toHaveAttribute("href", "/updates");
    expect(item).toHaveClass("router-link");
    expect(ref.current).toBe(item);
  });

  it("composes the navigation back control with a router link", () => {
    function RouterLink({ to, ...props }: { to: string } & React.ComponentPropsWithRef<"a">) {
      return <a href={to} {...props} />;
    }

    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <NavigationBar>
        <NavigationBar.BackButton render={<RouterLink to="/settings" />} ref={ref} className={() => "consumer-back"} />
      </NavigationBar>,
    );

    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/settings");
    expect(backLink).toHaveClass("consumer-back");
    expect(ref.current).toBe(backLink);
  });

  it("identifies action sheet items for consistent styling", () => {
    const { unmount } = render(
      <ActionSheet defaultOpen>
        <ActionSheet.Content>
          <ActionSheet.Title>Actions</ActionSheet.Title>
          <ActionSheet.Item>Share project</ActionSheet.Item>
        </ActionSheet.Content>
      </ActionSheet>,
    );

    expect(screen.getByRole("button", { name: "Share project" })).toHaveAttribute("data-slot", "action-sheet-item");
    unmount();
  });

  it("opens a titled bottom sheet and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(
      <BottomSheet>
        <BottomSheet.Trigger>Open filters</BottomSheet.Trigger>
        <BottomSheet.Content>
          <BottomSheet.Title>Filters</BottomSheet.Title>
          <BottomSheet.Description>Narrow the results.</BottomSheet.Description>
        </BottomSheet.Content>
      </BottomSheet>,
    );

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    expect(await screen.findByRole("dialog")).toHaveAccessibleName("Filters");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("preserves functional class names on wrapped Base UI parts", () => {
    render(
      <BottomSheet>
        <BottomSheet.Trigger className={() => "consumer-trigger"}>Open</BottomSheet.Trigger>
      </BottomSheet>,
    );

    expect(screen.getByRole("button", { name: "Open" })).toHaveClass("consumer-trigger");
  });

  it("keeps installation behind an explicit action", async () => {
    const user = userEvent.setup();
    const onInstall = vi.fn();

    render(<InstallPrompt title="Install Field Notes" onInstall={onInstall} />);
    expect(screen.getByRole("region", { name: "Install Field Notes" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Install" }));
    expect(onInstall).toHaveBeenCalledOnce();
  });

  it("renders manual installation steps without an install action", () => {
    const view = render(<InstallPrompt mode="manual" title="Install Field Notes" />);
    const prompt = within(view.container);

    expect(prompt.getByRole("region", { name: "Install Field Notes" })).toHaveAttribute("data-mode", "manual");
    expect(prompt.getAllByRole("listitem")).toHaveLength(3);
    expect(prompt.queryByRole("button")).not.toBeInTheDocument();
  });

  it("announces an update without taking focus", () => {
    const view = render(<UpdatePrompt updating onUpdate={() => undefined} />);
    const prompt = within(view.container);
    expect(prompt.getByRole("status")).toHaveTextContent("Applying the update");
    expect(prompt.getByRole("button", { name: "Updating…" })).toBeDisabled();
  });

  it("renders offline feedback as a persistent status", () => {
    const view = render(<OfflineBanner action={<button>Retry</button>} />);
    const banner = within(view.container);
    expect(banner.getByRole("status")).toHaveTextContent("You're offline");
    expect(banner.getByRole("button", { name: "Retry" })).toBeVisible();
  });

  it("refreshes exactly once after an armed pull and retracts when it settles", async () => {
    let settleRefresh!: () => void;
    const onRefresh = vi.fn(() => new Promise<void>((resolve) => {
      settleRefresh = resolve;
    }));
    const view = render(<PullToRefresh data-testid="pull-region" onRefresh={onRefresh}>Content</PullToRefresh>);

    const region = within(view.container).getByTestId("pull-region");
    region.scrollTop = 0;
    fireEvent.pointerDown(region, { pointerId: 1, pointerType: "touch", clientX: 20, clientY: 20 });
    fireEvent.pointerMove(region, { pointerId: 1, pointerType: "touch", clientX: 20, clientY: 180 });
    expect(region).toHaveAttribute("data-state", "armed");
    fireEvent.pointerUp(region, { pointerId: 1, pointerType: "touch", clientX: 20, clientY: 180 });

    expect(onRefresh).toHaveBeenCalledOnce();
    expect(region).toHaveAttribute("data-state", "refreshing");
    settleRefresh();
    await waitFor(() => expect(region).toHaveAttribute("data-state", "idle"));
    expect(region.style.getPropertyValue("--pwa-pull-distance")).toBe("0px");
  });

  it("leaves refresh and native scrolling untouched when a pull is not armed", () => {
    const onRefresh = vi.fn();
    const view = render(<PullToRefresh data-testid="pull-region" onRefresh={onRefresh}>Content</PullToRefresh>);

    const region = within(view.container).getByTestId("pull-region");
    region.scrollTop = 40;
    fireEvent.pointerDown(region, { pointerId: 2, pointerType: "touch", clientX: 20, clientY: 20 });
    const moved = fireEvent.pointerMove(region, { pointerId: 2, pointerType: "touch", clientX: 20, clientY: 160 });
    fireEvent.pointerUp(region, { pointerId: 2, pointerType: "touch", clientX: 20, clientY: 160 });

    expect(moved).toBe(true);
    expect(onRefresh).not.toHaveBeenCalled();
    expect(region).toHaveAttribute("data-state", "idle");
  });

  it("keeps covered stack views mounted and restores focus when they are revealed", async () => {
    const user = userEvent.setup();
    const popped = vi.fn();

    function Detail() {
      const { depth, canPop, pop } = useStackNavigator();
      return <div><span>Depth {depth}</span><button data-autofocus onClick={pop}>Back</button><span>{canPop ? "Can pop" : "Root"}</span></div>;
    }

    function StackTest() {
      const [showDetail, setShowDetail] = React.useState(false);
      const entries = [
        {
          key: "list",
          label: "Projects",
          content: <div><input aria-label="Draft" /><button onClick={() => setShowDetail(true)}>Open project</button></div>,
        },
        ...(showDetail ? [{ key: "detail", label: "Project detail", content: <Detail /> }] : []),
      ];

      return <StackNavigator entries={entries} onPop={(key) => { popped(key); setShowDetail(false); }} />;
    }

    const view = render(<div className="h-80"><StackTest /></div>);
    const scope = within(view.container);
    const input = scope.getByRole("textbox", { name: "Draft" });
    const listView = view.container.querySelector<HTMLElement>('[data-view-key="list"]')!;
    listView.scrollTop = 96;
    await user.type(input, "Preserved draft");

    const trigger = scope.getByRole("button", { name: "Open project" });
    await user.click(trigger);
    const detailView = view.container.querySelector<HTMLElement>('[data-view-key="detail"]')!;
    await waitFor(() => expect(detailView).not.toHaveAttribute("data-entering"));
    expect(listView).toHaveAttribute("inert");
    expect(listView).toHaveAttribute("aria-hidden", "true");
    expect(scope.getByRole("button", { name: "Back" })).toHaveFocus();

    await user.click(scope.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(listView).not.toHaveAttribute("inert"));
    expect(popped).toHaveBeenCalledWith("detail");
    expect(input).toHaveValue("Preserved draft");
    expect(listView.scrollTop).toBe(96);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("animates only the top view when the controlled stack changes by multiple entries", async () => {
    const root = { key: "root", content: <span>Root</span> };
    const second = { key: "second", content: <span>Second</span> };
    const third = { key: "third", content: <span>Third</span> };
    const view = render(<StackNavigator entries={[root]} onPop={() => undefined} />);

    view.rerender(<StackNavigator entries={[root, second, third]} onPop={() => undefined} />);
    await waitFor(() => expect(view.container.querySelectorAll('[data-slot="stack-view"]')).toHaveLength(3));
    expect(view.container.querySelector('[data-view-key="third"]')).toHaveAttribute("data-entering");
    expect(view.container.querySelector('[data-view-key="second"]')).not.toHaveAttribute("data-entering");

    view.rerender(<StackNavigator entries={[root]} onPop={() => undefined} />);
    await waitFor(() => expect(view.container.querySelector('[data-view-key="second"]')).not.toBeInTheDocument());
    await waitFor(() => expect(view.container.querySelector('[data-view-key="third"]')).toHaveAttribute("data-exiting"));
  });

  it("tracks a back gesture with CSS variables without rendering on pointer moves", async () => {
    let detailRenders = 0;
    function Detail() {
      detailRenders += 1;
      return <span>Detail</span>;
    }

    const view = render(
      <StackNavigator
        backGesture="on"
        entries={[
          { key: "root", content: <span>Root</span> },
          { key: "detail", content: <Detail /> },
        ]}
        onPop={() => undefined}
      />,
    );
    const root = view.container.querySelector<HTMLElement>('[data-slot="stack-navigator"]')!;
    Object.defineProperty(root, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ x: 0, y: 0, left: 0, top: 0, right: 320, bottom: 480, width: 320, height: 480, toJSON: () => ({}) }),
    });
    Object.defineProperty(root, "setPointerCapture", { configurable: true, value: () => undefined });
    Object.defineProperty(root, "hasPointerCapture", { configurable: true, value: () => false });
    const initialRenders = detailRenders;

    fireEvent.pointerDown(root, { pointerId: 9, pointerType: "touch", clientX: 4, clientY: 120 });
    fireEvent.pointerMove(root, { pointerId: 9, pointerType: "touch", clientX: 70, clientY: 122 });
    fireEvent.pointerMove(root, { pointerId: 9, pointerType: "touch", clientX: 120, clientY: 124 });

    await waitFor(() => expect(Number(root.style.getPropertyValue("--pwa-stack-swipe-progress"))).toBeGreaterThan(0));
    expect(root).toHaveAttribute("data-back-gesture-state", "tracking");
    expect(detailRenders).toBe(initialRenders);

    fireEvent.pointerCancel(root, { pointerId: 9, pointerType: "touch", clientX: 120, clientY: 124 });
    await waitFor(() => expect(root).toHaveAttribute("data-back-gesture-state", "idle"));
  });

  it("keeps automatic back gestures disabled in a browser tab", async () => {
    const view = render(
      <StackNavigator
        entries={[{ key: "root", content: <span>Root</span> }, { key: "detail", content: <span>Detail</span> }]}
        onPop={() => undefined}
      />,
    );
    const root = view.container.querySelector<HTMLElement>('[data-slot="stack-navigator"]')!;

    await waitFor(() => expect(root).toHaveAttribute("data-back-gesture-enabled", "false"));
    fireEvent.pointerDown(root, { pointerId: 10, pointerType: "touch", clientX: 2, clientY: 80 });
    fireEvent.pointerMove(root, { pointerId: 10, pointerType: "touch", clientX: 180, clientY: 82 });
    expect(root).toHaveAttribute("data-back-gesture-state", "idle");
  });

  it("enables automatic back gestures in standalone display mode", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => ({
        matches: query === "(display-mode: standalone)",
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });
    const view = render(
      <StackNavigator
        entries={[{ key: "root", content: <span>Root</span> }, { key: "detail", content: <span>Detail</span> }]}
        onPop={() => undefined}
      />,
    );
    const root = view.container.querySelector<HTMLElement>('[data-slot="stack-navigator"]')!;

    await waitFor(() => expect(root).toHaveAttribute("data-back-gesture-enabled", "true"));
  });

  it("renders the responsive dialog in its mobile presentation below the breakpoint", () => {
    const breakpoint = "(max-width: 47.999rem)";
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => ({
        matches: query === breakpoint,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });

    const { unmount } = render(
      <ResponsiveDialog defaultOpen breakpoint={breakpoint}>
        <ResponsiveDialog.Content>
          <ResponsiveDialog.Title>Edit profile</ResponsiveDialog.Title>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("data-slot", "bottom-sheet-content");
    unmount();
  });

  it("renders the responsive dialog as a dialog above the breakpoint", () => {
    const { unmount } = render(
      <ResponsiveDialog defaultOpen>
        <ResponsiveDialog.Content>
          <ResponsiveDialog.Title>Edit profile</ResponsiveDialog.Title>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("data-slot", "responsive-dialog-content");
    unmount();
  });
});
