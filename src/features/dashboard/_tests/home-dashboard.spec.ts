import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  mockAnonymousSession,
  mockAuthenticatedSession,
} from "../../../../__tests__/support/auth-session";

const mockDashboardApi = async (page: Page) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (
      url.origin === "http://localhost:5173" &&
      route.request().method() === "GET" &&
      !["fetch", "xhr"].includes(route.request().resourceType()) &&
      !url.pathname.startsWith("/api/")
    ) {
      return route.continue();
    }
    return route.abort();
  });
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        email: "user@example.com",
        phone_number: "09120000000",
        name: "امیر",
        is_verified: true,
        scopes: [],
        default_wallet_uuid: "wallet-1",
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        name: "کیف پول اصلی",
        balance_usdmicro: 248000,
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "subscription-1",
        started_at: "2026-08-01T00:00:00Z",
        expires_at: "2026-10-01T00:00:00Z",
        plan: {
          uuid: "plan-1",
          name: "pro",
          display_name: "حرفه‌ای",
          description: "پلن حرفه‌ای",
          scopes: [],
          allowed_models: ["flux-pro"],
          base_price_usdmicro: 0,
          discounted_price_usdmicro: 0,
          duration_days: 30,
          balance_gift_amount_usdmicro: 0,
          meta: null,
          is_active: true,
          is_recommended: true,
          is_default: false,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      },
    }),
  );
  await page.route("**/api/v1/wallet/transactions**", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        transactions: [],
        has_next: false,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/ai-task/list**", (route) =>
    route.fulfill({
      json: {
        items: [
          {
            uuid: "task-1",
            task_type: "IMAGE",
            created_at: "2026-09-09T10:00:00Z",
            updated_at: "2026-09-09T10:01:00Z",
            messages: [
              {
                uuid: "message-1",
                ai_model_uuid: "model-1",
                ai_model_config: {},
                task_status: "SUCCESS",
                message: null,
                role: "ASSISTANT",
              },
            ],
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.route("**/api/v1/ai-registry/models**", (route) => {
    const model = {
      uuid: "model-1",
      model_owner: "BLACK_FOREST_LABS",
      name: "flux-pro",
      display_name: "FLUX Pro",
      description: "مدل حرفه‌ای تصویر",
      icon_url: null,
      tags: ["image"],
      supported_inputs: ["TEXT"],
      supported_outputs: ["IMAGE", "VIDEO"],
      min_cost: 12000,
      max_cost: 28000,
    };
    if (new URL(route.request().url()).pathname.endsWith("/model-1")) {
      return route.fulfill({
        json: {
          ...model,
          modes: {
            default: {
              value: "default",
              config_schema: {
                $id: "dashboard-draft-test",
                type: "object",
                additionalProperties: false,
                required: ["prompt"],
                properties: {
                  prompt: { type: "string", minLength: 3 },
                },
              },
            },
          },
          canonical_ui_schema: {
            selectors: [],
            elements: [{ type: "Control", scope: "#/properties/prompt" }],
          },
        },
      });
    }
    return route.fulfill({ json: [model] });
  });
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_name: "campaign.png",
            file_size: 1024,
            content_type: "image/png",
            is_public: false,
            created_at: "2026-09-09T10:00:00Z",
            updated_at: "2026-09-09T10:00:00Z",
            expire_at: null,
            uuid: "file-1",
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "file-1",
            preview_url:
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
            download_url: "#",
          },
        ],
      },
    }),
  );
  await page.route("**/api/v1/ai-task/events", (route) =>
    route.fulfill({ status: 200, contentType: "text/event-stream", body: "" }),
  );
};

const brandEntrances = [
  { name: "thunder", keyframe: "thunderImpact", minimumAnimations: 7 },
  { name: "rift", keyframe: "riftArrival", minimumAnimations: 6 },
  { name: "forge", keyframe: "forgeFace", minimumAnimations: 10 },
] as const;

