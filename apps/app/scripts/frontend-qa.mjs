import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
// Parent directory for isolated QA snapshots. Override with PERPIX_QA_SCRATCH_PARENT.
const base =
  process.env.PERPIX_QA_SCRATCH_PARENT ?? path.join(os.tmpdir(), "perpix-qa");
if (!process.env.PERPIX_QA_SCRATCH_PARENT) fs.mkdirSync(base, { recursive: true });
const stage = process.argv[2] ?? "gate";
if (!["gate", "core", "ui", "all", "generation", "types", "types-node", "build", "lint"].includes(stage)) throw new Error("Unknown QA stage");
const existing = process.argv[3];
if (!fs.existsSync(base)) throw new Error("Approved scratch parent missing");
const scratch = existing ? fs.realpathSync.native(existing) : path.join(fs.realpathSync.native(base), `perpix-frontend-${Date.now()}`);
const relative = path.relative(fs.realpathSync.native(base), scratch);
if (!relative || relative.startsWith("..") || path.isAbsolute(relative) || !path.basename(scratch).startsWith("perpix-frontend-")) {
  throw new Error("QA snapshot must stay inside its approved temporary parent");
}
const skipped = new Set(["node_modules", ".git", ".kilo", ".agents", ".codex", "graphify-out", "dist", "coverage", ".artifacts", "playwright-report", "test-results"]);
const rootInputs = new Set(["src", "public", "__tests__", "scripts", "index.html", "package.json", "pnpm-lock.yaml", "vite.config.ts", "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", "eslint.config.js", ".prettierrc", ".gitignore"]);
function copy(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    if (source === root && !rootInputs.has(item.name)) continue;
    if (skipped.has(item.name) || item.name.startsWith(".env") || item.name === ".npmrc" || item.name.endsWith(".tsbuildinfo")) continue;
    const from = path.join(source, item.name);
    const to = path.join(target, item.name);
    if (item.isSymbolicLink()) continue;
    if (item.isDirectory()) copy(from, to);
    else if (item.isFile()) {
      if (fs.existsSync(to) && fs.readFileSync(from).equals(fs.readFileSync(to))) continue;
      fs.copyFileSync(from, to);
    }
  }
}
copy(root, scratch);
const modules = path.join(scratch, "node_modules");
if (fs.existsSync(modules) && !fs.lstatSync(modules).isSymbolicLink()) {
  fs.renameSync(modules, `${modules}.aborted-${Date.now()}`);
}
if (!fs.existsSync(modules)) {
  fs.symlinkSync(path.join(root, "node_modules"), modules, "junction");
}
const env = {};
for (const key of ["SystemRoot", "SYSTEMROOT", "SystemDrive", "WINDIR", "COMSPEC", "ComSpec", "PATH", "Path", "PATHEXT"]) {
  if (process.env[key]) env[key] = process.env[key];
}
for (const key of ["HOME", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TEMP", "TMP"]) {
  env[key] = path.join(scratch, ".qa-home", key);
  fs.mkdirSync(env[key], { recursive: true });
}
env.PLAYWRIGHT_BROWSERS_PATH = path.join(process.env.LOCALAPPDATA, "ms-playwright");
env.PERPIX_FRONTEND_QA = "1";
env.PERPIX_QA_STAGE = stage;
env.VITE_PERPIX_API_URL = "http://localhost:5173";
env.VITE_APP_FONT_BASE_URL = "/fonts";
env.VITE_APP_TELEGRAM_SUPPORT = "https://t.me/perpix_qa";
env.VITE_APP_SENTRY_DSN = "https://public@telemetry.invalid/1";
env.VITE_PERPIX_MAIN_WEBSITE_URL = "https://main.invalid";
env.COREPACK_ENABLE_NETWORK = "0";
env.COREPACK_ENABLE_PROJECT_SPEC = "0";
env.COREPACK_ENABLE_AUTO_PIN = "0";
env.npm_config_manage_package_manager_versions = "false";
env.npm_config_verify_deps_before_run = "never";
env.npm_config_offline = "true";
env.NODE_OPTIONS = `--require="${path.join(scratch, "__tests__/support/frontend-qa-egress.cjs").replaceAll("\\", "/")}"`;
console.log(`QA_SCRATCH=${scratch}`);
console.log(`QA_STAGE=${stage}; no .env files; no real API proxy; external browser/Node networking denied`);
let cli = path.join(scratch, "node_modules/@playwright/test/cli.js");
if (stage.startsWith("types")) cli = path.join(scratch, "node_modules/typescript/bin/tsc");
else if (stage === "build") cli = path.join(scratch, "node_modules/vite/bin/vite.js");
else if (stage === "lint") cli = path.join(scratch, "node_modules/eslint/bin/eslint.js");
let args;
if (stage.startsWith("types")) {
  const name = stage === "types-node" ? "node" : "app";
  args = [cli, "-p", `tsconfig.${name}.json`, "--noEmit", "--incremental", "--tsBuildInfoFile", `.qa-cache/${name}.tsbuildinfo`];
}
else if (stage === "build") args = [cli, "build"];
else if (stage === "lint") {
  const output = path.join(scratch, ".artifacts/frontend-verification/lint");
  fs.mkdirSync(output, { recursive: true });
  args = [cli, "src", "vite.config.ts", "scripts/frontend-qa-guard.ts", "--format=json", `--output-file=${path.join(output, "eslint.json")}`];
}
else args = [cli, "test", "--config=__tests__/frontend-verification.config.ts", ...process.argv.slice(4)];
const generated = path.join(scratch, ".artifacts/frontend-verification", stage);
if (fs.existsSync(generated)) {
  fs.renameSync(generated, `${generated}.previous-${Date.now()}`);
}
const child = spawn(process.execPath, args, { cwd: scratch, env, stdio: "inherit" });
// Leave time for Playwright's own timeout and report/teardown to complete.
let budget = 720_000;
if (stage === "build") budget = 240_000;
else if (stage === "all") budget = 720_000;
const deadline = setTimeout(() => {
  console.error("QA_RUNNER_DEADLINE");
  spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "inherit" });
}, budget);
child.on("exit", (code) => {
  clearTimeout(deadline);
  const retained = path.join(root, ".artifacts/frontend-verification", stage);
  fs.mkdirSync(generated, { recursive: true });
  fs.writeFileSync(path.join(generated, "run.json"), JSON.stringify({ stage, exitCode: code, scratch, finishedAt: new Date().toISOString(), appEnv: "dummy; .env excluded", backend: "user-approved; not exercised", installedDependenciesOnly: true }, null, 2));
  if (stage === "lint" && fs.existsSync(path.join(generated, "eslint.json"))) {
    const files = JSON.parse(fs.readFileSync(path.join(generated, "eslint.json"), "utf8"));
    console.log(JSON.stringify({ lintFiles: files.length, errors: files.reduce((n, f) => n + f.errorCount, 0), warnings: files.reduce((n, f) => n + f.warningCount, 0), failures: files.flatMap((f) => f.messages.filter((m) => m.severity === 2).map((m) => ({ file: path.relative(scratch, f.filePath), line: m.line, rule: m.ruleId, message: m.message }))) }));
  }
  if (fs.existsSync(generated)) {
    if (fs.existsSync(retained)) {
      const previous = path.join(root, ".artifacts/frontend-verification/attempts", `${stage}-previous-${Date.now()}`);
      fs.mkdirSync(path.dirname(previous), { recursive: true });
      fs.renameSync(retained, previous);
    }
    fs.cpSync(generated, retained, { recursive: true });
    fs.cpSync(generated, path.join(root, ".artifacts/frontend-verification/attempts", `${stage}-${Date.now()}`), { recursive: true });
  }
  console.log(`QA_EXIT=${code}; QA_SCRATCH=${scratch}`);
  process.exitCode = code ?? 1;
});
