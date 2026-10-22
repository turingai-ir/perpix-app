import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures/image-settings";

type HistoryOptions = {
  total?: number;
  failNext?: () => boolean;
  waitForNext?: Promise<void>;
};

async function mockHistory(page: Page, options: HistoryOptions = {}) {
  const requests: URLSearchParams[] = [];
  // Keep the fixture's closed event stream from refetching history on reconnect.
  await page.route("**/api/v1/ai-task/events", (route) => route.abort());
  await page.route("**/api/v1/ai-task/list?**", async (route) => {
    const params = new URL(route.request().url()).searchParams;
    requests.push(params);
    const offset = Number(params.get("offset"));
    const limit = Number(params.get("limit"));
    if (offset > 0) {
      await options.waitForNext;
      if (options.failNext?.()) {
        await route.fulfill({ status: 500, json: { detail: "Try again" } });
        return;
      }
    }
    const taskType = params.get("task_type") ?? "IMAGE";
    const items = Array.from({ length: options.total ?? 12 }, (_, index) => ({
      uuid: `${taskType.toLowerCase()}-project-${index}`,
      task_type: taskType,
      created_at: new Date(Date.UTC(2026, 9, 22 - index)).toISOString(),
      updated_at: new Date(Date.UTC(2026, 9, 22 - index)).toISOString(),
      messages: [
        { message: `پروژهٔ ${index + 1} · ${taskType}`, role: "USER" },
      ],
    }));
    await route.fulfill({
      json: {
        items: items.slice(offset, offset + limit),
        has_next: offset + limit < items.length,
      },
    });
  });
  return requests;
}

for (const kind of ["image", "video"] as const) {
  test(`${kind} history loads five recent projects and five more only on request`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    let releaseNext: () => void = () => {};
    const waitForNext = new Promise<void>((resolve) => {
      releaseNext = resolve;
    });
    const requests = await mockHistory(page, { waitForNext });
    await page.goto(`/generation/${kind}`);
    const items = page.locator("[data-sidebar-history-item]");
    const more = page.locator('button[aria-controls="sidebar-history-list"]');
    await expect(items).toHaveCount(5);
    expect(requests[0].get("limit")).toBe("5");
    expect(requests[0].get("task_type")).toBe(kind.toUpperCase());
    await more.scrollIntoViewIfNeeded();
    expect(requests.every((params) => params.get("offset") === "0")).toBe(true);
    await more.click();
    await expect(more).toBeDisabled();
    await expect(items).toHaveCount(5);
    releaseNext();
    await expect(items).toHaveCount(10);
    await expect(more).toBeEnabled();
    await more.click();
    await expect(items).toHaveCount(12);
    await expect(more).toHaveCount(0);
    expect(
      requests
        .map((params) => params.get("offset"))
        .filter((offset) => offset !== "0"),
    ).toEqual(["5", "10"]);
    await expect(items.first()).toHaveAttribute(
      "href",
      `/generation/${kind}/${kind}-project-0`,
    );
  });
}

test("history retains loaded projects after a pagination error and retries in place", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let failNext = true;
  await mockHistory(page, { failNext: () => failNext });
  await page.goto("/generation/image");
  const items = page.locator("[data-sidebar-history-item]");
  await expect(items).toHaveCount(5);
  await page.getByRole("button", { name: /نمایش.*پروژهٔ دیگر/ }).click();
  const retry = page.getByRole("button", { name: "تلاش دوباره" });
  await expect(retry).toBeVisible();
  await expect(items).toHaveCount(5);
  failNext = false;
  await retry.click();
  await expect(items).toHaveCount(10);
});

for (const width of [375, 768, 1440]) {
  test(`history is usable in RTL at ${width}px with reduced motion and keyboard pagination`, async ({
    page,
  }) => {
    const heights: Record<number, number> = { 375: 812, 768: 1024, 1440: 900 };
    await page.setViewportSize({ width, height: heights[width] });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mockHistory(page);
    await page.goto("/generation/image");
    if (width < 1024) {
      await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    }
    const items = page.locator("[data-sidebar-history-item]");
    await expect(items).toHaveCount(5);
    const more = page.getByRole("button", { name: /نمایش.*پروژهٔ دیگر/ });
    await more.scrollIntoViewIfNeeded();
    await expect(more).toBeVisible();
    await more.focus();
    await page.keyboard.press("Enter");
    await expect(items).toHaveCount(10);
    await expect(more).toBeFocused();
    expect(
      await items
        .last()
        .locator("..")
        .evaluate((element) => getComputedStyle(element).transitionDuration),
    ).toBe("0s");
    const panel = page.getByRole("region", { name: "ساخته‌های اخیر" });
    expect(
      await panel.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    await panel.screenshot({ path: `.artifacts/history-${width}.png` });
  });
}

test("history has a quiet empty state without a load-more button", async ({
  page,
}) => {
  await mockHistory(page, { total: 0 });
  await page.goto("/generation/video");
  await expect(
    page.getByText("پروژه‌های تازه‌ات اینجا دیده می‌شوند."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /نمایش.*پروژهٔ دیگر/ }),
  ).toHaveCount(0);
});
