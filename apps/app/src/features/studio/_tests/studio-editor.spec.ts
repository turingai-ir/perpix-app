import { expect, test, type Page } from "@playwright/test";

import { openEditor, seekTo } from "./editor-mocks";

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
    (
      save.document.tracks as
        Array<{ kind: string; clips: unknown[] }> | undefined
    )?.find((track) => track.kind === "video")?.clips ?? []
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

test("corrects a Persian word in preview and keeps it after reopening and moving its clip", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED");
  await ready(page);
  await seekTo(page, 500);
  await expect.poll(() => captionPixels(page)).toBeGreaterThan(200);
  const before = await captionPixels(page);

  const editCaptions = page.getByRole("button", { name: "ویرایش زیرنویس" });
  const sheet = page.getByRole("dialog", { name: "ویرایش زیرنویس" });
  const word = sheet.getByRole("textbox", { name: "متن کلمه" });
  await editCaptions.click();
  await sheet.getByRole("button", { name: "سلام", exact: true }).click();
  await word.fill("درود بر شما");
  await sheet.getByRole("button", { name: "ثبت اصلاح" }).click();
  await expect(sheet).toBeHidden();
  await seekTo(page, 500);
  await expect.poll(() => captionPixels(page)).not.toBe(before);

  await seekTo(page, 950);
  await page.getByRole("button", { name: "جدا کردن" }).click();
  await seekTo(page, 500);
  await page.getByRole("button", { name: "عقب‌تر" }).click();
  await expect
    .poll(() => clipsOf(saves.at(-1) ?? { document: {} }).length)
    .toBe(2);
  await expect(
    page.getByRole("status").filter({ hasText: "ذخیره شد" }),
  ).toBeVisible();

  await page.reload();
  await ready(page);
  await seekTo(page, 1700);
  await editCaptions.click();
  await sheet.getByRole("button", { name: "درود بر شما", exact: true }).click();
  await expect(word).toHaveValue("درود بر شما");
  await sheet.getByRole("button", { name: "بازگردانی متن اصلی" }).click();
  await expect(sheet).toBeHidden();

  await page.getByRole("button", { name: "برگشت" }).click();
  await expect(page).toHaveURL(/\/studio\/p1$/);
  await page.goto("/studio/p1/edit");
  await ready(page);
  await seekTo(page, 1700);
  await editCaptions.click();
  await expect(
    sheet.getByRole("button", { name: "سلام", exact: true }),
  ).toBeVisible();
});

test("a revision conflict keeps the corrected word in the editor", async ({
  page,
}) => {
  const { saves, changeServerRevision } = await openEditor(page, "COMPLETED");
  await ready(page);
  const editCaptions = page.getByRole("button", { name: "ویرایش زیرنویس" });
  const sheet = page.getByRole("dialog", { name: "ویرایش زیرنویس" });
  await editCaptions.click();
  await sheet.getByRole("button", { name: "سلام", exact: true }).click();
  await sheet.getByRole("textbox", { name: "متن کلمه" }).fill("درود");
  changeServerRevision();
  await sheet.getByRole("button", { name: "ثبت اصلاح" }).click();

  await expect(
    page.getByText("تعارض در ذخیرهٔ پروژه", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "برگشت" }).click();
  await expect(page).toHaveURL(/\/studio\/p1\/edit$/);
  await editCaptions.click();
  await expect(
    sheet.getByRole("button", { name: "درود", exact: true }),
  ).toBeVisible();
  expect(saves).toHaveLength(0);
});

test("a failed save can be retried with the same correction", async ({
  page,
}) => {
  const { saves, failNextSave } = await openEditor(page, "COMPLETED");
  await ready(page);
  const sheet = page.getByRole("dialog", { name: "ویرایش زیرنویس" });
  await page.getByRole("button", { name: "ویرایش زیرنویس" }).click();
  await sheet.getByRole("button", { name: "سلام", exact: true }).click();
  await sheet.getByRole("textbox", { name: "متن کلمه" }).fill("درود");
  failNextSave();
  await sheet.getByRole("button", { name: "ثبت اصلاح" }).click();

  const retry = page.getByRole("button", { name: "ذخیره نشد؛ دوباره" });
  await expect(retry).toBeVisible();
  expect(saves).toHaveLength(0);
  await retry.click();
  await expect(
    page.getByRole("status").filter({ hasText: "ذخیره شد" }),
  ).toBeVisible();
  expect(saves[0]?.document.caption_corrections).toEqual({ "t1:0": "درود" });
});

test("previews phrase replacements and saves only the selected occurrence", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED", async () => {
    await page.route("**/api/v1/studio/transcripts/t1", (route) =>
      route.fulfill({
        json: {
          uuid: "t1",
          file_uuid: "f1",
          status: "COMPLETED",
          language: "fa",
          duration_ms: 2000,
          failure_message: null,
          created_at: "2026-01-01T00:00:00Z",
          expire_at: "2099-01-01T00:00:00Z",
          text: "روی White board و white board",
          words: ["روی", "White", "board", "و", "white", "board"].map(
            (text, index) => ({
              text,
              start_ms: index * 230 + 200,
              end_ms: index * 230 + 390,
              speaker: null,
            }),
          ),
        },
      }),
    );
  });
  await ready(page);
  const edit = page.getByRole("button", { name: "ویرایش زیرنویس" });
  await edit.click();
  const sheet = page.getByRole("dialog", { name: "ویرایش زیرنویس" });
  await sheet.getByRole("button", { name: "اصلاح همه" }).click();
  await sheet
    .getByRole("textbox", { name: "عبارت مورد جست‌وجو" })
    .fill("white board");
  await sheet.getByRole("textbox", { name: "عبارت جایگزین" }).fill("وایت‌برد");
  await sheet.getByRole("button", { name: "یافتن موارد" }).click();
  const matches = sheet.getByRole("checkbox");
  await expect(matches).toHaveCount(2);
  await matches.nth(1).uncheck();
  await sheet.getByRole("button", { name: "اعمال اصلاح‌ها" }).click();

  await expect
    .poll(() => saves.at(-1)?.document.caption_corrections)
    .toEqual({
      "t1:1": { text: "وایت‌برد", wordCount: 2 },
    });
  await page.reload();
  await ready(page);
  await edit.click();
  await expect(
    sheet.getByRole("button", { name: "وایت‌برد", exact: true }),
  ).toBeVisible();
  await expect(
    sheet.getByRole("button", { name: "board", exact: true }),
  ).toHaveCount(1);
});

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
