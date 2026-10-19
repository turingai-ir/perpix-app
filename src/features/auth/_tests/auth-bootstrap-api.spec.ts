import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  TEST_ACCESS_TOKEN,
} from "../../../../__tests__/support/auth-session";

type AuthorizedFetchModule = typeof import("../services/authorized-fetch");

test("concurrent private requests wait for the initial session restore", async ({
  page,
}) => {
  await mockAuthenticatedSession(page);
  await page.route("**/auth-bootstrap-harness", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body></body></html>",
    }),
  );
  let refreshes = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/v1/auth/refresh")) refreshes += 1;
  });
  await page.goto("/auth-bootstrap-harness");

  const results = await page.evaluate(async () => {
    const modulePath = "/src/features/auth/services/authorized-fetch.ts";
    const auth: AuthorizedFetchModule = await import(modulePath);
    const request = auth.createAuthorizedFetch(async (input: Request) =>
      Response.json({ authorization: input.headers.get("Authorization") }),
    );
    const responses = await Promise.all([
      request(
        `${location.origin}/api/v1/payment-executions/11111111-1111-4111-8111-111111111111`,
      ),
      request(`${location.origin}/api/v1/wallet/wallet`),
    ]);
    return Promise.all(responses.map((response) => response.json()));
  });

  expect(results).toEqual([
    { authorization: `Bearer ${TEST_ACCESS_TOKEN}` },
    { authorization: `Bearer ${TEST_ACCESS_TOKEN}` },
  ]);
  expect(refreshes).toBe(1);
});
