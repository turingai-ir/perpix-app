import { expect, test } from "../../../../__tests__/fixtures/image-settings";

test.beforeEach(async ({ page }) => {
  await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
  ).toBeVisible();
  await page.evaluate(async () => {
    const path = "/src/features/generation/_tests/prompt-field-harness.tsx";
    const harness = await import(/* @vite-ignore */ path);
    harness.mount();
  });
});

test("compact prompt preserves its form label, id and field name", async ({
  page,
}) => {
  const prompt = page.getByRole("textbox", { name: "Prompt", exact: true });
  await expect(prompt).toHaveAttribute("id", /\S+/);
  await expect(prompt).toHaveAttribute("name", "prompt");
  await expect(page.getByText("Prompt", { exact: true })).toHaveAttribute(
    "for",
    (await prompt.getAttribute("id"))!,
  );
  await expect(prompt).toHaveAttribute("aria-invalid", "false");
  await prompt.fill("A quiet lake");
  await expect(prompt).toHaveValue("A quiet lake");
});

test("compact prompt links its visible error and clears the invalid state", async ({
  page,
}) => {
  const prompt = page.getByRole("textbox", { name: "Prompt", exact: true });
  await page.getByRole("button", { name: "Show prompt error" }).click();
  const error = page.getByText("Prompt is required", { exact: true });
  await expect(error).toBeVisible();
  await expect(error).toHaveAttribute("id", /\S+/);
  await expect(prompt).toHaveAttribute("aria-invalid", "true");
  expect(
    (await prompt.getAttribute("aria-describedby"))?.split(/\s+/),
  ).toContain(await error.getAttribute("id"));
  await expect(prompt).toHaveAccessibleDescription("Prompt is required");
  await page.getByRole("button", { name: "Clear prompt error" }).click();
  await expect(error).toBeHidden();
  await expect(prompt).toHaveAttribute("aria-invalid", "false");
  await expect(prompt).toHaveAccessibleDescription("");
});

test("compact prompt reports blur as touched and supports RHF setFocus after editing", async ({
  page,
}) => {
  const prompt = page.getByRole("textbox", { name: "Prompt", exact: true });
  const touched = page.getByRole("status", { name: "Prompt touched" });
  await expect(touched).toHaveText("false");
  await page.getByRole("button", { name: "Focus prompt", exact: true }).click();
  await expect(prompt).toBeFocused();
  await prompt.fill(
    "A quiet lake\nat sunrise\nwith mountains\nand clouds\nin the sky",
  );
  await expect(prompt).toHaveCSS("height", "112px");
  await prompt.press("Tab");
  await expect(prompt).not.toBeFocused();
  await expect(touched).toHaveText("true");
  await page.getByRole("button", { name: "Focus prompt", exact: true }).click();
  await expect(prompt).toBeFocused();
});

test("expanded prompt keeps draft edits isolated until applied and discards cancellation", async ({
  page,
}) => {
  const prompt = page
    .getByRole("textbox", { name: "Prompt", exact: true, includeHidden: true })
    .and(page.locator('textarea[name="prompt"]'));
  const expand = page.getByRole("button", {
    name: "بزرگ‌کردن و ویرایش پرامپت",
  });
  const dialog = page.getByRole("dialog", { name: "ویرایش کامل پرامپت" });
  await prompt.fill("Original prompt");
  await expand.click();
  const draft = dialog.getByRole("textbox", { name: "Prompt", exact: true });
  await expect(draft).toHaveValue("Original prompt");
  await expect(draft).not.toHaveAttribute("id", /form-item$/);
  await expect(draft).not.toHaveAttribute("name", "prompt");
  await draft.fill("Applied prompt");
  await expect(prompt).toHaveValue("Original prompt");
  await dialog.getByRole("button", { name: "اعمال تغییرات پرامپت" }).click();
  await expect(dialog).toBeHidden();
  await expect(prompt).toHaveValue("Applied prompt");
  await expand.click();
  await expect(draft).toHaveValue("Applied prompt");
  await draft.fill("Discarded prompt");
  await dialog
    .getByRole("button", { name: "انصراف و بستن ویرایشگر پرامپت" })
    .click();
  await expect(dialog).toBeHidden();
  await expect(prompt).toHaveValue("Applied prompt");
  await expand.click();
  await expect(draft).toHaveValue("Applied prompt");
});

test("compact textarea forwards native attributes and supports an object ref", async ({
  page,
}) => {
  await page.evaluate(async () => {
    const path = "/src/features/generation/_tests/prompt-field-harness.tsx";
    const harness = await import(/* @vite-ignore */ path);
    harness.mount(true);
  });
  const prompt = page.getByRole("textbox", { name: "Native prompt" });
  await expect(prompt).toHaveAttribute("id", "native-prompt");
  await expect(prompt).toHaveAttribute("name", "native_prompt");
  await expect(prompt).toHaveAttribute("maxlength", "12");
  await expect(prompt).toHaveAttribute("autocomplete", "off");
  await expect(prompt).toHaveAttribute("spellcheck", "false");
  await expect(prompt).toHaveAttribute("rows", "3");
  await expect(prompt).toHaveClass(/native-prompt/);
  await page.getByRole("button", { name: "Focus native prompt" }).click();
  await expect(prompt).toBeFocused();
  await prompt.fill("A lake");
  await expect(prompt).toHaveValue("A lake");
});
