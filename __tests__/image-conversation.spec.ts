import type { Page } from "@playwright/test";

import {
  compatibleModelUuid,
  conversationMessages,
  expect,
  generatedImageUuid,
  incompatibleModelUuid,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

const labels = {
  addToCompare: "افزودن به مقایسه",
  closePromptEditor: "انصراف و بستن ویرایشگر پرامپت",
  confirmRegenerate: "تأیید و ساخت",
  compareMinimum: "برای مقایسه، یه عکس دیگه هم انتخاب کن.",
  editRequest: "ویرایش درخواست",
  focusLocked: "بعد از آماده‌شدن این عکس، می‌تونی درخواست بعدی رو ثبت کنی.",
  focusProgress: "مراحل ساخت تصویر",
  focusSubmitting: "درخواستت در حال ثبت است",
  ambiguousFailure:
    "معلوم نیست این درخواست ثبت شده یا نه. قبل از تلاش دوباره، تاریخچه رو چک کن تا اعتبارت دوباره مصرف نشه؛ بعد از فرم پایین صفحه استفاده کن.",
  incompatibleReference:
    "این عکس برای پیام بعدی آماده‌ست. یه مدل سازگار انتخاب کن؛ اگه جا برای مرجع تازه نداری، یکی از عکس‌های فعلی رو حذف کن. هنوز چیزی ساخته نمی‌شه.",
  pending: "داریم عکست رو می‌سازیم…",
  referenceImages: "تصاویر مرجع",
  selectedForCompare: "انتخاب‌شده برای مقایسه",
  regenerate: "ساخت دوباره",
  result: "تصویر آماده است",
  useAsReference: "استفاده به‌عنوان مرجع",
} as const;

const prompt = "A cinematic lighthouse above a stormy sea";

for (const viewport of [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`generation steps stay centered at ${viewport.width}x${viewport.height}`, async ({
    page,
    imageConversationApi,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    imageConversationApi.setTaskMessages(
      conversationMessages({ prompt, status: "IN_PROGRESS" }),
    );
    await page.goto(`/generation/image/${taskUuid}`);
    const steps = page.getByRole("list", { name: labels.focusProgress });
    await expect(steps).toBeVisible();
    await expect(steps.locator('[aria-current="step"]')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await steps.locator("li").evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        const marker = item.querySelector("span")!.getBoundingClientRect();
        const icon = item.querySelector("svg")?.getBoundingClientRect();
        return {
          width: box.width,
          centerError: Math.abs(
            marker.x + marker.width / 2 - box.x - box.width / 2,
          ),
          markerY: marker.y,
          iconError: icon
            ? Math.abs(icon.y + icon.height / 2 - marker.y - marker.height / 2)
            : 0,
        };
      }),
    );
    for (const item of geometry) {
      expect(item.centerError).toBeLessThan(1);
      expect(item.iconError).toBeLessThan(1);
      expect(Math.abs(item.width - geometry[0].width)).toBeLessThan(1);
      expect(Math.abs(item.markerY - geometry[0].markerY)).toBeLessThan(1);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(imageConversationApi.generateRequests).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath("generation-steps.png"),
      fullPage: true,
    });
  });
}

async function openNewConversation(page: Page) {
  await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
  await expect(
    page
      .getByRole("combobox")
      .filter({ hasText: "Conversation image fixture" }),
  ).toBeVisible();
}

async function selectRatio(page: Page, ratio: "16:9" | "9:16") {
  await page.getByRole("combobox", { name: "قاب تصویر" }).click();
  await page.getByRole("button", { name: ratio, exact: true }).click();
}

async function submitPrompt(page: Page, value = prompt) {
  await page.getByRole("textbox", { name: "توصیف تصویر" }).fill(value);
  await page.getByRole("button", { name: "ساخت تصویر" }).click();
}

