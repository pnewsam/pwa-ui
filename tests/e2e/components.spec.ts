import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => console.error(`PAGE ERROR: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") console.error(`BROWSER ERROR: ${message.text()}`);
  });
});

test("renders the documentation index with component and hook links", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Build mobile web apps/ })).toBeVisible();
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "App layout", exact: true })).toBeVisible();
  for (const name of ["PWAProvider", "AppShell", "SafeArea", "BottomSheet", "ResponsiveDialog", "ActionSheet", "NavigationBar", "TabBar", "KeyboardAvoidingView", "InstallPrompt", "UpdatePrompt", "OfflineBanner"]) {
    await expect(page.getByRole("link", { name, exact: true }).first()).toBeVisible();
  }
  for (const name of ["useDisplayMode", "useVisualViewport", "useMediaQuery", "useInstallPrompt", "useServiceWorkerUpdate", "useNetworkStatus", "usePageVisibility"]) {
    await expect(page.getByRole("link", { name, exact: true }).first()).toBeVisible();
  }
});

test("keeps application chrome anchored while AppShell.Main scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/test-fixtures/app-shell");

  await expect(page.locator("html")).toHaveAttribute("data-pwa-app-root", "");

  const mount = page.getByTestId("app-mount");
  const main = page.getByTestId("app-scroll-region");
  const tabBar = page.getByRole("navigation", { name: "Primary" });

  const containment = await page.evaluate(() => {
    const mountElement = document.querySelector<HTMLElement>("[data-pwa-app-mount]");
    return {
      htmlOverflow: getComputedStyle(document.documentElement).overflow,
      bodyOverflow: getComputedStyle(document.body).overflow,
      mountOverflow: mountElement ? getComputedStyle(mountElement).overflow : null,
    };
  });

  expect(containment).toEqual({ htmlOverflow: "hidden", bodyOverflow: "hidden", mountOverflow: "hidden" });
  await expect(mount).toHaveCSS("height", "844px");

  const initialTabBarBox = await tabBar.boundingBox();
  expect(initialTabBarBox).not.toBeNull();

  const scrollState = await main.evaluate((element) => {
    element.scrollTop = 500;
    return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
  });

  expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.clientHeight);
  expect(scrollState.scrollTop).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  const finalTabBarBox = await tabBar.boundingBox();
  expect(finalTabBarBox?.y).toBe(initialTabBarBox?.y);
});

test("clips every phone example to its simulated device corners", async ({ page }) => {
  for (const path of ["/components/app-shell", "/components/stack-navigator", "/components/navigation-bar", "/components/tab-bar", "/components/keyboard-avoiding-view"]) {
    await page.goto(path);

    const frame = page.locator(".demo-phone");
    const viewport = frame.locator(".demo-phone-viewport");

    await expect(frame).toHaveCSS("border-radius", "25px");
    await expect(viewport).toHaveCSS("border-radius", "24px");
    await expect(viewport).toHaveCSS("overflow", "hidden");
  }
});

test("has no automatically detectable accessibility violations on core surfaces", async ({ page }) => {
  for (const path of ["/", "/guides/app-layout", "/components/tab-bar", "/hooks/use-display-mode", "/resources/browser-support"]) {
    await expect(async () => {
      await page.goto(path);
      expect(new URL(page.url()).pathname).toBe(path);
    }).toPass();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }))).toEqual([]);
  }

  await page.goto("/components/bottom-sheet");
  await page.getByRole("button", { name: "Open bottom sheet" }).click();
  await expect(page.getByRole("dialog", { name: "Choose a workspace" })).toBeVisible();
  const overlayResults = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
  expect(overlayResults.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }))).toEqual([]);
});

test("documents installable hook usage and source", async ({ page }) => {
  await page.goto("/hooks/use-display-mode");
  await expect(page.getByRole("heading", { name: "useDisplayMode", exact: true })).toBeVisible();
  await expect(page.locator("#installation").getByText("pnpm dlx shadcn@latest add https://pwaui.com/r/use-display-mode.json")).toBeVisible();

  await page.locator("#installation").getByRole("button", { name: "Manual", exact: true }).click();
  await expect(page.locator("#installation").getByText("Copy and paste the hook into your project.")).toBeVisible();
  await expect(page.locator("#installation").getByRole("button", { name: "Copy hooks/use-display-mode.ts" })).toBeVisible();
});

test("documents the priority-one install prompt composition", async ({ page }) => {
  await page.goto("/components/install-prompt");
  await expect(page.getByRole("heading", { name: "InstallPrompt", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Install Field Notes" })).toBeVisible();
  await page.getByRole("button", { name: "Install", exact: true }).click();
  await expect(page.getByText("Install action selected.")).toBeVisible();

  const installation = page.locator("#installation");
  await installation.getByRole("button", { name: "Manual", exact: true }).click();
  await installation.getByRole("button", { name: "hooks/use-install-prompt.ts", exact: true }).click();
  await expect(installation.getByRole("button", { name: "Copy hooks/use-install-prompt.ts" })).toBeVisible();
});

test("offers the manual install path only where the browser has no install prompt", async ({ page }) => {
  await page.goto("/test-fixtures/install-prompt");

  const onIOS = await page.evaluate(() => /iPad|iPhone|iPod/.test(navigator.userAgent));
  const promptType = page.getByTestId("prompt-type");
  const manualPrompt = page.getByRole("region", { name: "Install Field Notes" });

  if (!onIOS) {
    await expect(promptType).not.toHaveText("ios-manual");
    await expect(page.getByRole("list")).toHaveCount(0);
    return;
  }

  await expect(promptType).toHaveText("ios-manual");
  await expect(manualPrompt).toHaveAttribute("data-mode", "manual");
  await expect(manualPrompt.getByRole("listitem")).toHaveCount(3);
  await expect(manualPrompt.getByRole("button")).toHaveCount(0);

  const results = await new AxeBuilder({ page }).include('[data-slot="install-prompt"]').analyze();
  expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }))).toEqual([]);
});

test("arms pull-to-refresh at the top and refreshes exactly once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/test-fixtures/pull-to-refresh");
  const region = page.getByTestId("pull-region");
  await page.getByTestId("hydration-ready").click();
  await expect(region).toHaveAttribute("data-ready", "true");

  await region.dispatchEvent("pointerdown", { pointerId: 1, pointerType: "touch", clientX: 30, clientY: 40 });
  await region.dispatchEvent("pointermove", { pointerId: 1, pointerType: "touch", clientX: 30, clientY: 210 });
  await expect(region).toHaveAttribute("data-state", "armed");
  await region.dispatchEvent("pointerup", { pointerId: 1, pointerType: "touch", clientX: 30, clientY: 210 });

  await expect(region).toHaveAttribute("data-state", "refreshing");
  await expect(region.locator('[data-slot="pull-to-refresh-indicator"] [aria-hidden="true"]')).toHaveCSS("animation-name", "none");
  await expect(page.getByTestId("refresh-count")).toHaveText("Refreshes: 1");
  await expect(region).toHaveAttribute("data-state", "idle");

  await region.evaluate((element) => { element.scrollTop = 80; });
  await region.dispatchEvent("pointerdown", { pointerId: 2, pointerType: "touch", clientX: 30, clientY: 40 });
  await region.dispatchEvent("pointermove", { pointerId: 2, pointerType: "touch", clientX: 30, clientY: 210 });
  await region.dispatchEvent("pointerup", { pointerId: 2, pointerType: "touch", clientX: 30, clientY: 210 });
  await expect(page.getByTestId("refresh-count")).toHaveText("Refreshes: 1");
});

test("restores each tab's scroll position", async ({ page }) => {
  await page.goto("/test-fixtures/scroll-restoration");
  const scroller = page.getByTestId("tab-scroller");

  await page.getByRole("button", { name: "Saved" }).click();
  await page.getByRole("button", { name: "Feed" }).click();

  await scroller.evaluate((element) => {
    element.scrollTop = 240;
    element.dispatchEvent(new Event("scroll"));
  });
  await page.getByRole("button", { name: "Saved" }).click();
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBe(0);

  await scroller.evaluate((element) => {
    element.scrollTop = 128;
    element.dispatchEvent(new Event("scroll"));
  });
  await page.getByRole("button", { name: "Feed" }).click();
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThanOrEqual(239);
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeLessThanOrEqual(241);
});

test("communicates the haptics no-op when vibration is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "vibrate", { configurable: true, value: undefined });
  });
  await page.goto("/hooks/use-haptics");

  await expect(page.getByRole("heading", { name: "useHaptics", exact: true })).toBeVisible();
  await expect(page.getByText("Unavailable here", { exact: true })).toBeVisible();
  await expect(page.getByText("This browser has no vibration capability, so every preset is a safe no-op.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Tap" })).toBeDisabled();
});

test("preserves covered stack state, scroll, inertness, and focus", async ({ page }) => {
  await page.goto("/test-fixtures/stack-navigator");
  const listView = page.locator('[data-view-key="projects"]');
  const trigger = page.getByRole("button", { name: "Open project" });

  await page.getByRole("textbox", { name: "Project draft" }).fill("Preserved draft");
  await listView.evaluate((element) => { element.scrollTop = 180; });
  await trigger.click();

  const detailView = page.locator('[data-view-key="project-detail"]');
  await expect(detailView).not.toHaveAttribute("data-entering", "");
  await expect(listView).toHaveAttribute("inert", "");
  await expect(listView).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("button", { name: "Back to projects" })).toBeFocused();

  await page.getByRole("button", { name: "Back to projects" }).click();
  await expect(listView).not.toHaveAttribute("inert", "");
  await expect(page.getByRole("textbox", { name: "Project draft" })).toHaveValue("Preserved draft");
  await expect.poll(() => listView.evaluate((element) => element.scrollTop)).toBe(180);
  await expect(trigger).toBeFocused();
});

test("uses the View Transitions enhancement when the platform exposes it", async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.set(window, "__pwaViewTransitionCalls", 0);
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (update: () => void | Promise<void>) => {
        Reflect.set(window, "__pwaViewTransitionCalls", Number(Reflect.get(window, "__pwaViewTransitionCalls")) + 1);
        return { finished: Promise.resolve().then(update) };
      },
    });
  });
  await page.goto("/test-fixtures/stack-navigator");
  await page.getByRole("button", { name: "Open project" }).click();

  await expect(page.locator('[data-slot="stack-navigator"]')).toHaveAttribute("data-transition-mode", "view");
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "__pwaViewTransitionCalls"))).toBe(1);
  await expect(page.getByRole("button", { name: "Back to projects" })).toBeFocused();
});

test("uses the CSS stack fallback without View Transitions", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: undefined });
  });
  await page.goto("/test-fixtures/stack-navigator");
  await page.getByRole("button", { name: "Open project" }).click();

  const stack = page.locator('[data-slot="stack-navigator"]');
  const detail = page.locator('[data-view-key="project-detail"]');
  await expect(stack).toHaveAttribute("data-transition-mode", "fallback");
  await expect(detail).not.toHaveAttribute("data-entering", "");
  await expect(page.getByRole("button", { name: "Back to projects" })).toBeFocused();
});

test("removes stack motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/test-fixtures/stack-navigator");
  await page.getByRole("button", { name: "Open project" }).click();

  const stack = page.locator('[data-slot="stack-navigator"]');
  const detail = page.locator('[data-view-key="project-detail"]');
  await expect(stack).toHaveAttribute("data-transition-mode", "reduced");
  await expect.poll(() => detail.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(0.001);
  await expect(page.getByRole("button", { name: "Back to projects" })).toBeFocused();
});

test("documents the controlled stack and NavigationBar composition", async ({ page }) => {
  await page.goto("/components/stack-navigator");
  await expect(page.getByRole("heading", { name: "StackNavigator", exact: true })).toBeVisible();
  await expect(page.locator("#installation").getByText("pnpm dlx shadcn@latest add https://pwaui.com/r/stack-navigator.json")).toBeVisible();

  const preview = page.locator(".example-preview");
  await preview.getByRole("button", { name: "Native feel layer" }).click();
  await expect(preview.getByRole("button", { name: "Back to projects" })).toBeFocused();
  await preview.getByRole("button", { name: "Back to projects" }).click();
  await expect(preview.getByText("Projects", { exact: true })).toBeVisible();

  await expect(async () => {
    await page.goto("/guides/app-layout#stacked-navigation");
    expect(new URL(page.url()).pathname).toBe("/guides/app-layout");
  }).toPass();
  await expect(page.getByRole("heading", { name: "Stacked navigation" })).toBeVisible();
  await expect(page.getByText("Parallel-route slots preserve their active subpage during soft navigation", { exact: false })).toBeVisible();
});

test("opens and dismisses the keyboard-aware bottom sheet", async ({ page }) => {
  await page.goto("/components/bottom-sheet");
  await expect(page.getByRole("heading", { name: "BottomSheet", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
  await expect(page.locator("#installation").getByText("pnpm dlx shadcn@latest add https://pwaui.com/r/bottom-sheet.json")).toBeVisible();
  await page.getByRole("button", { name: "Open bottom sheet" }).click();
  await expect(page.getByRole("dialog", { name: "Choose a workspace" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Choose a workspace" })).toBeHidden();
});

test("uses an accessible action sheet", async ({ page }) => {
  await page.goto("/components/action-sheet");
  await page.getByRole("button", { name: "Open actions" }).click();
  await expect(page.getByRole("dialog", { name: "Project actions" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("dialog", { name: "Project actions" })).toBeHidden();
});

test("shows copyable usage alongside each live example", async ({ page }) => {
  await page.goto("/components/tab-bar");
  await page.getByRole("button", { name: "Code", exact: true }).click();
  await expect(page.locator("#preview").getByText('import Link from "next/link"')).toBeVisible();
  await expect(page.locator("#preview").getByText('import { Home, Search, User } from "lucide-react"')).toBeVisible();
  await expect(page.locator("#preview").getByText('render={<Link href="/" />}')).toBeVisible();
  await expect(page.locator("#preview .token.keyword").filter({ hasText: "import" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy code" }).first()).toBeVisible();
});

test("publishes router-composable navigation source", async ({ page }) => {
  await page.goto("/components/navigation-bar");
  await expect(page.locator("#usage").getByText('render={<Link href="/settings" />}')).toBeVisible();

  const installation = page.locator("#installation");
  await installation.getByRole("button", { name: "Manual", exact: true }).click();
  await expect(installation.getByText('import { useRender } from "@base-ui/react/use-render";')).toBeVisible();
});

test("shows every copy-pasteable source file in a registry item", async ({ page }) => {
  await page.goto("/components/action-sheet");
  const installation = page.locator("#installation");
  const manualTab = installation.getByRole("button", { name: "Manual", exact: true });
  await expect(manualTab).toBeVisible();
  await expect(async () => {
    await manualTab.click();
    await expect(manualTab).toHaveAttribute("aria-pressed", "true");
  }).toPass();

  await expect(installation.getByText("Copy and paste the component into your project.")).toBeVisible();
  const sourceToolbar = installation.locator(".component-source-panel .code-block-toolbar");
  await expect(sourceToolbar).toHaveCount(1);
  await expect(sourceToolbar.locator(".code-block-path")).toHaveCount(0);
  await expect(installation.getByRole("button", { name: "components/ui/action-sheet.tsx", exact: true })).toBeVisible();
  await expect(installation.getByRole("button", { name: "Copy components/ui/action-sheet.tsx" })).toBeVisible();

  await installation.getByRole("button", { name: "components/ui/bottom-sheet.tsx", exact: true }).click();
  await expect(installation.getByText("export type BottomSheetProps = Drawer.Root.Props;")).toBeVisible();
  await expect(installation.getByRole("button", { name: "Copy components/ui/bottom-sheet.tsx" })).toBeVisible();
});

test("opens both documentation resources", async ({ page }) => {
  await page.goto("/resources/device-qa");
  await expect(page.getByRole("heading", { name: "Device QA", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Registry source/ }).last().click();
  await expect(page).toHaveURL(/\/resources\/registry$/);
  await expect(page.getByRole("heading", { name: "Registry source", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Registry index/ })).toHaveAttribute("href", "/r/registry.json");
});
