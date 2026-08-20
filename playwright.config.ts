import { defineConfig, devices } from "@playwright/test";

const productionPwaAudit = process.env.PWA_UI_E2E_PRODUCTION === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: productionPwaAudit ? "pnpm --filter @pwa-ui/docs start" : "pnpm --filter @pwa-ui/docs dev --webpack",
    url: "http://localhost:3000/",
    reuseExistingServer: productionPwaAudit ? false : !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["iPhone 15"] } },
  ],
});
