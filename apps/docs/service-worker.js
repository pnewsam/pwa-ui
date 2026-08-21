/*
 * PWA UI docs worker
 *
 * The production build replaces the token below with the deployed commit so
 * browsers can detect each release and offer it through UpdatePrompt.
 * This worker intentionally caches nothing, especially /r/* registry source.
 */

const WORKER_VERSION = "__PWA_UI_BUILD_ID__";

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
