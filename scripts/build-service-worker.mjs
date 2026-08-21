import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = resolve(repositoryRoot, "apps/docs/service-worker.js");
const outputPath = resolve(repositoryRoot, "apps/docs/public/sw.js");
const token = "__PWA_UI_BUILD_ID__";

function deployedCommit() {
  const explicitId = process.env.PWA_UI_BUILD_ID?.trim();
  if (explicitId) return explicitId;

  return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).trim();
}

const template = await readFile(templatePath, "utf8");
if (!template.includes(token)) throw new Error(`Service-worker template is missing ${token}.`);

const buildId = deployedCommit();
if (!/^[A-Za-z0-9._-]+$/.test(buildId)) throw new Error("PWA_UI_BUILD_ID contains unsupported characters.");

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, template.replaceAll(token, buildId));
console.log(`Built docs service worker ${buildId}.`);
