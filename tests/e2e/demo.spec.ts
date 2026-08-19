import { expect, test } from "@playwright/test";

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

  await page.getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-pwa-app-root", "");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