for (const [index, entrance] of brandEntrances.entries()) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`logo entrance ${entrance.name} with ${reducedMotion}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      if (reducedMotion === "reduce") {
        await page.setViewportSize({ width: 375, height: 812 });
      }
      await mockDashboardApi(page);
      await page.addInitScript(
        (value) => {
          Math.random = () => value;
        },
        (index + 0.5) / 3,
      );
      await page.goto("http://localhost:5173/");
      const brand = page.locator("[data-brand-entrance]");
      await expect(brand).toHaveAttribute("data-brand-entrance", entrance.name);
      await expect(brand).toHaveAttribute("aria-hidden", "true");
      await expect(brand.locator("img")).toHaveAttribute(
        "src",
        "/android-chrome-512x512.png",
      );
      await expect(brand.locator("svg path")).toHaveCount(3);
      await expect(brand.locator("div > i")).toHaveCount(11);
      const visibleParts = [
        brand,
        brand.locator("img"),
        brand.locator('[class*="brandFace"]'),
        brand.locator('[class*="brandPlinth"]'),
      ];
      if (reducedMotion === "no-preference") {
        const animations = await brand.evaluate((element) => {
          // Computed styles still describe entrances that have already finished.
          const names = [element, ...element.querySelectorAll("*")]
            .map((part) => {
              const style = getComputedStyle(part);
              return {
                name: style.animationName,
                iterations: Number(style.animationIterationCount),
              };
            })
            .filter(({ name }) => name !== "none");
          element
            .getAnimations({ subtree: true })
            .forEach((animation) => animation.finish());
          return names;
        });
        expect(animations.length).toBeGreaterThanOrEqual(
          entrance.minimumAnimations,
        );
        expect(animations.every(({ iterations }) => iterations === 1)).toBe(
          true,
        );
        expect(animations.map(({ name }) => name).join(" ")).toContain(
          entrance.keyframe,
        );
      }
      for (const part of visibleParts) {
        for (const element of await part.all()) {
          await expect(element).toHaveCSS("opacity", "1");
          await expect(element).toHaveCSS("transform", "none");
          if (reducedMotion === "reduce") {
            await expect(element).toHaveCSS("animation-name", "none");
            await expect(element).toHaveCSS("animation-delay", "0s");
          }
        }
      }
      await expect(brand.locator("img")).toBeVisible();
      const actions = page.locator("[data-dashboard-primary-action]");
      await expect(actions).toHaveCount(2);
      await actions.last().click({ trial: true });

      if (reducedMotion === "no-preference") {
        // A language change rerenders the actual component through its i18n hook.
        const language = await page.evaluate(
          async (value) => {
            Math.random = () => value;
            const modulePath = "/src/shared/i18n/i18.ts";
            const { default: i18n } = (await import(modulePath)) as {
              default: {
                changeLanguage: (language: string) => Promise<unknown>;
                language: string;
              };
            };
            await i18n.changeLanguage("en");
            return i18n.language;
          },
          (((index + 1) % 3) + 0.5) / 3,
        );
        expect(language).toBe("en");
        // English currently falls back to Persian; the event still rerenders.
        await expect(page.locator("#creation-choice-title")).toHaveText(
          "چی می‌خوای بسازی؟",
        );
        await expect(brand).toHaveAttribute(
          "data-brand-entrance",
          entrance.name,
        );
        expect(
          await brand.evaluate(
            (element) =>
              element
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState !== "finished")
                .length,
          ),
        ).toBe(0);
        await actions.first().click();
        await expect(page).toHaveURL(/\/generation\/image$/);
        // Lazy navigation updates the URL before the new route has committed.
        await expect(brand).toHaveCount(0);
        await expect(page.locator("[data-generation-composer]")).toBeVisible();
        await page.goBack();
        await expect(brand).toHaveAttribute(
          "data-brand-entrance",
          brandEntrances[(index + 1) % brandEntrances.length].name,
        );
      }
    });
  }
}

test("keeps brand color roles legible in both themes", async ({ page }) => {
  await mockDashboardApi(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const results = await page.evaluate(() => {
    const root = document.documentElement;
    const originalClass = root.className;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d")!;
    const results: { theme: string; pair: string; ratio: number }[] = [];
    const luminance = (rgb: number[]) =>
      rgb.reduce((sum, value, index) => {
        const channel = value / 255;
        const linear =
          channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        return sum + linear * [0.2126, 0.7152, 0.0722][index];
      }, 0);

    try {
      for (const theme of ["light", "dark"]) {
        root.classList.toggle("dark", theme === "dark");
        const styles = getComputedStyle(root);
        const color = (token: string) =>
          styles.getPropertyValue(`--${token}`).trim();
        if (!color("glass-surface") || !color("brand-gradient")) {
          throw new Error(
            `Missing shared brand/glass tokens in ${theme} theme`,
          );
        }
        const paint = (...tokens: string[]) => {
          context.clearRect(0, 0, 1, 1);
          for (const token of tokens) {
            context.fillStyle = token.startsWith("#") ? token : color(token);
            context.fillRect(0, 0, 1, 1);
          }
          return luminance(
            [...context.getImageData(0, 0, 1, 1).data].slice(0, 3),
          );
        };
        for (const [foreground, background] of [
          ["foreground", "background"],
          ["card-foreground", "card"],
          ["popover-foreground", "popover"],
          ["muted-foreground", "muted"],
          ["primary-foreground", "primary"],
          ["secondary-foreground", "secondary"],
          ["accent-foreground", "accent"],
          ["destructive-foreground", "destructive"],
          ["sidebar-foreground", "sidebar"],
          ["foreground", "glass-surface"],
          ["muted-foreground", "glass-surface"],
          ["foreground", "glass-surface-strong"],
          ["image-accent", "card"],
          ["video-accent", "card"],
        ]) {
          const back = paint("background", background);
          const front = paint("background", background, foreground);
          results.push({
            theme,
            pair: `${foreground}/${background}`,
            ratio:
              (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05),
          });
        }
        for (const backdrop of ["#000", "#fff"]) {
          const back = paint(backdrop, "glass-surface");
          const front = paint(backdrop, "glass-surface", "muted-foreground");
          results.push({
            theme,
            pair: `muted-foreground/glass-surface over ${backdrop}`,
            ratio:
              (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05),
          });
        }
      }
    } finally {
      root.className = originalClass;
    }
    return results;
  });

  for (const { theme, pair, ratio } of results) {
    expect(ratio, `${theme}: ${pair}`).toBeGreaterThanOrEqual(4.5);
  }
  await test.info().attach("brand-contrast", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
});

for (const surface of [
  { name: "profile", path: "/profile/settings", heading: "اینجا حساب خودته" },
  { name: "login", path: "/auth/login", heading: "از همین‌جا شروع کن" },
]) {
  test(`keeps branded ${surface.name} surfaces usable across screen sizes`, async ({
    page,
  }) => {
    await mockDashboardApi(page);
    if (surface.name === "login") {
      await mockAnonymousSession(page);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const viewport of [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(surface.path);
      await expect(
        page.getByRole("heading", { name: surface.heading }),
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: test.info().outputPath(`${surface.name}-${viewport.width}.png`),
        animations: "disabled",
        fullPage: true,
      });
    }
  });
}

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`office entrance reveals the dashboard at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() =>
      localStorage.setItem("perpix:boot-splash", "on"),
    );
    await mockDashboardApi(page);
    await page.goto("/");
    await expect(page.locator("[data-office-screen]")).toBeVisible();
    await expect(page.locator("[data-boot-splash]")).toHaveCount(0, {
      timeout: 10_000,
    });
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "چی می‌خوای بسازی؟" }),
    ).toBeVisible();
    await expect(page.locator("body")).not.toHaveAttribute("inert");
  });
}

