#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

type RegistryEntry = {
  source: string;
  version?: string;
  addedAt: string;
  updatedAt?: string;
};

type Registry = Record<string, RegistryEntry>;

const componentNameArg = process.argv[2];

if (!componentNameArg) {
  console.error("❌ Usage: ui-add <component-name>");
  process.exit(1);
}

const componentName: string = componentNameArg;

const registryPath = path.join(process.cwd(), "components-registry.json");

// ---------------- helpers ----------------

function ensureRegistryFile() {
  if (!fs.existsSync(registryPath)) {
    fs.writeFileSync(registryPath, "{}", "utf-8");
  }
}

function loadRegistry(): Registry {
  ensureRegistryFile();

  try {
    const raw = fs.readFileSync(registryPath, "utf-8");
    return JSON.parse(raw || "{}") as Registry;
  } catch {
    console.error("❌ Invalid components-registry.json");
    process.exit(1);
  }
}

function saveRegistry(registry: Registry) {
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf-8");
}

function run(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}

// ---------------- main ----------------

async function main() {
  const registry = loadRegistry();
  const now = dayjs().toISOString();

  const exists = registry[componentName];

  const source: string = componentName.includes("/")
    ? (componentName.split("/")[0] ?? "shadcn")
    : "shadcn";

  console.log(`\n📦 Installing: ${componentName}\n`);

  try {
    const output = await run(`pnpm dlx shadcn@latest add ${componentName}`);

    console.log(output);

    const entry: RegistryEntry = {
      source,
      version: "latest",
      addedAt: exists?.addedAt ?? now,
      updatedAt: exists ? now : undefined,
    };

    registry[componentName] = entry;

    saveRegistry(registry);

    if (exists) {
      console.log("\n🔄 Updated existing component\n");
    } else {
      console.log("\n✅ Component added successfully\n");
    }

    console.log("📁 Registry entry:\n");
    console.log(JSON.stringify({ [componentName]: entry }, null, 2));

    console.log(`\n🕒 ${dayjs().format("YYYY-MM-DD HH:mm:ss")}\n`);
  } catch (err) {
    console.error("❌ Install failed");
    console.error(err);
    process.exit(1);
  }
}

main();
