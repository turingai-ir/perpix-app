import { expect, test } from "@playwright/test";

test("formats numbers when NumberFormat is callable but not constructible", async ({
  page,
}) => {
  await page.goto("/");

  const formattedNumber = await page.evaluate(async () => {
    const nativeNumberFormat = Intl.NumberFormat;
    const callableNumberFormat = (
      ...arguments_: Parameters<typeof Intl.NumberFormat>
    ) => nativeNumberFormat(...arguments_);

    Object.defineProperty(Intl, "NumberFormat", {
      configurable: true,
      value: callableNumberFormat,
    });

    try {
      const modulePath = "/src/utils/number.ts";
      const { formatLocalizedNumber } = await import(modulePath);
      return formatLocalizedNumber({ value: 1_234 });
    } finally {
      Object.defineProperty(Intl, "NumberFormat", {
        configurable: true,
        value: nativeNumberFormat,
      });
    }
  });

  expect(formattedNumber).toBe("۱٬۲۳۴");
});