test("office entrance waits for the account shell before revealing the dashboard", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("perpix:boot-splash", "on"),
  );
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await mockDashboardApi(page);
  let release = () => {};
  let requested = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  const started = new Promise<void>((resolve) => {
    requested = resolve;
  });
  await page.route("**/api/v1/user/get-info", async (route) => {
    requested();
    await held;
    await route.fallback().catch(() => {});
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await started;
    const entrance = page.locator("[data-boot-splash]");
    await expect(entrance).toBeVisible();
    await page.clock.runFor(4000);
    await page.clock.runFor(2000);
    await expect(entrance).toBeVisible();
    await expect(entrance).toHaveAttribute("data-leaving", "false");
    release();
    await page.clock.resume();
    await expect(entrance).toHaveCount(0, { timeout: 5000 });
    await expect(
      page.getByRole("heading", { name: "چی می‌خوای بسازی؟" }),
    ).toBeVisible();
  } finally {
    release();
  }
});

test("shows a personal studio dashboard backed by current APIs", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "چی می‌خوای بسازی؟",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /یک عکس بسازم/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /یک ویدیو بسازم/ }),
  ).toBeVisible();
  await expect(page.locator("#dashboard-creative-prompt")).toHaveCount(0);
  await expect(page.getByText("۲۴۸", { exact: true })).toBeVisible();
  await expect(
    page.getByLabel("حساب تو").getByText("حرفه‌ای", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "کارهای اخیر" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "خروجی‌های اخیر" }),
  ).toBeVisible();
  const scrollCompanion = page.locator("[data-dashboard-scroll-companion]");
  const scrollViewport = page.locator('[data-slot="scroll-area-viewport"]');
  await expect(scrollCompanion).toHaveAttribute("data-scrollable", "true");
  await expect(scrollCompanion).toBeVisible();
  await scrollViewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect
    .poll(() =>
      scrollCompanion.evaluate((element) =>
        Number.parseFloat(element.style.getPropertyValue("--scroll-progress")),
      ),
    )
    .toBeGreaterThan(90);
  await scrollViewport.evaluate((element) => {
    element.scrollTop = 0;
  });
  await page.screenshot({
    path: test.info().outputPath("desktop.png"),
    animations: "disabled",
  });
});