async function openSuccessfulConversation(
  page: Page,
  setTaskMessages: (messages: ReturnType<typeof conversationMessages>) => void,
  options?: { modelUuid?: string; prompt?: string },
) {
  const messages = conversationMessages({
    modelUuid: options?.modelUuid,
    prompt: options?.prompt ?? prompt,
  });
  setTaskMessages(messages);
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.locator("article").filter({ hasText: labels.result }),
  ).toBeVisible();
}

for (const viewport of [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`missing generated image preserves the conversation at ${viewport.width}px`, async ({
    imageConversationApi,
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    imageConversationApi.setTaskMessages(conversationMessages({ prompt }));
    await page.route("**/file-manager/files/presigned-urls", (route) =>
      route.fulfill({ json: { files: [] } }),
    );
    await page.goto(`/generation/image/${taskUuid}`);

    const result = page.locator("article").filter({ hasText: labels.result });
    const unavailable = result.getByRole("status");
    await expect(unavailable).toContainText("این فایل دیگه در دسترس نیست");
    expect(
      await unavailable.evaluate(
        (element) => element.scrollHeight <= element.clientHeight + 1,
      ),
    ).toBe(true);
    await expect(
      result.getByRole("button", { name: labels.useAsReference }),
    ).toBeDisabled();
    await expect(
      result.getByRole("button", { name: labels.addToCompare }),
    ).toBeDisabled();
    await expect(
      result.getByRole("button", { name: "تلاش دوباره" }),
    ).toHaveCount(0);
    await expect(page.getByText(prompt)).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const editRequest = result.getByRole("button", {
      name: labels.editRequest,
    });
    expect((await editRequest.boundingBox())!.height).toBeGreaterThanOrEqual(
      44,
    );
    await editRequest.click();
    await expect(
      page.getByRole("textbox", { name: "توصیف تصویر" }),
    ).toHaveValue(prompt);
    expect(imageConversationApi.generateRequests).toEqual([]);
  });
}

test("temporary image preview failure offers retry without claiming the file expired", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(conversationMessages({ prompt }));
  let interrupted = true;
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    interrupted ? route.fulfill({ status: 503, json: {} }) : route.fallback(),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  const result = page.locator("article").filter({ hasText: labels.result });
  await expect(result.getByRole("alert")).toContainText("پیش‌نمایش");
  await expect(result.getByText("این فایل دیگه در دسترس نیست")).toHaveCount(0);
  interrupted = false;
  await result.getByRole("button", { name: "تلاش دوباره" }).click();
  await expect(result.getByRole("button", { name: "عکس" })).toBeVisible();
});

test("a broken image URL refreshes its link instead of claiming seven-day expiry", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(conversationMessages({ prompt }));
  let previewRequests = 0;
  await page.route("**/file-manager/files/presigned-urls", (route) => {
    const previewUrl = previewRequests++
      ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'/%3E"
      : "http://localhost:5173/test-expired-image.svg";
    return route.fulfill({
      json: {
        files: [
          {
            file_uuid: generatedImageUuid,
            preview_url: previewUrl,
            download_url: "data:text/plain,mocked-image",
          },
        ],
      },
    });
  });
  await page.route("**/test-expired-image.svg", (route) =>
    route.fulfill({ status: 404, body: "Stale link" }),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  const result = page.locator("article").filter({ hasText: labels.result });
  await expect(result.getByRole("alert")).toContainText("پیش‌نمایش");
  await expect(result.getByText("این فایل دیگه در دسترس نیست")).toHaveCount(0);
  await result.getByRole("button", { name: "تلاش دوباره" }).click();
  await expect(result.getByRole("alert")).toHaveCount(0);
  await expect(result.getByRole("button", { name: "عکس" })).toBeVisible();
  expect(previewRequests).toBe(2);
});

