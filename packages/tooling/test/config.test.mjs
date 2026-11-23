import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const fixture = mkdtempSync(join(tmpdir(), "perpix-tooling-"));
process.on("exit", () => rmSync(fixture, { recursive: true, force: true }));
function lint(source) {
  const file = join(fixture, "example.tsx");
  writeFileSync(file, source);
  return spawnSync(
    "pnpm",
    ["exec", "oxlint", "-c", "oxlint.config.mts", "--no-ignore", file],
    { cwd: root, encoding: "utf8" },
  );
}
test("lint rejects broken hooks", () => {
  const result = lint(
    'import { useState } from "react"; export function Example({ flag }) { if (flag) useState(0); return null; }',
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /rules-of-hooks/);
});
test("lint rejects inaccessible images", () => {
  const result = lint(
    'export function Example() { return <img src="photo.png" />; }',
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /alt-text/);
});
test("format uses the shared configuration and sorts Tailwind utilities", async () => {
  const { formatSource } = await import("../format-source.mjs");
  const source = 'export const Example=()=> <div className="p-4 flex"/>';
  const result = await formatSource("example.tsx", source);
  assert.match(result, /className="flex p-4"/);
  assert.equal(await formatSource("example.tsx", result), result);
});

test("design-token rule runs from the root and the app directory", () => {
  const file = join(root, "apps/app/src/tooling-rule-fixture.tsx");
  writeFileSync(
    file,
    'export function Example() { return <div className="text-[13px]" />; }',
  );
  try {
    for (const cwd of [root, join(root, "apps/app")]) {
      const result = spawnSync("pnpm", ["exec", "oxlint", file], {
        cwd,
        encoding: "utf8",
      });
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stdout + result.stderr, /no-raw-values/);
    }
  } finally {
    rmSync(file, { force: true });
  }
});

test("generated source formatting errors are reported", async () => {
  const { formatSource } = await import("../format-source.mjs");
  await assert.rejects(formatSource("example.ts", "export const = ;"));
});

test("lint accepts valid React code", () => {
  const result = lint(
    'export function Example() { return <img src="photo.png" alt="Example" />; }',
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("lint excludes generated clients from root and app commands", () => {
  for (const cwd of [root, join(root, "apps/app"), join(root, "apps/admin")]) {
    const result = spawnSync("pnpm", ["exec", "oxlint", "--debug", "files"], {
      cwd,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(
      result.stdout,
      /src\/(?:shared|services)\/api\/api\.ts/,
    );
    assert.match(result.stdout, /\.tsx/);
  }
});
