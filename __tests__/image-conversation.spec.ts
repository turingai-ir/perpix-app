import type { Page } from "@playwright/test";

import {
  compatibleModelUuid,
  conversationMessages,
  expect,
  incompatibleModelUuid,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

const labels = {
  addToCompare: "افزودن به مقایسه",
  closePromptEditor: "انصراف و بستن ویرایشگر پرامپت",
  confirmRegenerate: "تأیید و ساخت",
  compareMinimum: "برای مقایسه، یک تصویر دیگر انتخاب کن.",
  editRequest: "ویرایش درخواست",
  focusLocked:
    "برای حفظ تمرکز، بعد از آماده‌شدن نتیجه می‌توانی درخواست بعدی را بسازی.",
  focusProgress: "مراحل ساخت تصویر",
  focusSubmitting: "درخواستت در حال ثبت است",
  ambiguousFailure:
    "وضعیت این درخواست قطعی نیست. برای جلوگیری از مصرف دوباره اعتبار، تاریخچه را بررسی کن و سپس از فرم پایین صفحه استفاده کن.",
  incompatibleReference:
    "این تصویر برای پیام بعدی آماده است. یک مدل سازگار انتخاب کن یا اگر ظرفیت مراجع پر است، یکی از تصاویر فعلی را حذف کن. این کار تولید را آغاز نمی‌کند.",
  pending: "دروازه‌ی موزه باز شد…",
  referenceImages: "تصاویر مرجع",
  selectedForCompare: "انتخاب‌شده برای مقایسه",
  regenerate: "ساخت دوباره",
  result: "تصویر آماده است",
  useAsReference: "استفاده به‌عنوان مرجع",
} as const;

const prompt = "A cinematic lighthouse above a stormy sea";

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
  await page.locator("aside").getByRole("link", { name: "تولید عکس" }).click();

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