test("expanded prompt editor can be dismissed without applying or generating", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  const composerPrompt = page.getByRole("textbox", { name: "توصیف تصویر" });
  await composerPrompt.fill(prompt);
  await page.getByRole("button", { name: "بزرگ‌کردن و ویرایش پرامپت" }).click();

  const editor = page.getByRole("dialog", {
    name: "ویرایش کامل پرامپت",
  });
  await editor.getByRole("textbox", { name: "توصیف تصویر" }).fill("لغو شود");
  await editor.getByRole("button", { name: labels.closePromptEditor }).click();

  await expect(editor).toBeHidden();
  await expect(composerPrompt).toHaveValue(prompt);
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("mobile studio keeps the full creation path compact and touch friendly", async ({
  imageConversationApi,
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) > 640,
    "Mobile layout assertion",
  );

  await openNewConversation(page);

  const intro = page.locator("[data-generation-intro]");
  const card = page.locator("[data-generation-composer-card]");
  const submit = card.locator('button[type="submit"]');
  await expect(intro).toBeVisible();
  await expect(card).toBeVisible();
  await expect(submit).toBeVisible();

  const layout = await page.evaluate(() => {
    const introElement = document.querySelector<HTMLElement>(
      "[data-generation-intro]",
    );
    const cardElement = document.querySelector<HTMLElement>(
      "[data-generation-composer-card]",
    );
    const submitElement = cardElement?.querySelector<HTMLElement>(
      'button[type="submit"]',
    );
    const buttonSizes = Array.from(
      cardElement?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    )
      .filter((button) => button.getClientRects().length > 0)
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return { height: rect.height, width: rect.width };
      });

    return {
      buttonSizes,
      card: cardElement?.getBoundingClientRect().toJSON(),
      intro: introElement?.getBoundingClientRect().toJSON(),
      noHorizontalOverflow:
        document.documentElement.scrollWidth <= window.innerWidth,
      submit: submitElement?.getBoundingClientRect().toJSON(),
      viewportHeight: window.innerHeight,
    };
  });

  expect(layout.noHorizontalOverflow).toBe(true);
  expect(layout.intro?.top).toBeLessThanOrEqual(96);
  expect(layout.intro?.height).toBeLessThanOrEqual(280);
  expect(layout.card?.top).toBeGreaterThanOrEqual(layout.intro?.bottom ?? 0);
  expect(
    (layout.card?.top ?? 0) - (layout.intro?.bottom ?? 0),
  ).toBeLessThanOrEqual(24);
  expect(layout.submit?.bottom).toBeLessThanOrEqual(layout.viewportHeight);
  for (const button of layout.buttonSizes) {
    expect(button.height).toBeGreaterThanOrEqual(43);
    expect(button.width).toBeGreaterThanOrEqual(43);
  }
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("fully mocked focused generation flow never reaches the real provider", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await selectRatio(page, "16:9");
  await submitPrompt(page);

  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  const focusState = page
    .getByRole("status")
    .filter({ hasText: labels.focusLocked });
  await expect(focusState).toContainText(labels.focusSubmitting);
  await expect(
    focusState.getByRole("list", { name: labels.focusProgress }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "توصیف تصویر" }),
  ).toBeDisabled();

  await imageConversationApi.resolveGeneration(
    conversationMessages({ aspectRatio: "16:9", prompt }),
  );

  await expect(focusState).toHaveCount(0);
  await expect(
    page.getByRole("textbox", { name: "توصیف تصویر" }),
  ).toBeEnabled();

  const result = page.locator("article").filter({ hasText: labels.result });
  await result.getByRole("button", { name: labels.addToCompare }).click();
  await expect(page.getByText(labels.compareMinimum)).toBeVisible();
  await result.getByRole("button", { name: labels.useAsReference }).click();
  await expect(
    page
      .getByRole("list", { name: labels.referenceImages })
      .getByRole("listitem"),
  ).toHaveCount(1);

  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("first submit immediately shows the optimistic user message and pending assistant", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await selectRatio(page, "16:9");
  await submitPrompt(page);

  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);
  const optimisticTurn = page.locator("[data-client-attempt]");
  await expect(optimisticTurn).toContainText(prompt);
  await expect(optimisticTurn.getByRole("status")).toContainText(
    labels.pending,
  );
});

