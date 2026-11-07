import {
  conversationMessages,
  expect,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

test("named preview buttons select the correct image across multiple results", async ({
  page,
  imageConversationApi,
}) => {
  const prompt = "A detailed landscape description ".repeat(12);
  const imageIds = [
    "22222222-2222-4222-8222-222222222221",
    "22222222-2222-4222-8222-222222222222",
    "22222222-2222-4222-8222-222222222223",
  ];
  const firstTurn = conversationMessages({ prompt });
  firstTurn[1].ai_model_config.images_generated = imageIds.slice(0, 2);
  const failedTurn = conversationMessages({ prompt, status: "FAILED" }).map(
    (message) => ({ ...message, uuid: `failed-${message.uuid}` }),
  );
  const lastTurn = conversationMessages({ prompt }).map((message) => ({
    ...message,
    uuid: `last-${message.uuid}`,
  }));
  lastTurn[1].ai_model_config.images_generated = imageIds.slice(2);
  imageConversationApi.setTaskMessages([
    ...firstTurn,
    ...failedTurn,
    ...lastTurn,
  ]);
  const previewUrl = (id: string) =>
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" id="${id}"/>`)}`;
  await page.route("**/file-manager/files/presigned-urls", async (route) => {
    const body = route.request().postDataJSON() as { file_uuids: string[] };
    await route.fulfill({
      json: {
        files: body.file_uuids.map((id) => ({
          file_uuid: id,
          preview_url: previewUrl(id),
          download_url: "data:text/plain,mocked-image",
        })),
      },
    });
  });
  await page.goto(`/generation/image/${taskUuid}`);

  for (const [index, id] of imageIds.entries()) {
    const button = page.getByRole("button", {
      name: `دیدن عکس ${index + 1}`,
      exact: true,
    });
    await expect(button).toHaveCount(1);
    await expect(button.getByRole("img")).toHaveAttribute("alt", prompt);
    await button.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("img")).toHaveAttribute(
      "src",
      previewUrl(id),
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  }
  expect(imageConversationApi.generateRequests).toEqual([]);
});

for (const { alt, index, name } of [
  { alt: "Quiet lake", index: undefined, name: "دیدن عکس: Quiet lake" },
  {
    alt: "A detailed prompt ".repeat(20),
    index: undefined,
    name: "دیدن عکس 1",
  },
  { alt: "Quiet lake", index: 2, name: "دیدن عکس 3" },
]) {
  test(`single-file preview preserves alt with action name ${name}`, async ({
    page,
    imageConversationApi,
  }) => {
    await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("textbox", { name: "توصیف تصویر" }),
    ).toBeVisible();
    await page.evaluate(
      async ({ description, position }) => {
        const path =
          "/src/shared/components/_tests/media-preview-item-harness.tsx";
        const { mount } = await import(/* @vite-ignore */ path);
        mount(description, position);
      },
      { description: alt, position: index },
    );
    const button = page.getByRole("button", { name, exact: true });
    await expect(button).toBeVisible();
    await expect(button.getByRole("img")).toHaveAttribute("alt", alt);
    await button.click();
    await expect(page.getByRole("dialog").getByRole("img")).toHaveAttribute(
      "alt",
      alt,
    );
    expect(imageConversationApi.generateRequests).toEqual([]);
  });
}
