import { defineConfig } from "@playwright/test";
import base from "../playwright.config";

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

export default defineConfig({
  ...base,
  testDir: "..",
  metadata: { productionBundle: true },
  webServer: {
    command: `${pnpmCommand} preview`,
    url: "http://localhost:5173",
    reuseExistingServer: false,
  },
});