test("double click sends exactly one generate request", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await page.getByRole("textbox", { name: "توصیف تصویر" }).fill(prompt);
  await page.getByRole("button", { name: "ساخت تصویر" }).dblclick();

  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);
  await page.waitForTimeout(250);
  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("composer stays locked until the current generation finishes", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await submitPrompt(page);
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  const composer = page.locator("form[aria-busy='true']");
  await expect(composer).toBeVisible();
  await expect(
    composer.getByRole("textbox", { name: "توصیف تصویر" }),
  ).toBeDisabled();
  await expect(
    composer.getByRole("button", { name: "ساخت تصویر" }),
  ).toBeDisabled();

  await imageConversationApi.resolveGeneration(
    conversationMessages({ prompt }),
  );

  await expect(
    page.getByRole("textbox", { name: "توصیف تصویر" }),
  ).toBeEnabled();
});

test("pending assistant preserves the configured aspect ratio", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await selectRatio(page, "9:16");
  await submitPrompt(page);

  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);
  const pending = page.getByRole("status").filter({ hasText: labels.pending });
  await expect(pending).toBeVisible();
  await expect(pending.locator("[data-generation-visual]")).toHaveCSS(
    "aspect-ratio",
    "0.5625 / 1",
  );
});

test("successful server result replaces optimistic messages without duplicates", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await selectRatio(page, "16:9");
  await submitPrompt(page);
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  await imageConversationApi.resolveGeneration(
    conversationMessages({ aspectRatio: "16:9", prompt }),
  );

  await expect(page).toHaveURL(new RegExp(`/generation/image/${taskUuid}$`));
  await expect(
    page.getByRole("status").filter({ hasText: labels.pending }),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("region", { name: "گفتگوی تولید تصویر" })
      .getByText(prompt, { exact: true }),
  ).toHaveCount(1);
  await expect(
    page.locator("article").filter({ hasText: labels.result }),
  ).toHaveCount(1);
  const generatedImage = page.getByRole("button", {
    name: "عکس",
    exact: true,
  });
  await expect(generatedImage).toHaveCount(1);
  await expect(generatedImage.locator("..")).toHaveCSS(
    "aspect-ratio",
    "16 / 9",
  );
});

