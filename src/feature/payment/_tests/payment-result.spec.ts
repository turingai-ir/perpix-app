import { expect, test } from "@playwright/test";

import {
  accessResponse,
  sessionHeaders,
  mockAnonymousSession,
  mockAuthenticatedSession,
  TEST_ACCESS_TOKEN,
} from "../../../../__tests__/support/auth-session";

test.beforeEach(async ({ page }) => {
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/payment-events", (route) =>
    route.fulfill({ contentType: "text/event-stream", body: "" }),
  );
});

const paymentId = "c0202000-0000-4000-8000-000000000001";

function paymentResponse(
  financialStatus: "PENDING" | "SUCCEEDED",
  fulfillmentStatus: "NOT_READY" | "PENDING" | "NEEDS_REVIEW" | "SUCCEEDED",
) {
  return {
    id: paymentId,
    execution_uuid: paymentId,
    status: financialStatus === "SUCCEEDED" ? "SUCCEEDED" : "PENDING",
    financial_status: financialStatus,
    fulfillment_status: fulfillmentStatus,
    requires_review: fulfillmentStatus === "NEEDS_REVIEW",
    currency: "IRR",
    amount: "250000",
    payment_url: null,
  };
}

test("paid payment awaiting fulfillment shows processing", async ({ page }) => {
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({ json: paymentResponse("SUCCEEDED", "PENDING") }),
  );
  await page.goto(`/payment/verify/${paymentId}`);
  await expect(
    page.getByRole("heading", {
      name: "پرداخت تأیید شد؛ داریم درخواستت رو تکمیل می‌کنیم",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("درخواستت هنوز کامل نشده."),
  ).toBeVisible();
});

test("payment under review does not claim the request was completed", async ({
  page,
}) => {
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({ json: paymentResponse("SUCCEEDED", "NEEDS_REVIEW") }),
  );
  await page.goto(`/payment/verify/${paymentId}`);
  await expect(
    page.getByRole("heading", { name: "پرداختت نیاز به بررسی داره" }),
  ).toBeVisible();
  await expect(
    page.getByText("درخواستت هنوز کامل نشده."),
  ).toBeVisible();
});

test("unverified return stays pending instead of showing failure", async ({
  page,
}) => {
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({ json: paymentResponse("PENDING", "NOT_READY") }),
  );
  await page.goto(`/payment/verify/${paymentId}`);
  await expect(
    page.getByRole("heading", { name: "منتظر نتیجهٔ پرداختیم" }),
  ).toBeVisible();
});

test("failed open payment retries without a client UUID", async ({ page }) => {
  const newExecutionUuid = "c0202000-0000-4000-8000-000000000007";
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({
      json: {
        ...paymentResponse("PENDING", "NOT_READY"),
        execution_uuid: route.request().url().endsWith(newExecutionUuid)
          ? newExecutionUuid
          : paymentId,
        status: route.request().url().endsWith(newExecutionUuid)
          ? "PENDING"
          : "FAILED",
      },
    }),
  );
  let retryKey: string | undefined;
  await page.route(
    `**/api/v1/payment-intents/${paymentId}/executions`,
    async (route) => {
      retryKey = route.request().headers()["idempotency-key"];
      await route.fulfill({
        json: {
          ...paymentResponse("PENDING", "NOT_READY"),
          execution_uuid: newExecutionUuid,
          status: "PENDING",
        },
        status: 201,
      });
    },
  );
  await page.goto(`/payment/verify/${paymentId}`);
  await page.getByRole("button", { name: "دوباره پرداخت کن" }).click();
  await expect(page).toHaveURL(`/payment/verify/${newExecutionUuid}`);
  expect(retryKey).toBeUndefined();
});

test("fulfilled payment uses a service-independent success message", async ({
  page,
}) => {
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({ json: paymentResponse("SUCCEEDED", "SUCCEEDED") }),
  );
  await page.goto(`/payment/verify/${paymentId}`);
  await expect(
    page.getByRole("heading", { name: "پرداخت تکمیل شد", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("درخواستت تکمیل شد.")).toBeVisible();
});

test("reviewed failed attempt cannot be retried", async ({ page }) => {
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({
      json: {
        ...paymentResponse("PENDING", "NOT_READY"),
        status: "FAILED",
        requires_review: true,
      },
    }),
  );
  await page.goto(`/payment/verify/${paymentId}`);
  await expect(
    page.getByRole("heading", { name: "پرداختت نیاز به بررسی داره" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "دوباره پرداخت کن" }),
  ).toHaveCount(0);
});

test("gateway return and reload restore the session before requesting payment status", async ({
  page,
}) => {
  const authorizations: (string | undefined)[] = [];
  await page.route("**/api/v1/payment-executions/*", (route) => {
    const authorization = route.request().headers().authorization;
    authorizations.push(authorization);
    return authorization === `Bearer ${TEST_ACCESS_TOKEN}`
      ? route.fulfill({ json: paymentResponse("SUCCEEDED", "SUCCEEDED") })
      : route.fulfill({ status: 401, json: { detail: "Unauthorized" } });
  });

  await page.goto(`/payment/verify/${paymentId}`);
  await expect(
    page.getByRole("heading", { name: "پرداخت تکمیل شد", exact: true }),
  ).toBeVisible();
  const beforeReload = authorizations.length;
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "پرداخت تکمیل شد", exact: true }),
  ).toBeVisible();
  await expect.poll(() => authorizations.length).toBeGreaterThan(beforeReload);
  expect(
    authorizations.every((value) => value === `Bearer ${TEST_ACCESS_TOKEN}`),
  ).toBe(true);
});

test("a returned payment with no usable session requires login before requesting private payment details", async ({
  page,
}) => {
  await mockAnonymousSession(page);
  let requestedPayment = false;
  await page.route("**/api/v1/payment-executions/*", (route) => {
    requestedPayment = true;
    return route.fulfill({ status: 401, json: { detail: "Unauthorized" } });
  });

  await page.goto(`/payment/verify/${paymentId}`);
  await expect(page).toHaveURL(
    `/auth/login?returnTo=${encodeURIComponent(`/payment/verify/${paymentId}`)}`,
  );
  expect(requestedPayment).toBe(false);
});

test("an expired session returns to the same payment after login and reload", async ({
  page,
}) => {
  let signedIn = false;
  await page.route("**/api/v1/auth/csrf", (route) =>
    signedIn
      ? route.fulfill({ json: { csrf_token: "csrf" } })
      : route.fulfill({ status: 401, json: { detail: "Unauthorized" } }),
  );
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({ json: { next_step: "password" } }),
  );
  await page.route("**/api/v1/auth/login", (route) => {
    signedIn = true;
    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({ json: paymentResponse("SUCCEEDED", "SUCCEEDED") }),
  );
  const destination = `/payment/verify/${paymentId}?source=bank`;
  await page.goto(destination);
  await expect(page).toHaveURL(new RegExp("/auth/login\\?returnTo="));
  await page.reload();
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByRole("button", { name: "ادامه دادن" }).click();
  await page.getByLabel("رمز عبور", { exact: true }).fill("secret");
  await page.getByRole("button", { name: /^ورود/ }).click();
  await expect(page).toHaveURL(destination);
  await expect(
    page.getByRole("heading", { name: "پرداخت تکمیل شد", exact: true }),
  ).toBeVisible();
});
