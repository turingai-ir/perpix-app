import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./__tests__",
  testMatch: "login-hero-motion.spec.ts",
  reporter: "list",
  workers: 1,
  use: {
    baseURL: "http://localhost:5173",
    serviceWorkers: "block",
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" },
  },
});
