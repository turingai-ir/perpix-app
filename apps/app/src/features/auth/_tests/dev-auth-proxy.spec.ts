import { EventEmitter } from "node:events";

import { expect, test } from "@playwright/test";
import { resolveConfig } from "vite";

test("development auth proxy forwards the API origin only for local app requests", async () => {
  const config = await resolveConfig({}, "serve", "development");
  const authProxy = config.server.proxy?.["/api/v1/auth"];
  expect(authProxy && typeof authProxy !== "string").toBeTruthy();
  if (!authProxy || typeof authProxy === "string") return;

  const proxy = new EventEmitter();
  authProxy.configure?.(
    proxy as Parameters<NonNullable<typeof authProxy.configure>>[0],
    authProxy,
  );

  const forwardedHeaders = new Map<string, string>();
  const outgoingRequest = {
    setHeader: (name: string, value: string) => {
      forwardedHeaders.set(name.toLowerCase(), value);
    },
  };
  const apiOrigin = new URL(String(authProxy.target)).origin;

  proxy.emit("proxyReq", outgoingRequest, {
    headers: {
      origin: "http://localhost:5173",
      referer: "http://localhost:5173/editor?tool=paint",
    },
  });
  expect(forwardedHeaders.get("origin")).toBe(apiOrigin);
  expect(forwardedHeaders.get("referer")).toBe(
    `${apiOrigin}/editor?tool=paint`,
  );

  forwardedHeaders.clear();
  proxy.emit("proxyReq", outgoingRequest, {
    headers: { referer: "http://localhost:5173/editor" },
  });
  expect(forwardedHeaders.get("referer")).toBe(`${apiOrigin}/editor`);

  forwardedHeaders.clear();
  proxy.emit("proxyReq", outgoingRequest, {
    headers: {
      origin: "https://untrusted.example",
      referer: "http://localhost:5173/editor",
    },
  });
  expect(forwardedHeaders.size).toBe(0);
});