test("new chat clears the completed session without generating again", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await submitPrompt(page);
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  await imageConversationApi.resolveGeneration(
    conversationMessages({ prompt }),
  );
  await expect(page).toHaveURL(new RegExp(`/generation/image/${taskUuid}$`));

  const result = page.locator("article").filter({ hasText: labels.result });
  await result.getByRole("button", { name: labels.addToCompare }).click();
  await expect(page.getByText(labels.compareMinimum)).toBeVisible();

  const openSidebar = page.getByRole("button", {
    name: "باز کردن نوار کناری",
  });
  if (await openSidebar.isVisible()) await openSidebar.click();
  await page.locator("aside").getByRole("link", { name: "ساخت عکس" }).click();

  await expect(page).toHaveURL(/\/generation\/image$/);
  await expect(page.locator("[data-generation-intro]")).toBeVisible();
  await expect(page.locator("[data-client-attempt]")).toHaveCount(0);
  await expect(result).toHaveCount(0);
  await expect(page.getByText(labels.compareMinimum)).toHaveCount(0);
  await expect(
    page.getByRole("textbox", { name: "توصیف تصویر" }),
  ).toBeEnabled();
  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("late generation acceptance preserves the user's new conversation", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  await submitPrompt(page, "A second cinematic lighthouse scene");
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  const openSidebar = page.getByRole("button", {
    name: "باز کردن نوار کناری",
  });
  if (await openSidebar.isVisible()) await openSidebar.click();
  await page.getByRole("link", { name: "ساخت عکس", exact: true }).click();
  await expect(page).toHaveURL(/\/generation\/image$/);

  await imageConversationApi.resolveGeneration([
    ...conversationMessages({ prompt }),
    ...conversationMessages({
      prompt: "A second cinematic lighthouse scene",
    }).map((message) => ({ ...message, uuid: `${message.uuid}-second` })),
  ]);

  await expect(page).toHaveURL(/\/generation\/image$/);
  await expect(page.locator("[data-generation-intro]")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "توصیف تصویر" })).toHaveValue(
    "",
  );
  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("malformed conversation fragment leaves the result usable", async ({
  imageConversationApi,
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  imageConversationApi.setTaskMessages(conversationMessages({ prompt }));

  await page.goto(`/generation/image/${taskUuid}#%`);

  await expect(
    page.locator("article").filter({ hasText: labels.result }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "توصیف تصویر" }),
  ).toBeEnabled();
  expect(pageErrors).toEqual([]);
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("successful result exposes reference and edit-request actions", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  const result = page.locator("article").filter({ hasText: labels.result });

  await expect(
    result.getByRole("button", { name: labels.useAsReference }),
  ).toBeVisible();
  await expect(
    result.getByRole("button", { name: labels.editRequest }),
  ).toBeVisible();
});

test("completed images can enter local comparison without generating", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  const result = page.locator("article").filter({ hasText: labels.result });
  const compareAction = result.getByRole("button", {
    name: labels.addToCompare,
  });

  await compareAction.click();

  await expect(
    result.getByRole("button", { name: labels.selectedForCompare }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(labels.compareMinimum)).toBeVisible();
  expect(imageConversationApi.generateRequests).toEqual([]);
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`editing an old request excludes missing references at ${viewport.width}px`, async ({
    imageConversationApi,
    page,
  }) => {
    await page.setViewportSize(viewport);
    const missingReference = "33333333-3333-4333-8333-333333333333";
    const previewedIds: string[] = [];
    const uploadRequests: string[] = [];
    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        /file-manager\/.*(?:upload|multipart)/.test(request.url())
      ) {
        uploadRequests.push(new URL(request.url()).pathname);
      }
    });
    await page.route("**/file-manager/files/presigned-urls", (route) => {
      const body = route.request().postDataJSON() as { file_uuids: string[] };
      previewedIds.push(...body.file_uuids);
      return route.fulfill(
        viewport.width === 1440
          ? { status: 404, json: {} }
          : { json: { files: [] } },
      );
    });
    const messages = conversationMessages({ prompt }).map((message) => ({
      ...message,
      ai_model_config: {
        ...message.ai_model_config,
        mode: "image_to_image",
        reference_images: [missingReference],
      },
    }));
    imageConversationApi.setTaskMessages(messages);
    await page.goto(`/generation/image/${taskUuid}`);
    const result = page.locator("article").filter({ hasText: labels.result });
    await result.getByRole("button", { name: labels.editRequest }).click();
    await expect(
      page.getByRole("textbox", { name: "توصیف تصویر" }),
    ).toHaveValue(prompt);
    await expect.poll(() => previewedIds.includes(missingReference)).toBe(true);
    const removeReference = page.getByRole("button", {
      name: "حذف تصویر مرجع 1",
    });
    await expect(removeReference).toHaveCount(0);
    await expect(page.locator("[data-generation-mode]")).toHaveAttribute(
      "data-generation-mode",
      "text_to_image",
    );
    expect(uploadRequests).toEqual([]);
    expect(imageConversationApi.generateRequests).toEqual([]);
    await submitPrompt(page);
    await expect
      .poll(() => imageConversationApi.generateRequests.length)
      .toBe(1);
    const config = imageConversationApi.generateRequests[0]
      .ai_model_config as Record<string, unknown>;
    expect(config.reference_images ?? []).toEqual([]);
    expect(config.mode).toBe("text_to_image");
  });
}

