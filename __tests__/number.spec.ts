import { expect, test } from "@playwright/test";

test("formats numbers when NumberFormat is callable but not constructible", async ({
  page,
}) => {
  await page.goto("/");

  const formattedNumber = await page.evaluate(async () => {
    const nativeNumberFormat = Intl.NumberFormat;
    const callableNumberFormat = (
      ...arguments_: Parameters<IntlConstructor["NumberFormat"]>
    ) => nativeNumberFormat(...arguments_);

    Object.defineProperty(Intl, "NumberFormat", {
      configurable: true,
      value: callableNumberFormat,
    });

    try {
      const { formatLocalizedNumber } = await import("/src/utils/number.ts");
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
