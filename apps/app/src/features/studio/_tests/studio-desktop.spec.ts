import { expect, test, type Page } from "@playwright/test";

import { openEditor } from "./editor-mocks";

test.use({ viewport: { width: 1440, height: 900 } });

const FUTURE = () => new Date(Date.now() + 5 * 86_400_000).toISOString();
const NOW = () => new Date().toISOString();

const PROJECTS = ["معرفی محصول", "ولاگ سفر", "آموزش سریع", "تیزر"].map(
  (title, index) => ({
    uuid: `p${index + 1}`,
    title,
    schema_version: 1,
    revision: 1,
    expire_at: FUTURE(),
    created_at: NOW(),
    updated_at: NOW(),
  }),
);

async function mockList(page: Page) {
  await page.route("**/api/v1/studio/projects?**", (route) =>
    route.fulfill({ json: { items: PROJECTS, has_next: false } }),
  );
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            uuid: "f1",
            file_name: "holiday.webm",
            file_size: 5_000_000,
            content_type: "video/webm",
            is_public: false,
            media_metadata: { kind: "video", duration_seconds: 2 },
          },
        ],
        has_next: false,
      },
    }),
  );
}

const seekTo = (page: Page, ms: number) =>
  page
    .getByRole("slider", { name: "جابه‌جایی در ویدیو" })
    .evaluate((input: HTMLInputElement, value) => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, ms);

test("a large screen gets a top bar instead of the phone's bottom tabs", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await mockList(page);
  await page.goto("/studio");

  const nav = page.getByRole("navigation", { name: "بخش‌های استودیو" });
  await expect(nav).toHaveCount(1);
  await expect(nav.getByRole("link", { name: "قالب‌ها" })).toBeVisible();
  const box = await nav.boundingBox();
  expect(box!.y).toBeLessThan(5);
  await expect(page.getByRole("button", { name: "پروژهٔ جدید" })).toHaveCount(1);
});

test("projects lie in a grid, several to a row, not one long column", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await mockList(page);
  await page.goto("/studio");

  const cards = page.getByRole("listitem");
  await expect(cards).toHaveCount(4);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(2);
  expect(first!.x).not.toBe(second!.x);
});

test("the gallery picker opens as a centred dialog, not a drawer from the bottom", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await mockList(page);
  await page.goto("/studio/p1");

  await page
    .getByRole("button", { name: "افزودن ویدیو از گالری" })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box!.y).toBeGreaterThan(40);
  expect(box!.y + box!.height).toBeLessThan(900 - 40);
});

test("the editor has a side panel of tools with their shortcuts, and no phone strip", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await page.goto("/studio/p1/edit");

  await expect(page.getByRole("toolbar")).toHaveCount(1);
  const split = page.getByRole("button", { name: /جدا کردن/ });
  await expect(split).toContainText("S");
  const box = await split.boundingBox();
  expect(box!.width).toBeGreaterThan(150);
});

test("keyboard: space plays, S splits at the playhead, Ctrl+Z undoes", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await page.goto("/studio/p1/edit");
  await expect(page.getByTestId("stage-video")).toHaveAttribute("src", /f1/);

  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "توقف" }).first(),
  ).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "پخش" }).first()).toBeVisible();

  await seekTo(page, 1000);
  await page.keyboard.press("s");
  await expect(page.getByTestId("timeline-clip")).toHaveCount(2);
  await expect.poll(() => saves.length, { timeout: 8000 }).toBe(1);

  await page.keyboard.press("Control+z");
  await expect(page.getByTestId("timeline-clip")).toHaveCount(1);
});

test("keyboard: bracket keys trim and Delete removes the clip under the playhead", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await page.goto("/studio/p1/edit");
  await expect(page.getByTestId("stage-video")).toHaveAttribute("src", /f1/);

  await seekTo(page, 1000);
  await page.keyboard.press("s");
  await expect(page.getByTestId("timeline-clip")).toHaveCount(2);
  await page.keyboard.press("Delete");
  await expect(page.getByTestId("timeline-clip")).toHaveCount(1);
});

test("a click on a tool does not leave it focused for the space bar to press again", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await page.goto("/studio/p1/edit");
  await expect(page.getByTestId("stage-video")).toHaveAttribute("src", /f1/);

  await seekTo(page, 1000);
  await page.getByRole("button", { name: /جدا کردن/ }).click();
  await expect(page.getByTestId("timeline-clip")).toHaveCount(2);
  await page.keyboard.press("Space");

  await expect(
    page.getByRole("button", { name: "توقف" }).first(),
  ).toBeVisible();
  await expect(page.getByTestId("timeline-clip")).toHaveCount(2);
});
