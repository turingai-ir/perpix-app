import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

// An acknowledgement prevents accidental host execution; it does not create a sandbox.
if (process.env.PERPIX_QA_OS_SANDBOX !== "confirmed") {
  throw new Error(
    "Release QA requires an OS-enforced no-egress sandbox. See docs/qa/feature-1-release-audit.md.",
  );
}

const artifactRoot = fileURLToPath(
  new URL("../.artifacts/release-qa/", import.meta.url),
);
const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

export default defineConfig({
  testDir: "./release-qa",
  testMatch: "network-safety.qa.ts",
  fullyParallel: false,
  forbidOnly: true,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  globalTimeout: 180_000,
  outputDir: `${artifactRoot}/test-results`,
  reporter: [
    ["list"],
    ["json", { outputFile: `${artifactRoot}/results.json` }],
    ["html", { outputFolder: `${artifactRoot}/html`, open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:5173",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "fa-IR",
    timezoneId: "Asia/Tehran",
  },
  projects: ["chromium", "webkit"].flatMap((browser) =>
    viewports.map(({ name, width, height }) => ({
      name: `${browser}-${name}-viewport`,
      use: {
        ...devices[browser === "chromium" ? "Desktop Chrome" : "Desktop Safari"],
        viewport: { width, height },
      },
    })),
  ),
});