test("hidden mobile companion skips scroll work and reconnects on desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockDashboardApi(page);
  await page.goto("/");
  const companion = page.locator("[data-dashboard-scroll-companion]");
  await expect(companion).toBeAttached();
  await page
    .locator('[data-slot="scroll-area-viewport"]')
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event("scroll"));
    });
  await page.waitForTimeout(100);
  await expect(companion).not.toHaveAttribute("style");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(companion).toHaveAttribute("style", /--scroll-progress:/);
  await page.setViewportSize({ width: 375, height: 812 });
  const position = await companion.getAttribute("style");
  await page
    .locator('[data-slot="scroll-area-viewport"]')
    .evaluate((element) => {
      element.scrollTop = 0;
      element.dispatchEvent(new Event("scroll"));
    });
  await page.waitForTimeout(100);
  expect(await companion.getAttribute("style")).toBe(position);
});

test("keeps primary dashboard actions usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "چی می‌خوای بسازی؟",
    }),
  ).toBeVisible();
  const actions = page.locator("[data-dashboard-primary-action]");
  await expect(actions).toHaveCount(2);
  for (const action of await actions.all()) {
    expect((await action.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBe(widths.client);
  await expect(page.locator("[data-dashboard-scroll-companion]")).toBeHidden();
  await page.screenshot({
    path: test.info().outputPath("mobile.png"),
    animations: "disabled",
  });
});

test("keeps the sidebar navigation usable across screen sizes", async ({
  page,
}, testInfo) => {
  await mockDashboardApi(page);

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const toggle = page.locator("header button[aria-expanded]");
    if ((await toggle.getAttribute("aria-expanded")) === "false") {
      await toggle.click();
    }

    const navigation = page
      .locator("nav")
      .filter({ has: page.locator('a[href="/generation/image"]') })
      .first();
    await expect(navigation).toBeVisible();
    const links = navigation.locator("ul > li > a");
    await expect(links).toHaveCount(5);
    for (const link of await links.all()) {
      expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }

    const sidebarWidth = await navigation.evaluate((element) => ({
      client: element.clientWidth,
      scroll: element.scrollWidth,
    }));
    expect(sidebarWidth.scroll).toBe(sidebarWidth.client);
    await page.screenshot({
      path: testInfo.outputPath(`sidebar-${viewport.name}.png`),
      animations: "disabled",
    });
  }
});

