import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./__tests__",
  testMatch: "generation-video-prompt-box.spec.ts",
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:5173",
    serviceWorkers: "block",
    launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" },
  },
});
