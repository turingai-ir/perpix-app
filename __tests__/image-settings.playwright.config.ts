import { defineConfig, devices } from "@playwright/test";

// Intentionally no webServer: reuse only the caller's localhost:5173 server.
export default defineConfig({
  testDir: ".",
  testMatch: "image-settings.spec.ts",
  outputDir: "../test-results/image-settings",
  reporter: "list",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 4_000 },
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
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
