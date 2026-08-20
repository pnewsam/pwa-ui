import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function pullToRefresh(region: Locator) {
  const box = await region.boundingBox();
  if (!box) throw new Error("Refresh viewport is not visible.");
  const pointer = { pointerId: 81, pointerType: "touch", isPrimary: true, button: 0, buttons: 1 };
  await region.evaluate((element) => { element.scrollTop = 0; });
  await region.dispatchEvent("pointerdown", { ...pointer, clientX: box.x + box.width / 2, clientY: box.y + 18 });
  await region.dispatchEvent("pointermove", { ...pointer, clientX: box.x + box.width / 2, clientY: box.y + 190 });
  await region.dispatchEvent("pointerup", { ...pointer, buttons: 0, clientX: box.x + box.width / 2, clientY: box.y + 190 });
}

test("promotes a responsive showcase without leaking app containment into docs", async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Try the demo/ })).toBeVisible();

  await page.getByRole("link", { name: /Try the demo/ }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator("html")).toHaveAttribute("data-pwa-app-root", "");
  await expect(page.locator('[data-pwa-app-mount]')).toBeVisible();
  await expect(page.locator('[data-slot="app-shell"]')).toBeVisible();
  const frame = await page.getByTestId("demo-frame").boundingBox();
  expect(frame?.width).toBeLessThanOrEqual(433);
  expect(frame?.height).toBeLessThanOrEqual(833);
  const homeTab = await page.getByRole("button", { name: "Home" }).boundingBox();
  expect(homeTab && frame ? homeTab.x - frame.x : 0).toBeGreaterThanOrEqual(12);
  expect(homeTab && frame ? frame.y + frame.height - homeTab.y - homeTab.height : 0).toBeGreaterThanOrEqual(8);

  await page.getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-pwa-app-root", "");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("drives the native-feel showcase flow on a phone viewport", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");
  const refreshRegion = page.getByTestId("demo-refresh");

  await pullToRefresh(refreshRegion);
  await expect(page.getByRole("button", { name: /Fresh from refresh 1/ })).toBeVisible();

  const project = page.getByRole("button", { name: /Native feel layer/ });
  const stack = page.locator('[data-slot="stack-navigator"]');
  const homeStackHeight = await stack.evaluate((element) => element.getBoundingClientRect().height);
  await project.click();
  await expect(stack).toHaveAttribute("data-depth", "2");
  await expect(page.locator('[data-view-key="native-feel"]')).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect.poll(() => stack.evaluate((element) => element.getBoundingClientRect().height)).toBe(homeStackHeight);
  await page.waitForTimeout(320);
  await page.getByRole("button", { name: "Back to projects" }).click();
  await expect(stack).toHaveAttribute("data-depth", "1");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Activity" }).click();
  const activity = page.getByTestId("activity-scroll");
  await activity.evaluate((element) => {
    element.scrollTop = 360;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect.poll(() => activity.evaluate((element) => element.scrollTop)).toBeGreaterThanOrEqual(359);
  await page.waitForTimeout(50);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("pwa-ui:scroll:demo:activity"))).toBe("360");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.evaluate(() => sessionStorage.getItem("pwa-ui:scroll:demo:activity"))).resolves.toBe("360");
  await page.getByRole("button", { name: "Activity" }).click();
  await expect.poll(() => activity.evaluate((element) => element.scrollTop)).toBeGreaterThanOrEqual(359);
  await expect.poll(() => activity.evaluate((element) => element.scrollTop)).toBeLessThanOrEqual(361);

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "New note" }).click();
  const dialog = page.getByRole("dialog", { name: "New project note" });
  await expect(dialog).toBeVisible();
  const noteTitle = page.getByRole("textbox", { name: "Note title" });
  await noteTitle.fill("Hardware QA observations");
  await expect(noteTitle).toBeFocused();
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(dialog).toBeHidden();

  await context.setOffline(true);
  await expect(page.getByText("Offline demo mode. Your current view still works.")).toBeVisible();
  await context.setOffline(false);
  await expect(page.getByText("Offline demo mode. Your current view still works.")).toBeHidden();
});

test("keeps showcase navigation functional with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");

  await page.getByRole("button", { name: /Native feel layer/ }).click();
  const stack = page.locator('[data-slot="stack-navigator"]');
  await expect(stack).toHaveAttribute("data-transition-mode", "reduced");
  await expect(page.locator('[data-view-key="native-feel"]')).toBeFocused();
  await page.waitForTimeout(30);
  await page.getByRole("button", { name: "Back to projects" }).click();
  await expect(stack).toHaveAttribute("data-depth", "1");
});
