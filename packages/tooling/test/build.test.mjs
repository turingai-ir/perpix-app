import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../../", import.meta.url));

test("shared Vite configuration transforms and minifies TypeScript with Oxc", async () => {
  const { createViteConfig } = await import("../vite.mjs");
  const { build } = await import("vite");
  const config = createViteConfig({ react: false });
  assert.equal(config.build.minify, "oxc");
  assert.equal(config.build.target, "baseline-widely-available");
  const directory = mkdtempSync(join(tmpdir(), "perpix-vite-"));
  const entry = join(directory, "entry.ts");
  writeFileSync(
    entry,
    "export const double = (value: number): number => value * 2;",
  );
  try {
    const output = await build({
      ...config,
      root: directory,
      configFile: false,
      logLevel: "silent",
      build: { ...config.build, write: false, lib: { entry, formats: ["es"] } },
    });
    const outputs = Array.isArray(output) ? output : [output];
    const chunk = outputs
      .flatMap((item) => item.output)
      .find((item) => item.type === "chunk");
    assert.ok(chunk);
    const module = await import(
      `data:text/javascript;base64,${Buffer.from(chunk.code).toString("base64")}`
    );
    assert.equal(module.double(21), 42);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("Oxc runner supports TypeScript enums and extensionless imports", () => {
  const directory = mkdtempSync(join(tmpdir(), "perpix-runner-"));
  writeFileSync(
    join(directory, "value.ts"),
    "export enum Status { Ready = 42 }",
  );
  writeFileSync(
    join(directory, "main.mts"),
    'import { Status } from "./value"; console.log(Status.Ready);',
  );
  try {
    const result = spawnSync(
      process.execPath,
      [
        join(root, "packages/tooling/run-typescript.mjs"),
        join(directory, "main.mts"),
      ],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), "42");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("Rust typechecker reports invalid assignments", () => {
  const directory = mkdtempSync(join(tmpdir(), "perpix-types-"));
  const file = join(directory, "invalid.ts");
  writeFileSync(file, 'const count: number = "invalid";');
  try {
    const result = spawnSync(
      "pnpm",
      ["exec", "tsrs", "--noEmit", "--skipLibCheck", file],
      { cwd: root, encoding: "utf8" },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /2322/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
