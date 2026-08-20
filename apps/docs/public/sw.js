/*
 * PWA UI docs worker — 2026-08-19.1
 *
 * This worker exists to make the docs installable and to exercise the library's
 * explicit update flow. It intentionally caches nothing, especially /r/*
 * registry source. If a release ever needs an emergency rollback, publish a
 * replacement worker that calls self.registration.unregister() during activate.
 */

const WORKER_VERSION = "2026-08-19.1";

self.addEventListener("install", () => {
  // Do not skip waiting here: UpdatePrompt gives the user control over reloads.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/r/")) return;

  event.respondWith(fetch(request));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "GET_VERSION") event.source?.postMessage({ type: "VERSION", version: WORKER_VERSION });
});
