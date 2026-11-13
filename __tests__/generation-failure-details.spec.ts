import {
  conversationMessages,
  expect,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

const prompt = "یه گربه روی ماه";
const assistant = (
  status: "FAILED" | "IN_PROGRESS",
  extra: Record<string, unknown>,
) => {
  const [user, answer] = conversationMessages({ prompt, status });
  return [user, { ...answer, ...extra }] as ReturnType<
    typeof conversationMessages
  >;
};

test("a failed answer names its reason, says it was free and shows a tracking code", async ({
  page,
  imageConversationApi,
}) => {
  imageConversationApi.setTaskMessages(
    assistant("FAILED", {
      message: "پیام",
      error: {
        action: "MODIFY_INPUT",
        message: "درخواستت با قوانین محتوایی سازگار نبود.",
        message_key: "modules.ai_gateway.failures.content_policy",
        reason: "CONTENT_POLICY",
        retryable: false,
        target: "prompt",
      },
    }),
  );
  await page.goto(`/generation/image/${taskUuid}`);

  const alert = page.getByRole("alert");
  await expect(alert).toContainText("با قوانین محتوایی سازگار نبود");
  await expect(alert).toContainText("اعتباری از حسابت کم نشد");
  await expect(alert.locator("[data-tracking-code]")).toHaveText("assistan");
});

test("an answer under support review shows the review card, not progress", async ({
  page,
  imageConversationApi,
}) => {
  imageConversationApi.setTaskMessages(
    assistant("IN_PROGRESS", { under_review: true }),
  );
  await page.goto(`/generation/image/${taskUuid}`);

  const review = page.locator("[data-generation-review]");
  await expect(review).toContainText("در حال بررسی توسط پشتیبانی");
  await expect(review).toContainText("اعتباری از حسابت کم نمی‌شه");
  await expect(
    page.getByRole("list", { name: "مراحل ساخت تصویر" }),
  ).toHaveCount(0);
});
