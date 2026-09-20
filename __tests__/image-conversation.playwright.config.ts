import { defineConfig, devices } from "@playwright/test";

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

export default defineConfig({
  testDir: ".",
  testMatch: "image-conversation.spec.ts",
  outputDir: "../test-results/image-conversation",
  reporter: "list",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: "http://localhost:5173",
    serviceWorkers: "block",
    trace: "off",
    screenshot: "off",
    video: "off",
    channel: "chrome",
    actionTimeout: 5_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `${pnpmCommand} dev -- --host localhost --port 5173 --strictPort`,
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