for (const referenceStatus of ["missing", "temporary"] as const) {
  test(`editing an old request preserves healthy references during a ${referenceStatus} preview failure`, async ({
    imageConversationApi,
    page,
  }) => {
    const missingReference = "33333333-3333-4333-8333-333333333333";
    const healthyReference = "44444444-4444-4444-8444-444444444444";
    await page.route("**/file-manager/files/presigned-urls", (route) => {
      const body = route.request().postDataJSON() as { file_uuids: string[] };
      if (
        referenceStatus === "temporary" &&
        body.file_uuids.includes(missingReference)
      ) {
        return route.fulfill({ status: 503, json: {} });
      }
      return route.fulfill({
        json: {
          files: body.file_uuids
            .filter((id) => id !== missingReference)
            .map((id) => ({
              file_uuid: id,
              preview_url:
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'/%3E",
              download_url: "https://storage.test/reference.webp",
            })),
        },
      });
    });
    imageConversationApi.setTaskMessages(
      conversationMessages({ prompt }).map((message) => ({
        ...message,
        ai_model_config: {
          ...message.ai_model_config,
          mode: "image_to_image",
          reference_images: [missingReference, healthyReference],
        },
      })),
    );
    await page.goto(`/generation/image/${taskUuid}`);
    const result = page.locator("article").filter({ hasText: labels.result });
    await result.getByRole("button", { name: labels.editRequest }).click();
    const references = page.getByRole("list", { name: labels.referenceImages });
    await expect(references.getByRole("listitem")).toHaveCount(
      referenceStatus === "missing" ? 1 : 2,
    );
    await expect(
      page.getByRole("textbox", { name: "توصیف تصویر" }),
    ).toHaveValue(prompt);
    await expect(page.locator("[data-generation-mode]")).toHaveAttribute(
      "data-generation-mode",
      "image_to_image",
    );
    expect(imageConversationApi.generateRequests).toEqual([]);
    if (referenceStatus === "missing") {
      await expect(
        references.getByRole("button", { name: "نمایش تصویر مرجع 1" }),
      ).toBeVisible();
      await submitPrompt(page);
      await expect
        .poll(() => imageConversationApi.generateRequests.length)
        .toBe(1);
      const config = imageConversationApi.generateRequests[0]
        .ai_model_config as Record<string, unknown>;
      expect(config.reference_images).toEqual([healthyReference]);
    } else {
      await expect(
        references.getByText("خطا", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText("فایل‌های مرجعی که دیگه در دسترس نبودن", {
          exact: false,
        }),
      ).toHaveCount(0);
    }
  });
}

test("restored references are checked before the composer can submit", async ({
  imageConversationApi,
  page,
}) => {
  const oldReference = "33333333-3333-4333-8333-333333333333";
  let finishCheck: () => void = () => {};
  const check = new Promise<void>((resolve) => {
    finishCheck = resolve;
  });
  await page.route("**/file-manager/files/presigned-urls", async (route) => {
    const body = route.request().postDataJSON() as { file_uuids: string[] };
    if (body.file_uuids.includes(oldReference)) await check;
    return route.fulfill({ json: { files: [] } });
  });
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt }).map((message) => ({
      ...message,
      ai_model_config: {
        ...message.ai_model_config,
        mode: "image_to_image",
        reference_images: [oldReference],
      },
    })),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  await page
    .locator("article")
    .filter({ hasText: labels.result })
    .getByRole("button", { name: labels.editRequest })
    .click();
  const create = page.getByRole("button", { name: "ساخت تصویر" });
  await expect(page.getByRole("textbox", { name: "توصیف تصویر" })).toHaveValue(
    prompt,
  );
  await expect(create).toBeDisabled();
  expect(imageConversationApi.generateRequests).toEqual([]);
  finishCheck();
  await expect(
    page.getByRole("button", { name: "حذف تصویر مرجع 1" }),
  ).toHaveCount(0);
  await expect(create).toBeEnabled();
});