test("keeps the account menu visible and keyboard accessible across screen sizes", async ({
  page,
  browserName,
}, testInfo) => {
  // Three full dashboard loads take ~28s in Playwright WebKit on Windows,
  // right at the 30s default; Chromium needs ~9s.
  test.slow(browserName === "webkit", "three full page loads in WebKit");
  await mockDashboardApi(page);

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const toggle = page.locator("header button[aria-expanded]");
    if ((await toggle.getAttribute("aria-expanded")) === "false") {
      await toggle.click();
    }

    const trigger = page
      .locator('[data-slot="dropdown-menu-trigger"]')
      .filter({ has: page.locator('[data-slot="avatar"]') });
    await trigger.click();

    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible();
    const items = menu.locator('[data-slot="dropdown-menu-item"]');
    expect(await items.count()).toBeGreaterThanOrEqual(2);
    for (const item of await items.all()) {
      expect((await item.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }

    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    }
    await page.screenshot({
      path: testInfo.outputPath(`account-menu-${viewport.name}.png`),
      animations: "disabled",
    });

    await page.keyboard.press("ArrowDown");
    await expect(
      menu.locator('[data-slot="dropdown-menu-item"][data-highlighted]'),
    ).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .locator('[data-slot="dropdown-menu-trigger"]')
    .filter({ has: page.locator('[data-slot="avatar"]') })
    .click();
  await expect(page.locator('[data-slot="dropdown-menu-content"]')).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("centers the neon slogan in the header across screen sizes", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/");

  const header = page.locator("header");
  const slogan = page.locator("[data-header-slogan]");
  const menu = header.locator("button");
  await expect(slogan).toHaveAttribute("aria-label", "پرپیکس می‌تونه!");
  if ((await menu.getAttribute("aria-expanded")) === "true") {
    await menu.click();
  }

  for (const viewport of [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    // The header re-lays out a frame after a programmatic resize; retry until it settles.
    await expect
      .poll(
        async () => {
          const [headerBox, sloganBox, menuBox] = await Promise.all([
            header.boundingBox(),
            slogan.boundingBox(),
            menu.boundingBox(),
          ]);
          if (!headerBox || !sloganBox || !menuBox) return null;
          return {
            centered:
              Math.abs(
                sloganBox.x +
                  sloganBox.width / 2 -
                  (headerBox.x + headerBox.width / 2),
              ) < 2,
            clearOfMenu: sloganBox.x + sloganBox.width < menuBox.x,
          };
        },
        { message: `slogan layout at ${viewport.name}` },
      )
      .toEqual({ centered: true, clearOfMenu: true });
    await header.screenshot({
      path: test.info().outputPath(`${viewport.name}-header.png`),
      animations: "disabled",
    });
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  const animationName = await slogan
    .locator("span")
    .nth(1)
    .evaluate((element) => getComputedStyle(element, "::after").animationName);
  expect(animationName).toBe("none");
});

test("explains both creation choices without asking for a prompt", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(page.getByText("عکس محصول", { exact: true })).toBeVisible();
  await expect(page.getByText("کلیپ تبلیغاتی", { exact: true })).toBeVisible();
  await expect(page.locator("#dashboard-creative-prompt")).toHaveCount(0);
  await expect(
    page
      .getByText(
        "فقط با ورود به ابزار، چیزی ساخته نمی‌شه و اعتباری مصرف نمی‌کنی",
      )
      .first(),
  ).toBeVisible();
});

for (const [mode, label] of [
  ["image", "عکس"],
  ["video", "ویدیو"],
]) {
  test(`opens ${mode} with an empty optional prompt without generation`, async ({
    page,
  }) => {
    await mockDashboardApi(page);
    const mutations: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/ai-task/") && request.method() === "POST") {
        mutations.push(request.url());
      }
    });
    await page.goto("/");
    const entry = page.getByRole("button", {
      name: new RegExp(`یک ${label} بسازم`),
    });
    await expect(entry).toBeEnabled();
    await entry.click();
    await expect(page).toHaveURL(new RegExp(`/generation/${mode}$`));
    await expect(page.locator("textarea").first()).toHaveValue("");
    await expect(
      page.getByText("FLUX Pro", { exact: true }).first(),
    ).toBeVisible();
    expect(mutations).toEqual([]);
  });
}

