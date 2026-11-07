import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

if (process.env.PERPIX_FRONTEND_QA !== "1") {
  throw new Error("Use scripts/frontend-qa.mjs; this config requires isolated dummy configuration");
}
const stage = process.env.PERPIX_QA_STAGE ?? "gate";
const artifacts = fileURLToPath(new URL(`../.artifacts/frontend-verification/${stage}/`, import.meta.url));
const core = [
  "src/features/auth/_tests/auth-reliability.spec.ts",
  "src/features/auth/_tests/auth-refresh-timeout.spec.ts",
  "src/features/auth/_tests/auth-protected-api.spec.ts",
  "src/features/auth/_tests/auth-sign-out.spec.ts",
  "src/features/auth/_tests/auth-sign-out-pending.spec.ts",
  "__tests__/custom-fetch-cancellation.spec.ts",
  "__tests__/wallet-checkout.spec.ts",
];
const ui = [
  "__tests__/app-sidebar.spec.ts",
  "__tests__/generation-history-recovery.spec.ts",
  "__tests__/sidebar-install-accessibility.spec.ts",
  "__tests__/media-preview-actions.spec.ts",
  "__tests__/app-layout-scroll.spec.ts",
  "src/features/pricing/_tests/pricing-empty.spec.ts",
  "src/pages/profile/_tests/finance-pages.spec.ts",
  "src/pages/(app)/generation/_tests/prompt-field.spec.ts",
];
const selections: Record<string, string | string[]> = {
  gate: "__tests__/release-qa/network-safety.qa.ts",
  core,
  ui,
  all: [...core, ...ui],
  generation: ["__tests__/image-conversation.spec.ts", "__tests__/generation-video-prompt-box.spec.ts"],
};
const selected = selections[stage];
if (!selected) throw new Error("Unknown frontend verification stage");
export default defineConfig({
  testDir: "..",
  globalSetup: stage === "gate" ? undefined : fileURLToPath(new URL("./support/frontend-warmup.ts", import.meta.url)),
  testMatch: selected,
  grep: stage === "generation" ? /fully mocked focused generation flow|double click sends exactly one|successful server result replaces optimistic|submits text-to-video prompt values|prevents another generation while|shows the generation failure reason and retries/ : undefined,
  grepInvert: /opens a live mocked checkout preview/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  maxFailures: 6,
  timeout: 25_000,
  globalTimeout: stage === "gate" ? 120_000 : 600_000,
  outputDir: `${artifacts}/test-results`,
  reporter: [
    ["line"],
    ["json", { outputFile: `${artifacts}/results.json` }],
  ],
  use: {
    baseURL: "http://localhost:5173",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    proxy: { server: "http://127.0.0.1:9", bypass: "localhost,127.0.0.1,[::1]" },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: stage === "gate" ? undefined : {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    // Execute the exact dev script without pnpm's automatic dependency install.
    command: "node --run dev -- --host localhost --port 5173 --strictPort",
    stdout: "pipe",
    stderr: "pipe",
    url: "http://localhost:5173/__qa/ready",
    reuseExistingServer: false,
    timeout: 90_000,
  },
});
