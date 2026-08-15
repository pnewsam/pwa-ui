import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActionSheet } from "../../../registry/components/action-sheet/action-sheet";
import { AppShell } from "../../../registry/components/app-shell/app-shell";
import { BottomSheet } from "../../../registry/components/bottom-sheet/bottom-sheet";
import { InstallPrompt } from "../../../registry/components/install-prompt/install-prompt";
import { OfflineBanner } from "../../../registry/components/offline-banner/offline-banner";
import { SafeArea } from "../../../registry/components/safe-area/safe-area";
import { TabBar } from "../../../registry/components/tab-bar/tab-bar";
import { UpdatePrompt } from "../../../registry/components/update-prompt/update-prompt";
import { CodeBlock } from "@/components/code-block";

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
        <AppShell.Footer>Footer</AppShell.Footer>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Header");
    expect(screen.getByRole("main")).toHaveTextContent("Content");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Footer");
  });

  it("applies only requested safe-area edges", () => {
    render(<SafeArea edges={["top", "bottom"]} data-testid="safe">Content</SafeArea>);
    const safeArea = screen.getByTestId("safe");

    expect(safeArea.style.paddingTop).toContain("--pwa-safe-top");
    expect(safeArea.style.paddingBottom).toContain("--pwa-safe-bottom");
    expect(safeArea.style.paddingLeft).toBe("");
  });

  it("marks the active tab semantically", () => {
    render(<TabBar><TabBar.Item icon={<span />} label="Home" active /></TabBar>);
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
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

  it("keeps installation behind an explicit action", async () => {
    const user = userEvent.setup();
    const onInstall = vi.fn();

    render(<InstallPrompt title="Install Field Notes" onInstall={onInstall} />);
    expect(screen.getByRole("region", { name: "Install Field Notes" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Install" }));
    expect(onInstall).toHaveBeenCalledOnce();
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
});
