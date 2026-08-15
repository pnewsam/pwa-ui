import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => console.error(`PAGE ERROR: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") console.error(`BROWSER ERROR: ${message.text()}`);
  });
});

test("renders the documentation index and all eight component links", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Build mobile web apps/ })).toBeVisible();
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  for (const name of ["AppShell", "SafeArea", "BottomSheet", "ResponsiveDialog", "ActionSheet", "NavigationBar", "TabBar", "KeyboardAvoidingView"]) {
    await expect(page.getByRole("link", { name, exact: true }).first()).toBeVisible();
  }
});

test("opens and dismisses the keyboard-aware bottom sheet", async ({ page }) => {
  await page.goto("/components/bottom-sheet");
  await expect(page.getByRole("heading", { name: "BottomSheet", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
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

test("shows copyable source alongside each live example", async ({ page }) => {
  await page.goto("/components/tab-bar");
  await page.getByRole("button", { name: "Code", exact: true }).click();
  await expect(page.locator("#preview").getByText('import { Home, Search, User } from "lucide-react"')).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy code" }).first()).toBeVisible();
});

test("opens both documentation resources", async ({ page }) => {
  await page.goto("/resources/device-qa");
  await expect(page.getByRole("heading", { name: "Device QA", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Registry source/ }).last().click();
  await expect(page).toHaveURL(/\/resources\/registry$/);
  await expect(page.getByRole("heading", { name: "Registry source", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Registry index/ })).toHaveAttribute("href", "/r/registry.json");
});
