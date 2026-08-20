import { expect, test } from "@playwright/test";

test.describe("production PWA installability", () => {
  test.skip(!process.env.PWA_UI_E2E_PRODUCTION, "Runs against a production build only.");

  test("publishes a complete manifest and controls the app with the no-cache worker", async ({ page, request }) => {
    const manifestResponse = await request.get("/manifest.webmanifest");
    expect(manifestResponse.ok()).toBe(true);
    const manifest = await manifestResponse.json();
    expect(manifest).toMatchObject({
      id: "/demo",
      name: "PWA UI",
      short_name: "PWA UI",
      start_url: "/demo",
      scope: "/",
      display: "standalone",
    });
    expect(manifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }),
      expect.objectContaining({ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: expect.stringContaining("maskable") }),
    ]));
    expect((await request.get(manifest.start_url)).ok()).toBe(true);

    for (const icon of ["/icons/icon-192.png", "/icons/icon-512.png"]) {
      const response = await request.get(icon);
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/png");
    }

    const workerResponse = await request.get("/sw.js");
    expect(workerResponse.ok()).toBe(true);
    expect(workerResponse.headers()["content-type"]).toContain("application/javascript");
    expect(workerResponse.headers()["cache-control"]).toContain("no-store");
    const workerSource = await workerResponse.text();
    expect(workerSource).toContain('event.data?.type === "SKIP_WAITING"');
    expect(workerSource).toContain('url.pathname.startsWith("/r/")');

    await page.goto("/");
    const registration = await page.evaluate(async () => {
      const ready = await navigator.serviceWorker.ready;
      return { scope: ready.scope, scriptURL: ready.active?.scriptURL ?? "" };
    });
    expect(new URL(registration.scope).pathname).toBe("/");
    expect(new URL(registration.scriptURL).pathname).toBe("/sw.js");
    expect(await page.evaluate(() => caches.keys())).toEqual([]);

    const registryResponse = await page.request.get("/r/registry.json");
    expect(registryResponse.ok()).toBe(true);
  });
});
