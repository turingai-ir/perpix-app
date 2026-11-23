#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const env = { ...process.env };
if (args[0] === "--tsconfig") {
  const config = args[1];
  if (!config) throw new Error("--tsconfig requires a path");
  env.OXC_TSCONFIG_PATH = resolve(config);
  args.splice(0, 2);
}
const result = spawnSync(
  process.execPath,
  ["--import", import.meta.resolve("@oxc-node/core/register"), ...args],
  { env, stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.signal) process.kill(process.pid, result.signal);
else process.exitCode = result.status ?? 1;
