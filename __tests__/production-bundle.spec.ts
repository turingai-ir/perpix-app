import { gzipSync } from "node:zlib";
import { expect, test } from "@playwright/test";
import { build } from "vite";

test("production JavaScript chunks stay within the default 500 kB budget", async ({
  browserName,
}, testInfo) => {
  test.skip(browserName !== "chromium", "The build is browser-independent.");
  test.setTimeout(300_000);
  const chunks: {
    file: string;
    bytes: number;
    gzip: number;
    modules: string[];
  }[] = [];
  let warningLimit = 0;
  const eagerHeavyModules: string[] = [];

  await build({
    logLevel: "warn",
    build: { write: false, reportCompressedSize: false },
    plugins: [
      {
        name: "production-bundle-budget",
        configResolved(config) {
          warningLimit = config.build.chunkSizeWarningLimit;
        },
        generateBundle: {
          order: "post",
          handler(_options, bundle) {
            const visited = new Set<string>();
            const queue = Object.values(bundle)
              .filter((chunk) => chunk.type === "chunk" && chunk.isEntry)
              .map((chunk) => chunk.fileName);
            for (const file of queue) {
              if (visited.has(file)) continue;
              visited.add(file);
              const chunk = bundle[file];
              if (chunk?.type !== "chunk") continue;
              queue.push(...chunk.imports);
              eagerHeavyModules.push(
                ...Object.keys(chunk.modules).filter((id) =>
                  /node_modules[\\/](?:konva|@sentry)[\\/]/.test(id),
                ),
              );
            }
            for (const chunk of Object.values(bundle)) {
              if (chunk.type !== "chunk") continue;
              chunks.push({
                file: chunk.fileName,
                bytes: Buffer.byteLength(chunk.code),
                gzip: gzipSync(chunk.code).byteLength,
                modules: Object.entries(chunk.modules)
                  .sort(
                    ([, first], [, second]) =>
                      second.renderedLength - first.renderedLength,
                  )
                  .slice(0, 8)
                  .map(
                    ([id, module]) =>
                      `${id.replaceAll("\\", "/").split("/node_modules/").at(-1)} (${module.renderedLength} bytes)`,
                  ),
              });
            }
          },
        },
      },
    ],
  });

  await testInfo.attach("production-bundle-sizes", {
    body: JSON.stringify(
      chunks.map(({ file, bytes, gzip }) => ({ file, bytes, gzip })),
    ),
    contentType: "application/json",
  });
  expect(chunks.length).toBeGreaterThan(0);
  expect(warningLimit).toBe(500);
  expect(chunks.some((chunk) => chunk.file.includes("-legacy-"))).toBe(true);
  expect(
    chunks.some((chunk) => /react-vendor-(?!legacy-)/.test(chunk.file)),
  ).toBe(true);
  expect(eagerHeavyModules).toEqual([]);
  expect(chunks.filter((chunk) => chunk.bytes > 500_000)).toEqual([]);
});