test("edit request restores its snapshot without generating", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  await page.getByRole("button", { name: labels.editRequest }).click();

  await expect(page.getByRole("textbox", { name: "توصیف تصویر" })).toHaveValue(
    prompt,
  );
  await expect(page.getByRole("combobox", { name: "قاب تصویر" })).toHaveText(
    "16:9",
  );
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("use as reference populates the next composer without submitting", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  await page.getByRole("button", { name: labels.useAsReference }).click();

  await expect(
    page
      .getByRole("list", { name: labels.referenceImages })
      .getByRole("listitem"),
  ).toHaveCount(1);
  await expect(page.locator("[data-generation-mode]")).toHaveAttribute(
    "data-generation-mode",
    "image_to_image",
  );
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("regenerate requires explicit confirmation and sends one request", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  await page.getByRole("button", { name: labels.regenerate }).click();

  const confirmation = page.getByRole("dialog", {
    name: "این تصویر دوباره ساخته شود؟",
  });
  await expect(confirmation).toBeVisible();
  expect(imageConversationApi.generateRequests).toEqual([]);
  await confirmation
    .getByRole("button", { name: labels.confirmRegenerate })
    .click();
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);
  expect(imageConversationApi.generateRequests[0]).toMatchObject({
    task_uuid: taskUuid,
    ai_model_uuid: compatibleModelUuid,
  });
});

test("ambiguous network failure preserves configuration and advises checking history", async ({
  imageConversationApi,
  page,
}) => {
  await openNewConversation(page);
  await selectRatio(page, "9:16");
  await submitPrompt(page);
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);
  await imageConversationApi.disconnectGeneration();

  await expect(page.getByRole("alert")).toContainText(labels.ambiguousFailure);
  await expect(page.getByRole("textbox", { name: "توصیف تصویر" })).toHaveValue(
    prompt,
  );
  await expect(page.getByRole("combobox", { name: "قاب تصویر" })).toHaveText(
    "9:16",
  );
  await expect(page.getByRole("alert").getByRole("button")).toHaveCount(0);
  await page.waitForTimeout(250);
  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("regeneration network failure remains handled by the conversation", async ({
  imageConversationApi,
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages);
  await page.getByRole("button", { name: labels.regenerate }).click();
  await page
    .getByRole("dialog", { name: "این تصویر دوباره ساخته شود؟" })
    .getByRole("button", { name: labels.confirmRegenerate })
    .click();
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  await imageConversationApi.disconnectGeneration();

  await expect(page.getByRole("alert")).toContainText(labels.ambiguousFailure);
  expect(pageErrors).toEqual([]);
  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("failed message retry network failure remains handled by the conversation", async ({
  imageConversationApi,
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt, status: "FAILED" }),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  await page.getByRole("button", { name: "دوباره امتحان کن" }).click();
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  await imageConversationApi.disconnectGeneration();

  await expect(
    page.getByRole("alert").filter({ hasText: labels.ambiguousFailure }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
  expect(imageConversationApi.generateRequests).toHaveLength(1);
});

test("model schema incompatibility gives clear reference guidance", async ({
  imageConversationApi,
  page,
}) => {
  await openSuccessfulConversation(page, imageConversationApi.setTaskMessages, {
    modelUuid: incompatibleModelUuid,
  });
  await page.getByRole("button", { name: labels.useAsReference }).click();

  await expect(
    page.getByRole("status").filter({ hasText: labels.incompatibleReference }),
  ).toBeVisible();
  await expect(page.locator("form").getByAltText("Uploaded item")).toHaveCount(
    0,
  );
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("reduced-motion keeps the pending image formed without animation", async ({
  imageConversationApi,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openNewConversation(page);
  await submitPrompt(page);
  await expect.poll(() => imageConversationApi.generateRequests.length).toBe(1);

  const pendingVisual = page
    .getByRole("status")
    .filter({ hasText: labels.pending })
    .locator("[data-generation-visual]");
  await expect(pendingVisual).toBeVisible();
  await expect
    .poll(() =>
      pendingVisual
        .locator("*")
        .evaluateAll((elements) =>
          elements.every(
            (element) => getComputedStyle(element).animationName === "none",
          ),
        ),
    )
    .toBe(true);
});
