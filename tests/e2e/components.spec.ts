import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => console.error(`PAGE ERROR: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") console.error(`BROWSER ERROR: ${message.text()}`);
  });
});

test("renders all eight registry components", async ({ page }) => {
  await page.goto("/components");
  await expect(page.getByRole("heading", { name: "Eight primitives. Designed together." })).toBeVisible();
  for (const name of ["AppShell", "SafeArea", "BottomSheet", "ResponsiveDialog", "ActionSheet", "NavigationBar", "TabBar", "KeyboardAvoidingView"]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  }
});

test("opens and dismisses the keyboard-aware bottom sheet", async ({ page }) => {
  await page.goto("/components");
  await page.getByRole("button", { name: "Open form sheet" }).click();
  await expect(page.getByRole("dialog", { name: "Compose message" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Compose message" })).toBeHidden();
});

test("uses an accessible action sheet", async ({ page }) => {
  await page.goto("/components");
  await page.getByRole("button", { name: "Workspace actions" }).click();
  await expect(page.getByRole("dialog", { name: "Workspace actions" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("dialog", { name: "Workspace actions" })).toBeHidden();
});