test("keeps desk accessible with reduced motion and keyboard navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await mockDashboardApi(page);
  await page.goto("/");
  const image = page.getByRole("button", { name: /یک عکس بسازم/ });
  await expect(image).toHaveCSS("animation-name", "none");
  await image.focus();
  await page.keyboard.press("Tab");
  const video = page.getByRole("button", { name: /یک ویدیو بسازم/ });
  await expect(video).toBeFocused();
  expect((await video.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test("keeps the image creation turn and composer in view", async ({ page }) => {
  await mockDashboardApi(page);
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "generation-subscription",
        started_at: "2026-09-01T00:00:00Z",
        expires_at: "2026-10-01T00:00:00Z",
        plan: {
          uuid: "generation-plan",
          name: "pro",
          display_name: "حرفه‌ای",
          scopes: ["ai_task:write"],
          allowed_models: ["flux-pro"],
          is_active: true,
        },
      },
    }),
  );
  let generatedTask: Record<string, unknown> | undefined;
  // The conversation refetches its task after generating; an aborted refetch
  // intentionally swaps the turn for the history error state.
  await page.route("**/api/v1/ai-task/generation-task", (route) =>
    generatedTask
      ? route.fulfill({ json: generatedTask })
      : route.fulfill({ status: 404, json: { detail: "Not found" } }),
  );
  await page.route("**/api/v1/ai-task/generate", async (route) => {
    const request = route.request().postDataJSON() as {
      ai_model_config: Record<string, unknown>;
    };
    generatedTask = {
      uuid: "generation-task",
      task_type: "IMAGE",
      created_at: "2026-09-15T20:00:00Z",
      updated_at: "2026-09-15T20:00:00Z",
      messages: [
        {
          uuid: "generation-user-message",
          role: "USER",
          message: request.ai_model_config.prompt,
          ai_model_uuid: "model-1",
          ai_model_config: request.ai_model_config,
        },
        {
          uuid: "generation-assistant-message",
          role: "ASSISTANT",
          message: null,
          task_status: "IN_PROGRESS",
          ai_model_uuid: "model-1",
          ai_model_config: request.ai_model_config,
        },
      ],
    };
    await route.fulfill({ json: generatedTask });
  });
  await page.goto("http://localhost:5173/generation/image");
  await expect(
    page.getByRole("heading", { name: "ساخته‌های اخیر" }),
  ).toBeVisible();
  await expect(page.locator("[data-sidebar-history-item]")).toHaveCount(1);

  const prompt = page.getByRole("textbox", { name: "توصیف تصویر" });
  await prompt.fill("یک شهر آینده‌نگر در شب با نورهای نئونی و جزئیات فراوان");
  await page.getByRole("button", { name: "بزرگ‌کردن و ویرایش پرامپت" }).click();
  const expandedPrompt = page.getByRole("dialog").getByRole("textbox");
  await expect(expandedPrompt).toHaveValue(/شهر آینده‌نگر/);
  await expandedPrompt.fill(
    "یک شهر آینده‌نگر در شب، سبک سینمایی و باران نئونی",
  );
  await page.getByRole("button", { name: "اعمال تغییرات پرامپت" }).click();

  await page.getByRole("button", { name: "ساخت تصویر" }).click();
  const userMessage = page.locator('[data-message-role="user"]');
  const assistantMessage = page.locator('[data-message-role="assistant"]');
  await expect(userMessage).toBeVisible();
  await expect(assistantMessage).toBeVisible();
  const [userBox, assistantBox] = await Promise.all([
    userMessage.boundingBox(),
    assistantMessage.boundingBox(),
  ]);
  expect(userBox?.x).toBeGreaterThan(assistantBox?.x ?? 0);
  const unbornMuseum = page.getByLabel("در حال ساخت عکس");
  await expect(unbornMuseum).toBeInViewport();
  await expect(unbornMuseum.getByText("شهر", { exact: true })).toBeVisible();

  const composer = page.locator("[data-generation-composer]");
  await expect(composer).toBeInViewport();
  await page.screenshot({
    path: test.info().outputPath("unborn-museum-desktop.png"),
    animations: "disabled",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await composer.evaluate((element) =>
    element.scrollIntoView({ block: "end", behavior: "auto" }),
  );
  await expect(unbornMuseum).toBeInViewport();
  await expect(composer).toBeInViewport();
  const pageWidth = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(pageWidth.scroll).toBe(pageWidth.client);
});

test("turns video generation into an immersive persistent workspace", async ({
  page,
}, testInfo) => {
  await mockDashboardApi(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  const videoConfig = JSON.parse(
    readFileSync(
      new URL(
        "../../../../__tests__/fixtures/seedance-video-config.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ) as { canonical_ui_schema: unknown; modes: Record<string, unknown> };
  const videoModel = {
    uuid: "model-1",
    model_owner: "BYTEDANCE",
    name: "BYTEDANCE_SEEDANCE_2_POINT_5",
    display_name: "Seedance dashboard fixture",
    description: "Mocked dashboard video model",
    icon_url: null,
    tags: ["video"],
    supported_inputs: ["TEXT", "IMAGE"],
    supported_outputs: ["VIDEO"],
    min_cost: 10000,
    max_cost: 100000,
    ...videoConfig,
  };
  await page.route("**/api/v1/ai-registry/models**", (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname.endsWith("/model-1")) {
      return route.fulfill({ json: videoModel });
    }
    return route.fulfill({ json: [videoModel] });
  });
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "video-subscription",
        plan: {
          uuid: "video-plan",
          name: "pro",
          display_name: "حرفه‌ای",
          scopes: ["ai_task:write"],
          allowed_models: ["BYTEDANCE_SEEDANCE_2_POINT_5"],
          is_active: true,
        },
      },
    }),
  );
  let submittedConfig: Record<string, unknown> = {
    prompt: "حرکت آرام دوربین به سمت یک شهر در مه",
  };
  const videoTask = () => ({
    uuid: "video-generation-task",
    task_type: "VIDEO",
    created_at: "2026-09-15T20:00:00Z",
    updated_at: "2026-09-15T20:01:00Z",
    messages: [
      {
        uuid: "video-user-message",
        role: "USER",
        message: submittedConfig.prompt,
        ai_model_uuid: "model-1",
        ai_model_config: submittedConfig,
      },
      {
        uuid: "video-assistant-message",
        role: "ASSISTANT",
        task_status: "IN_PROGRESS",
        ai_model_uuid: "model-1",
        ai_model_config: submittedConfig,
      },
    ],
  });
  await page.route("**/api/v1/ai-task/video-generation-task", (route) =>
    route.fulfill({ json: videoTask() }),
  );
  await page.route(
    "**/api/v1/ai-task/result/video-assistant-message",
    (route) => route.fulfill({ json: videoTask().messages[1] }),
  );
  await page.route("**/api/v1/ai-task/generate", async (route) => {
    const request = route.request().postDataJSON() as {
      ai_model_config: Record<string, unknown>;
    };
    submittedConfig = request.ai_model_config;
    await route.fulfill({ json: videoTask() });
  });

  await page.goto("http://localhost:5173/generation/video");
  await expect(page.locator('[data-video-cinema="idle"]')).toBeVisible();
  const composer = page.locator("[data-generation-composer]");
  await expect(composer).toBeInViewport();

  await page.locator("textarea").fill("حرکت آرام دوربین به سمت یک شهر در مه");
  await composer.getByRole("button", { name: "بسازش", exact: true }).click();
  await expect(page.locator('[data-message-role="user"]')).toBeVisible();
  const generationPortal = page.locator("[data-video-generation-portal]");
  await expect(generationPortal).toBeVisible();
  await expect(page.locator('[data-video-cinema="rendering"]')).toBeVisible();
  await expect(composer).toBeInViewport();

  // Resizing must target the persisted session after the optimistic turn remounts.
  await expect(page).toHaveURL(/\/generation\/video\/video-generation-task$/);
  await expect(page.locator("#video-assistant-message")).toBeVisible();

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await composer.scrollIntoViewIfNeeded();
    await expect(composer).toBeInViewport();
    // The narrow layout places the composer before the scrollable timeline.
    await generationPortal.scrollIntoViewIfNeeded();
    await expect(generationPortal).toBeInViewport();
    const pageWidth = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(pageWidth.scroll).toBe(pageWidth.client);
    await page.screenshot({
      path: testInfo.outputPath(`video-workspace-${viewport.width}.png`),
      animations: "disabled",
    });
  }
});

