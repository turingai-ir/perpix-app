import type { Plugin } from "vite";

export function frontendQaGuard(): Plugin {
  return {
    name: "frontend-qa-no-backend",
    configureServer(server) {
      let ready: Promise<void> | undefined;
      server.middlewares.use((request, response, next) => {
        let path: string;
        try {
          path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost:5173").pathname);
        } catch {
          response.writeHead(400).end();
          return;
        }
        if (path === "/__qa/ready") {
          ready ??= Promise.all([
            "/src/app/main.tsx",
            "/src/features/auth/_tests/auth-reliability-harness.ts",
            "/src/shared/utils/custom-fetch/custom-fetch.ts",
          ].map((entry) => server.transformRequest(entry))).then(async (results) => {
            const dependencies = new Set<string>();
            for (const result of results) {
              for (const match of result?.code.matchAll(/["'](\/[^"']*\/deps\/[^"']+)["']/g) ?? []) {
                if (match[1]) {
                  dependencies.add(match[1]);
                }
              }
            }
            await Promise.all([...dependencies].map((entry) => server.transformRequest(entry)));
            console.log(`QA_WARMUP_COMPLETE dependencies=${dependencies.size}`);
          });
          void ready.then(() => response.writeHead(200).end("QA_READY"), () => response.writeHead(500).end("QA_WARMUP_FAILED"));
          return;
        }
        if (!['GET', 'HEAD'].includes(request.method ?? '') || /^\/(api|graphql)(\/|$)/i.test(path)) {
          console.error(`QA_BLOCKED_API ${request.method} ${path}`);
          response.writeHead(503, { "content-type": "application/json" });
          response.end(JSON.stringify({ detail: "QA_UNMOCKED_REQUEST_BLOCKED" }));
          return;
        }
        next();
      });
    },
  };
}
