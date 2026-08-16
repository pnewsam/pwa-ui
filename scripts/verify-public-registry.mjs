import { readFile } from "node:fs/promises";

const baseUrl = (process.env.PWA_UI_BASE_URL ?? process.argv[2] ?? "https://pwaui.com").replace(/\/$/, "");
const registrySource = JSON.parse(await readFile(new URL("../registry/registry.json", import.meta.url), "utf8"));
const expectedNames = registrySource.items.map((item) => item.name);

async function fetchRequired(path, expectedType) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "error" });
  if (!response.ok) throw new Error(`${path} returned ${response.status}.`);

  const contentType = response.headers.get("content-type") ?? "";
  if (expectedType && !contentType.includes(expectedType)) {
    throw new Error(`${path} returned ${contentType || "no content type"}; expected ${expectedType}.`);
  }
  return response;
}

await Promise.all([
  fetchRequired("/", "text/html"),
  fetchRequired("/components/app-shell", "text/html"),
  fetchRequired("/hooks/use-display-mode", "text/html"),
  fetchRequired("/robots.txt", "text/plain"),
  fetchRequired("/sitemap.xml", "application/xml"),
]);

const indexResponse = await fetchRequired("/r/registry.json", "application/json");
const index = await indexResponse.json();
const publishedNames = new Set((index.items ?? []).map((item) => item.name));

for (const name of expectedNames) {
  if (!publishedNames.has(name)) throw new Error(`Registry index is missing ${name}.`);
}

await Promise.all(expectedNames.map(async (name) => {
  const response = await fetchRequired(`/r/${name}.json`, "application/json");
  const cacheControl = response.headers.get("cache-control") ?? "";
  if (!/max-age=0|no-cache|no-store/.test(cacheControl)) {
    throw new Error(`/r/${name}.json has unsafe update caching: ${cacheControl || "missing"}.`);
  }
  const item = await response.json();
  if (item.name !== name) throw new Error(`/r/${name}.json returned ${item.name ?? "no item name"}.`);
  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`/r/${name}.json contains no installable files.`);
  }
}));

console.log(`Verified ${expectedNames.length} registry items and required documentation routes at ${baseUrl}.`);
