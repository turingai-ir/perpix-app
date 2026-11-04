import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const artifacts = path.join(root, ".artifacts/frontend-verification");
const reports = [];
function find(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "test-results") find(filename);
    else if (entry.isFile() && entry.name === "results.json") reports.push(filename);
  }
}
find(artifacts);
const planned = new Set();
const latest = new Map();
const runs = [];
for (const filename of reports) {
  const report = JSON.parse(fs.readFileSync(filename, "utf8"));
  if (!report.stats || !report.suites) continue;
  const stamp = Date.parse(report.stats.startTime);
  const relative = path.relative(root, filename).replaceAll("\\", "/");
  runs.push({ report: relative, ...report.stats, errors: report.errors?.map((error) => error.message) ?? [] });
  function walk(suite, parents = []) {
    const titles = [...parents, suite.title].filter(Boolean);
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const key = JSON.stringify([test.projectName, spec.file, ...titles, spec.title]);
        planned.add(key);
        const result = test.results?.at(-1);
        if (!result || (result.status === "skipped" && test.expectedStatus !== "skipped")) continue;
        if ((latest.get(key)?.stamp ?? -1) > stamp) continue;
        latest.set(key, {
          stamp, file: spec.file, title: [...titles, spec.title].join(" > "),
          browser: test.projectName, status: result.status, report: relative,
          errors: result.errors?.map((error) => error.message) ?? [],
        });
      }
    }
    for (const child of suite.suites ?? []) walk(child, titles);
  }
  for (const suite of report.suites) walk(suite);
}
const cases = [...latest.values()];
const failed = cases.filter((test) => !["passed", "skipped"].includes(test.status));
const summary = {
  generatedAt: new Date().toISOString(),
  backend: "Approved by user; no backend or paid provider operation performed",
  method: "Latest actual result per named browser scenario across retained runs; not a single clean full-suite run",
  planned: planned.size,
  reportedExecuted: cases.filter((test) => test.status !== "skipped").length,
  passed: cases.filter((test) => test.status === "passed").length,
  failed: failed.length,
  explicitlySkipped: cases.filter((test) => test.status === "skipped").length,
  unverifiedOrNotRun: planned.size - cases.length,
  verdict: failed.length || planned.size !== cases.length ? "NOT_APPROVED" : "SCOPED_TESTS_PASSED",
  failures: failed,
  cases,
  runs: runs.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime)),
};
fs.writeFileSync(path.join(artifacts, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ ...summary, cases: undefined, runs: undefined,
  failures: failed.map(({ file, title, browser, status, report }) => ({ file, title, browser, status, report })),
}, null, 2));
