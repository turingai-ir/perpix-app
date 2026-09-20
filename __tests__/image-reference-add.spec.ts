import {
  conversationMessages,
  expect,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

test("references remain visible and can be added or removed", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "Reference test" }),
  );
  await page.route("**/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            uuid: "gallery-reference-1",
            file_name: "reference-one.png",
            file_size: 1024,
          },
          {
            uuid: "gallery-reference-2",
            file_name: "reference-two.png",
            file_size: 1024,
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });

  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();

  const composer = page.locator("form");
  const references = composer.getByRole("list", { name: "تصاویر مرجع" });
  await expect(references.getByRole("listitem")).toHaveCount(1);
  await expect(composer.getByText("1 از 4")).toBeVisible();

  await composer.getByRole("button", { name: "افزودن عکس" }).click();
  const dialog = page.getByRole("dialog", { name: "افزودن عکس" });
  await dialog.getByRole("button", { name: /reference-one\.png/ }).click();
  await dialog.getByRole("button", { name: /reference-two\.png/ }).click();
  await expect(dialog.getByText("3 از 4")).toBeVisible();
  await dialog.getByRole("button", { name: /افزودن 2 عکس/ }).click();

  await expect(references.getByRole("listitem")).toHaveCount(3);
  await expect(composer.getByText("3 از 4")).toBeVisible();
  await references.getByRole("button", { name: /حذف/ }).first().click();
  await expect(references.getByRole("listitem")).toHaveCount(2);
  await expect(
    composer.getByRole("button", { name: "افزودن عکس" }),
  ).toBeVisible();
  expect(imageConversationApi.generateRequests).toHaveLength(0);
});

test("reference controls remain usable on a narrow screen", async ({
  imageConversationApi,
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "Mobile reference test" }),
  );
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });

  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();

  const composer = page.locator("form");
  const addButton = composer.getByRole("button", { name: "افزودن عکس" });
  await expect(addButton).toBeVisible();
  await addButton.click();
  await expect(page.getByRole("dialog", { name: "افزودن عکس" })).toBeVisible();
  expect(imageConversationApi.generateRequests).toHaveLength(0);
});

test("an image can be pasted into the reference picker", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "Paste reference test" }),
  );
  let uploadedCount = 0;
  await page.route("**/file-manager/simple-upload", async (route) => {
    uploadedCount += 1;
    await route.fulfill({
      json: { uuid: `pasted-reference-${uploadedCount}` },
    });
  });
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();

  const composer = page.locator("form");
  await composer.getByRole("button", { name: "افزودن عکس" }).click();
  const dialog = page.getByRole("dialog");

  await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((image) =>
        image ? resolve(image) : reject(new Error("No image")),
      );
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        read: async () => [{ types: ["image/png"], getType: async () => blob }],
      },
    });
  });
  await dialog.getByRole("button", { name: "چسباندن" }).click();
  await expect(dialog.locator('[aria-live="polite"]')).toHaveText(/2.*4/);

  await dialog.evaluate(async (element) => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((image) =>
        image ? resolve(image) : reject(new Error("No image")),
      );
    });
    const data = new DataTransfer();
    data.items.add(new File([blob], "reference.png", { type: "image/png" }));
    element.dispatchEvent(
      new ClipboardEvent("paste", { bubbles: true, clipboardData: data }),
    );
  });
  await expect(dialog.locator('[aria-live="polite"]')).toHaveText(/3.*4/);
  await expect.poll(() => uploadedCount).toBe(2);
  expect(imageConversationApi.generateRequests).toHaveLength(0);
});

