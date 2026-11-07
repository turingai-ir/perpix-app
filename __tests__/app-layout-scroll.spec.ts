import { expect, test } from "./fixtures/image-settings";

test("normal and forced scrolling consult the current reduced-motion preference", async ({
  page,
}) => {
  await page.goto("/");
  const viewport = page.locator('main [data-slot="scroll-area-viewport"]');
  await expect(viewport).toBeVisible();
  await viewport.evaluate((element) => {
    // Deterministic geometry avoids coupling this behavior to dashboard height.
    Object.defineProperties(element, {
      scrollHeight: { configurable: true, value: 2000 },
      clientHeight: { configurable: true, value: 600 },
      scrollTop: { configurable: true, writable: true, value: 1300 },
    });
    element.style.scrollBehavior = "smooth";
    element.scrollTo = (options?: ScrollToOptions | number) => {
      element.setAttribute("data-scroll-call", JSON.stringify(options));
    };
  });

  for (const reducedMotion of [
    "no-preference",
    "reduce",
    "no-preference",
  ] as const) {
    await page.emulateMedia({ reducedMotion });
    for (const force of [false, true]) {
      await viewport.evaluate((element, forced) => {
        element.scrollTop = forced ? 0 : 1300;
        element.removeAttribute("data-scroll-call");
      }, force);
      await page.evaluate(async (forced) => {
        const path = "/src/shared/lib/event-bus/index.ts";
        const { appEventBus } = await import(/* @vite-ignore */ path);
        appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", { force: forced });
      }, force);
      await expect(viewport).toHaveAttribute(
        "data-scroll-call",
        JSON.stringify({
          top: 2000,
          behavior: reducedMotion === "reduce" ? "instant" : "smooth",
        }),
      );
    }
    for (const distanceFromEnd of [160, 161, 1400]) {
      await viewport.evaluate((element, distance) => {
        element.scrollTop = 2000 - 600 - distance;
        element.removeAttribute("data-scroll-call");
      }, distanceFromEnd);
      await page.evaluate(async () => {
        const path = "/src/shared/lib/event-bus/index.ts";
        const { appEventBus } = await import(/* @vite-ignore */ path);
        appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", undefined);
      });
      if (distanceFromEnd > 160) {
        await expect(viewport).not.toHaveAttribute("data-scroll-call");
      } else {
        await expect(viewport).toHaveAttribute(
          "data-scroll-call",
          JSON.stringify({
            top: 2000,
            behavior: reducedMotion === "reduce" ? "instant" : "smooth",
          }),
        );
      }
    }
  }
});
