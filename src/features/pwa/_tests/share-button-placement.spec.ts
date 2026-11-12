import { expect, test } from "@playwright/test";

import { detectInstallGuide } from "../lib/install-guide";
import { getShareButtonPlacement } from "../lib/share-button-placement";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IPHONE_CHROME =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0 Mobile/15E148 Safari/604.1";
const IPAD_DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";

test.describe("getShareButtonPlacement", () => {
  test("iPhone Safari uses the bottom toolbar", () => {
    expect(
      getShareButtonPlacement({
        userAgent: IPHONE_SAFARI,
        platform: "iPhone",
        maxTouchPoints: 5,
      }),
    ).toBe("bottom");
  });

  test("iPhone Chrome uses the top bar", () => {
    expect(
      getShareButtonPlacement({
        userAgent: IPHONE_CHROME,
        platform: "iPhone",
        maxTouchPoints: 5,
      }),
    ).toBe("top");
  });

  test("iPad reporting a desktop user agent uses the top bar", () => {
    expect(
      getShareButtonPlacement({
        userAgent: IPAD_DESKTOP_UA,
        platform: "MacIntel",
        maxTouchPoints: 5,
      }),
    ).toBe("top");
  });
});

const device = (
  userAgent: string,
  platform = "iPhone",
  maxTouchPoints = 5,
) => ({
  userAgent,
  platform,
  maxTouchPoints,
});

const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";
const ANDROID_FIREFOX =
  "Mozilla/5.0 (Android 14; Mobile; rv:130.0) Gecko/130.0 Firefox/130.0";
const ANDROID_SAMSUNG =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0 Mobile Safari/537.36";
const ANDROID_WEBVIEW =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0 Mobile Safari/537.36";
const IPHONE_INSTAGRAM =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0";
const IPHONE_GENERIC_WEBVIEW =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

test.describe("detectInstallGuide", () => {
  const cases: [string, ReturnType<typeof device>, string | null][] = [
    ["iPhone Safari", device(IPHONE_SAFARI), "ios"],
    ["iPhone Chrome", device(IPHONE_CHROME), "ios"],
    ["iPad desktop UA", device(IPAD_DESKTOP_UA, "MacIntel"), "ios"],
    ["Instagram on iPhone", device(IPHONE_INSTAGRAM), "in-app"],
    [
      "iOS web view without Safari token",
      device(IPHONE_GENERIC_WEBVIEW),
      "in-app",
    ],
    ["Android web view", device(ANDROID_WEBVIEW, "Linux armv8l"), "in-app"],
    ["Android Firefox", device(ANDROID_FIREFOX, "Linux armv8l"), "android"],
    ["Samsung Internet", device(ANDROID_SAMSUNG, "Linux armv8l"), "android"],
    ["Android Chrome", device(ANDROID_CHROME, "Linux armv8l"), null],
    ["Desktop Mac", device(IPAD_DESKTOP_UA, "MacIntel", 0), null],
  ];

  for (const [name, input, expected] of cases) {
    test(name, () => {
      expect(detectInstallGuide(input)).toBe(expected);
    });
  }
});
