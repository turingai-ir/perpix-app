import { expect, test, type Page } from "@playwright/test";

import { openEditor } from "./editor-mocks";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

/** How many pixels of the caption canvas are painted. */
const captionPixels = (page: Page) =>
  page.evaluate(() => {
    let painted = 0;
    document.querySelectorAll("canvas").forEach((canvas) => {
      const context = canvas.getContext("2d");
      if (!context || !canvas.width || !canvas.height) return;
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) painted++;
    });
    return painted;
  });

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

test("opens the project's video with its length and controls", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");

  await expect(page.getByText("۰:۰۰ / ۰:۰۲")).toBeVisible();
  await expect(page.getByRole("button", { name: "پخش" }).first()).toBeVisible();
  await expect(page.getByTestId("stage-video")).toHaveAttribute(
    "src",
    /f1\.webm/,
  );
});

test("playing moves the time forward and pausing stops it", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await expect(page.getByTestId("stage-video")).toHaveAttribute(
    "src",
    /f1\.webm/,
  );

  await page.getByRole("button", { name: "پخش" }).first().click();
  await expect(page.getByText("۰:۰۰ / ۰:۰۲")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "توقف" }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "توقف" }).first().click();
  await expect(page.getByRole("button", { name: "پخش" }).first()).toBeVisible();
});

test("the caption is drawn on the video where a word is spoken, and not where nobody speaks", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await expect(page.getByTestId("stage-video")).toHaveAttribute(
    "src",
    /f1\.webm/,
  );

  await seekTo(page, 50);
  await expect.poll(() => captionPixels(page)).toBe(0);

  await seekTo(page, 500);
  await expect
    .poll(() => captionPixels(page), { timeout: 10_000 })
    .toBeGreaterThan(200);
});

test("while the subtitles are still being made the editor says so and plays without them", async ({
  page,
}) => {
  await openEditor(page, "PROCESSING");

  await expect(
    page.getByRole("status").filter({ hasText: "زیرنویس هنوز در حال ساخته" }),
  ).toBeVisible();
  await seekTo(page, 500);
  await expect.poll(() => captionPixels(page)).toBe(0);
});

const clipsOf = (save: { document: Record<string, unknown> }) =>
  (
    (save.document.tracks as Array<{ kind: string; clips: unknown[] }>).find(
      (track) => track.kind === "video",
    )?.clips ?? []
  ).map((clip) => {
    const { source_in_ms: from, source_out_ms: to } = clip as {
      source_in_ms: number;
      source_out_ms: number;
    };
    return [from, to];
  });

const ready = async (page: Page) => {
  await expect(page.getByTestId("stage-video")).toHaveAttribute(
    "src",
    /f1\.webm/,
  );
};

test("splitting at the playhead makes two clips and saves them by itself", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await ready(page);
  await expect(page.getByTestId("timeline-clip")).toHaveCount(1);

  await seekTo(page, 1000);
  await page.getByRole("button", { name: "جدا کردن" }).click();

  await expect(page.getByTestId("timeline-clip")).toHaveCount(2);
  await expect.poll(() => saves.length, { timeout: 8000 }).toBe(1);
  expect(clipsOf(saves[0])).toEqual([
    [0, 1000],
    [1000, 2000],
  ]);
  await expect(
    page.getByRole("status").filter({ hasText: "ذخیره شد" }),
  ).toBeVisible();
});

test("a cut too close to the end of a clip is not offered", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED");
  await ready(page);

  await seekTo(page, 100);
  await expect(page.getByRole("button", { name: "جدا کردن" })).toBeDisabled();
  await seekTo(page, 1000);
  await expect(page.getByRole("button", { name: "جدا کردن" })).toBeEnabled();
});

test("trimming the end shortens the project and undo brings it back", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await ready(page);

  await seekTo(page, 1200);
  await page.getByRole("button", { name: "حذف بعد" }).click();
  await expect(page.getByText("۰:۰۱", { exact: false }).first()).toBeVisible();
  await expect.poll(() => saves.length, { timeout: 8000 }).toBe(1);
  expect(clipsOf(saves[0])).toEqual([[0, 1200]]);

  await page.getByRole("button", { name: "برگرداندن" }).click();
  await expect.poll(() => saves.length, { timeout: 8000 }).toBe(2);
  expect(clipsOf(saves[1])).toEqual([[0, 2000]]);
  await expect(page.getByRole("button", { name: "برگرداندن" })).toBeDisabled();
});

test("a split half can be removed and the one left plays on", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await ready(page);

  await seekTo(page, 1000);
  await page.getByRole("button", { name: "جدا کردن" }).click();
  await page.getByRole("button", { name: "حذف کلیپ" }).click();

  await expect(page.getByTestId("timeline-clip")).toHaveCount(1);
  await expect.poll(() => saves.length, { timeout: 8000 }).toBeGreaterThan(0);
  expect(clipsOf(saves.at(-1)!)).toEqual([[0, 1000]]);
});

test("a split half moves later and the order is saved", async ({ page }) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await ready(page);

  await seekTo(page, 1000);
  await page.getByRole("button", { name: "جدا کردن" }).click();
  await seekTo(page, 100);
  await page.getByRole("button", { name: "عقب‌تر" }).click();

  await expect.poll(() => saves.length, { timeout: 8000 }).toBeGreaterThan(0);
  expect(clipsOf(saves.at(-1)!)).toEqual([
    [1000, 2000],
    [0, 1000],
  ]);
});

test("leaving saves the last edit first", async ({ page }) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await ready(page);

  await seekTo(page, 1000);
  await page.getByRole("button", { name: "جدا کردن" }).click();
  await page.getByRole("button", { name: "برگشت" }).click();

  await expect(page).toHaveURL(/\/studio\/p1$/);
  expect(saves).toHaveLength(1);
  expect(clipsOf(saves[0])).toHaveLength(2);
});
