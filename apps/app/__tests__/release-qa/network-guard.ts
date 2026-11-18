import type { BrowserContext, Route } from "@playwright/test";

const APP_ORIGIN = "http://localhost:5173";

type MockResponse = Pick<
  NonNullable<Parameters<Route["fulfill"]>[0]>,
  "status" | "headers" | "body" | "json" | "contentType"
>;

type NetworkMock = {
  method: string;
  url: string;
  response: MockResponse;
};

type NetworkEvent = {
  action: "mocked" | "blocked";
  transport: "http" | "websocket";
  destination: "local" | "external";
  method: string;
};

// Browser-layer defense only: page routes, APIRequestContext and Node can bypass it.
// Use exclusively in dedicated specs inside an OS-enforced, no-egress sandbox.
export async function installQaNetworkGuard(context: BrowserContext) {
  if (context.serviceWorkers().length) {
    throw new Error("QA requires a context without existing service workers");
  }

  const mocks: NetworkMock[] = [];
  const events: NetworkEvent[] = [];
  const blockedResourceTypes: string[] = [];

  await context.routeWebSocket("**/*", async (socket) => {
    blockedResourceTypes.push("websocket");
    events.push({
      action: "blocked",
      transport: "websocket",
      destination:
        new URL(socket.url()).origin === "ws://localhost:5173"
          ? "local"
          : "external",
      method: "CONNECT",
    });
    await socket.close({ code: 1008, reason: "QA network isolation" });
  });

  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const event: NetworkEvent = {
      action: "blocked",
      transport: "http",
      destination: url.origin === APP_ORIGIN ? "local" : "external",
      method: request.method(),
    };
    const mock = mocks.find(
      (entry) => entry.method === request.method() && entry.url === url.href,
    );
    const status = mock?.response.status ?? 200;
    // Redirect interception differs by engine. Never issue an HTTP redirect.
    if (mock && !(status >= 300 && status < 400)) {
      events.push({ ...event, action: "mocked" });
      await route.fulfill(mock.response);
      return;
    }

    // Never log request URLs, query strings, headers or bodies.
    events.push(event);
    blockedResourceTypes.push(
      request.headers().accept?.includes("text/event-stream")
        ? "eventsource"
        : request.resourceType(),
    );
    await route.abort("blockedbyclient");
  });

  return {
    events,
    blockedResourceTypes,
    mock(entry: NetworkMock) {
      if (
        mocks.some(
          (mock) => mock.method === entry.method && mock.url === entry.url,
        )
      ) {
        throw new Error("Duplicate QA network mock");
      }
      mocks.push(entry);
    },
  };
}