const VISUAL_QUALITY_KEY = "perpix:visual-quality";

const readGlassLayout = async (page: Page) => {
  // Panels render as their queries settle; measure only the settled layout.
  for (const id of ["account", "activity", "transactions"]) {
    await expect(page.locator(`#${id}-heading`)).toBeVisible();
  }
  return page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>("[data-dashboard-hero]");
    const panels = [
      ...document.querySelectorAll<HTMLElement>(
        "[data-dashboard-hero], [data-dashboard-panel]",
      ),
    ];
    const robot = document.querySelector<HTMLElement>(
      "[data-dashboard-companion-robot]",
    );
    return {
      tier: document.documentElement.dataset.fx,
      heroBackdrop: hero ? getComputedStyle(hero).backdropFilter : "missing",
      robotTransition: robot
        ? getComputedStyle(robot).transitionDuration
        : "missing",
      boxes: panels.map((panel) => {
        const { x, y, width, height } = panel.getBoundingClientRect();
        return [x, y, width, height].map(Math.round);
      }),
    };
  });
};

test("lite visual tier drops glass blur without moving the layout", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/?fx=full");
  await expect(page.locator("#creation-choice-title")).toBeVisible();
  await expect(
    page.locator("[data-dashboard-scroll-companion]"),
  ).toHaveAttribute("data-scrollable", "true");
  const full = await readGlassLayout(page);
  expect(full.tier).toBe("full");
  expect(full.heroBackdrop).toContain("blur");
  // The companion tracks scrolling directly on every tier.
  expect(full.robotTransition).toBe("0s");

  await page.goto("/?fx=lite");
  await expect(page.locator("#creation-choice-title")).toBeVisible();
  await expect(
    page.locator("[data-dashboard-scroll-companion]"),
  ).toHaveAttribute("data-scrollable", "true");
  const lite = await readGlassLayout(page);
  expect(lite.tier).toBe("lite");
  expect(lite.heroBackdrop).toBe("none");
  expect(lite.boxes).toEqual(full.boxes);

  // A pinned tier survives navigation until `?fx=auto` clears it.
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-fx", "lite");
  // Let the session route settle before the next navigation (WebKit).
  await expect(page.locator("#creation-choice-title")).toBeVisible();
  await page.goto("/?fx=auto");
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key) ?? "{}").source,
        VISUAL_QUALITY_KEY,
      ),
    )
    .toBe("auto");
});

test("low-memory devices start on the lite visual tier", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "deviceMemory", { get: () => 2 });
  });
  await mockDashboardApi(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-fx", "lite");
});

