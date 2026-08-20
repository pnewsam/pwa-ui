import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: [
      {
        find: "@/components/ui/bottom-sheet",
        replacement: path.resolve(__dirname, "../../registry/components/bottom-sheet/bottom-sheet.tsx"),
      },
      {
        find: "@/hooks/use-display-mode",
        replacement: path.resolve(__dirname, "../../registry/hooks/use-display-mode.ts"),
      },
      {
        find: "@/hooks/use-media-query",
        replacement: path.resolve(__dirname, "../../registry/hooks/use-media-query.ts"),
      },
      {
        find: "@/hooks/use-visual-viewport",
        replacement: path.resolve(__dirname, "../../registry/hooks/use-visual-viewport.ts"),
      },
      { find: "@", replacement: path.resolve(__dirname, ".") },
    ],
  },
});
