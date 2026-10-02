import { expect, test } from "@playwright/test";

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
      name: "پرداخت انجام شد؛ در حال تکمیل درخواست",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("درخواست شما هنوز تکمیل نشده است."),
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
    page.getByRole("heading", { name: "پرداخت نیاز به بررسی دارد" }),
  ).toBeVisible();
  await expect(
    page.getByText("درخواست شما هنوز تکمیل نشده است."),
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
    page.getByRole("heading", { name: "در انتظار نتیجه پرداخت" }),
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
  await page.getByRole("button", { name: "تلاش دوباره برای پرداخت" }).click();
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
  await expect(page.getByText("درخواست شما با موفقیت تکمیل شد.")).toBeVisible();
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
    page.getByRole("heading", { name: "پرداخت نیاز به بررسی دارد" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "تلاش دوباره برای پرداخت" }),
  ).toHaveCount(0);
});
