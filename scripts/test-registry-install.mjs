import { cp, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = (process.env.PWA_UI_BASE_URL ?? process.argv[2] ?? "https://pwaui.com").replace(/\/$/, "");
const item = process.env.PWA_UI_ITEM ?? "pwa-provider";
const expectedFiles = (process.env.PWA_UI_EXPECTED_FILES ?? "src/components/ui/pwa-provider.tsx,src/hooks/use-visual-viewport.ts")
  .split(",")
  .map((path) => path.trim())
  .filter(Boolean);
const fixture = new URL("../tests/fixtures/registry-consumer/", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "pwa-ui-install-"));

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

try {
  await cp(fixture, directory, { recursive: true });
  const configPath = join(directory, "components.json");
  const config = await readFile(configPath, "utf8");
  await writeFile(configPath, config.replace("https://pwaui.com", baseUrl));

  await new Promise((resolve, reject) => {
    const child = spawn(
      "pnpm",
      ["dlx", "shadcn@latest", "add", `@pwa-ui/${item}`, "--cwd", directory, "--yes"],
      { cwd: process.cwd(), env: { ...process.env, CI: "1" }, stdio: "inherit" },
    );
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`shadcn exited with ${code}.`)));
  });

  for (const path of expectedFiles) {
    if (!await exists(join(directory, path))) throw new Error(`Fresh install did not create ${path}.`);
  }

  if (item === "pwa-provider") {
    const possibleStylePaths = ["styles/pwa.css", "src/styles/pwa.css"];
    if (!await Promise.any(possibleStylePaths.map(async (path) => {
      if (!await exists(join(directory, path))) throw new Error(path);
      return path;
    })).catch(() => false)) {
      throw new Error("Fresh install did not create the PWA base stylesheet.");
    }
  }

  console.log(`Installed @pwa-ui/${item} from ${baseUrl} into a clean shadcn fixture.`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