const scrollWithWheel = async (page: Page, steps: number) => {
  await page.mouse.move(700, 450);
  for (let step = 0; step < steps; step += 1) {
    await page.mouse.wheel(0, step % 8 < 4 ? 260 : -260);
    await page.waitForTimeout(45);
  }
};

const openDashboardOnFullTier = async (page: Page) => {
  await page.addInitScript((key) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(
        key,
        JSON.stringify({ tier: "full", source: "auto", at: Date.now() }),
      );
    }
  }, VISUAL_QUALITY_KEY);
  await mockDashboardApi(page);
  await page.goto("/");
  await expect(page.locator("#creation-choice-title")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-fx", "full");
};

/**
 * Simulates a weak GPU (~30ms of work per frame) while scrolling `selector`.
 * mouse.wheel waits for a rendered frame, so scrolling is driven in-page.
 */
const scrollJankily = (page: Page, selector: string) =>
  page.evaluate(
    (target) =>
      new Promise<void>((resolve) => {
        let isDone = false;
        const burn = () => {
          const end = performance.now() + 30;
          while (performance.now() < end) {
            // busy wait
          }
          if (!isDone) requestAnimationFrame(burn);
        };
        requestAnimationFrame(burn);
        const scroller = document.querySelector<HTMLElement>(target);
        let step = 0;
        const timer = window.setInterval(() => {
          if (scroller) scroller.scrollTop = (step % 20) * 40;
          step += 1;
          if (step > 300) {
            window.clearInterval(timer);
            isDone = true;
            resolve();
          }
        }, 40);
      }),
    selector,
  );

const readStoredQuality = (page: Page) =>
  page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? "{}"),
    VISUAL_QUALITY_KEY,
  );

test("janky dashboard scrolling downgrades to lite once the gesture settles", async ({
  page,
  browserName,
}) => {
  // Playwright WebKit on Windows renders ~1 frame/s, so frame timing is noise.
  test.skip(browserName !== "chromium", "frame pacing is measured in Chromium");
  test.setTimeout(60_000);
  await openDashboardOnFullTier(page);

  await scrollJankily(page, '[data-slot="scroll-area-viewport"]');

  await expect(page.locator("html")).toHaveAttribute("data-fx", "lite", {
    timeout: 5_000,
  });
  expect(await readStoredQuality(page)).toMatchObject({
    tier: "lite",
    source: "auto",
  });
});

test("janky scrolling outside the dashboard viewport keeps the full tier", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "frame pacing is measured in Chromium");
  test.setTimeout(60_000);
  await openDashboardOnFullTier(page);
  await page.evaluate(() => {
    const scroller = document.createElement("div");
    scroller.id = "unrelated-scroller";
    scroller.style.cssText =
      "position:fixed;inset:auto 0 0 auto;width:200px;height:200px;overflow:auto";
    scroller.innerHTML = '<div style="height:4000px"></div>';
    document.body.append(scroller);
  });

  await scrollJankily(page, "#unrelated-scroller");
  // Give a wrongly attached monitor time to settle and downgrade.
  await page.waitForTimeout(1_500);

  await expect(page.locator("html")).toHaveAttribute("data-fx", "full");
  expect(await readStoredQuality(page)).toMatchObject({ tier: "full" });
});

for (const tier of ["full", "lite"] as const) {
  test(`reports scroll frame pacing on the ${tier} tier`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "frame pacing is measured in Chromium",
    );
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await mockDashboardApi(page);
    await page.goto(`/?fx=${tier}`);
    await expect(page.locator("#creation-choice-title")).toBeVisible();
    await page.evaluate(() => {
      const deltas: number[] = [];
      let last = 0;
      const sample = (time: number) => {
        if (last) deltas.push(time - last);
        last = time;
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
      Object.assign(window, { __frameDeltas: deltas });
    });
    await scrollWithWheel(page, 60);
    const deltas = await page.evaluate(
      () => (window as unknown as { __frameDeltas: number[] }).__frameDeltas,
    );
    const sorted = [...deltas].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const slow = deltas.filter((delta) => delta > (1000 / 60) * 1.6).length;
    const summary = `${tier}: frames=${deltas.length} p50=${p50.toFixed(1)}ms p95=${p95.toFixed(1)}ms slow=${((slow / deltas.length) * 100).toFixed(1)}%`;
    test
      .info()
      .annotations.push({ type: "scroll-pacing", description: summary });
    expect(deltas.length).toBeGreaterThan(60);
  });
}