test("a newly uploaded reference waits for confirmation and enables add", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "Fresh upload confirmation" }),
  );
  await page.route("**/file-manager/simple-upload", (route) =>
    route.fulfill({ json: { uuid: "fresh-reference-upload" } }),
  );
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();

  const composer = page.locator("form");
  const references = composer.locator('[aria-label="تصاویر مرجع"]');
  const referenceItems = references.locator('[role="listitem"]');
  await expect(referenceItems).toHaveCount(1);
  const initialReferenceCount = await referenceItems.count();
  await composer.getByRole("button", { name: "افزودن عکس" }).click();
  const dialog = page.getByRole("dialog", { name: "افزودن عکس" });

  await dialog.locator('input[type="file"]').evaluate(async (input) => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((image) =>
        image ? resolve(image) : reject(new Error("No image")),
      );
    });
    const transfer = new DataTransfer();
    transfer.items.add(
      new File([blob], "fresh-reference.png", { type: "image/png" }),
    );
    Object.defineProperty(input, "files", { value: transfer.files });
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  const confirmButton = dialog.getByRole("button", {
    name: /افزودن 1 عکس/,
  });
  await expect(confirmButton).toBeEnabled();
  await expect(referenceItems).toHaveCount(initialReferenceCount);

  await confirmButton.click();
  await expect(referenceItems).toHaveCount(initialReferenceCount + 1);
  expect(imageConversationApi.generateRequests).toHaveLength(0);
});

test("keyboard paste accepts an image from the real browser clipboard", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "Real clipboard paste" }),
  );
  let uploadedCount = 0;
  await page.route("**/file-manager/simple-upload", async (route) => {
    uploadedCount += 1;
    await route.fulfill({
      json: { uuid: `clipboard-reference-${uploadedCount}` },
    });
  });
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();
  await page
    .locator("form")
    .getByRole("button", { name: "افزودن عکس" })
    .click();
  const dialog = page.getByRole("dialog");

  await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((image) =>
        image ? resolve(image) : reject(new Error("No image")),
      );
    });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  });

  await page.keyboard.press("ControlOrMeta+V");
  await expect(dialog.locator('[aria-live="polite"]')).toHaveText(/2.*4/);
  await expect.poll(() => uploadedCount).toBe(1);
});

test("paste button converts clipboard WebP into an uploadable image", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "WebP clipboard paste" }),
  );
  let uploadedBody = "";
  await page.route("**/file-manager/simple-upload", async (route) => {
    uploadedBody = route.request().postData() ?? "";
    await route.fulfill({ json: { uuid: "webp-clipboard-reference" } });
  });
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();
  await page
    .locator("form")
    .getByRole("button", { name: "افزودن عکس" })
    .click();
  const dialog = page.getByRole("dialog");

  await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (image) => (image ? resolve(image) : reject(new Error("No image"))),
        "image/webp",
      );
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        read: async () => [
          { types: ["image/webp"], getType: async () => blob },
        ],
      },
    });
  });

  await dialog.getByRole("button", { name: "چسباندن" }).click();
  await expect(dialog.locator('[aria-live="polite"]')).toHaveText(/2.*4/);
  expect(uploadedBody).toContain("Content-Type: image/png");
});

test("pasting an image into the prompt adds a reference without opening the picker", async ({
  imageConversationApi,
  page,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({ prompt: "Composer paste" }),
  );
  let uploadedCount = 0;
  await page.route("**/file-manager/simple-upload", async (route) => {
    uploadedCount += 1;
    await route.fulfill({ json: { uuid: `composer-paste-${uploadedCount}` } });
  });
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`/generation/image/${taskUuid}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: /استفاده به‌عنوان مرجع/ }).click();

  await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((image) =>
        image ? resolve(image) : reject(new Error("No image")),
      );
    });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  });

  const composer = page.locator("form");
  const prompt = composer.locator("textarea").first();
  await prompt.click();
  await page.keyboard.press("ControlOrMeta+V");

  await expect(composer.getByRole("listitem")).toHaveCount(2);
  await expect(composer.getByText(/2.*4/)).toBeVisible();
  await expect(prompt).toHaveValue("");
  await expect.poll(() => uploadedCount).toBe(1);
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.evaluate(() => navigator.clipboard.writeText("A pasted prompt"));
  await page.keyboard.press("ControlOrMeta+V");
  await expect(prompt).toHaveValue("A pasted prompt");
  expect(uploadedCount).toBe(1);
  expect(imageConversationApi.generateRequests).toHaveLength(0);
});
