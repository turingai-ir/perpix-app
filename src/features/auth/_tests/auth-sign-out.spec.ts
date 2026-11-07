import { expect, test, type Page } from "@playwright/test";

import {
  accessResponse,
  mockAuthenticatedSession,
  sessionHeaders,
} from "../../../../__tests__/support/auth-session";

import { errorBody, mockAppShellApis } from "./support";

const userMenu = (page: Page) => page.getByRole("button", { name: /Free/ });

/** Signed in until the first successful logout call flips the cookie state. */
async function mockSessionThatEndsOnLogout(page: Page) {
  const state = { signedIn: true, logoutCsrf: undefined as string | undefined };
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    state.signedIn
      ? route.fulfill({ json: { csrf_token: "csrf-1" } })
      : route.fulfill({ status: 401, json: errorBody() }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await page.route("**/api/v1/auth/logout", (route) => {
    state.logoutCsrf = route.request().headers()["x-csrf-token"];
    state.signedIn = false;

    return route.fulfill({ status: 204 });
  });

  return state;
}

test("signing out sends the CSRF header, clears the session and survives reload", async ({
  page,
}) => {
  const state = await mockSessionThatEndsOnLogout(page);
  await page.goto("/");

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "خروج", exact: true }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect.poll(() => state.logoutCsrf).toBe("csrf-1");

  await page.goto("/");
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("a sign-out the server could not confirm is reported with a retry", async ({
  page,
}) => {
  let refreshes = 0;
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) => {
    refreshes += 1;
    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });
  await page.route("**/api/v1/auth/logout", (route) => route.abort());
  await page.goto("/");

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "خروج", exact: true }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(
    page.getByText("خروج از حساب تأیید نشد. دوباره امتحان کن."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "دوباره امتحان کن" }),
  ).toBeVisible();
  const beforeReload = refreshes;
  await page.goto("/");
  await expect(page).toHaveURL(/\/auth\/login/);
  expect(refreshes).toBe(beforeReload);

  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({ json: { next_step: "password" } }),
  );
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByRole("button", { name: "ادامه دادن" }).click();
  await page.getByLabel("رمز عبور", { exact: true }).fill("secret");
  await page.getByRole("button", { name: /^ورود/ }).click();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("perpix:local-sign-out")),
    )
    .toBeNull();
});

test("the user menu only offers signing out of the current device", async ({
  page,
}) => {
  await mockSessionThatEndsOnLogout(page);
  await page.goto("/");

  await userMenu(page).click();
  await expect(
    page.getByRole("menuitem", { name: "خروج", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "خروج از همهٔ دستگاه‌ها" }),
  ).toHaveCount(0);
});

test("signing out in one tab signs the other tab out too", async ({
  context,
  page,
}) => {
  const state = { signedIn: true };
  await context.route("**/api/v1/auth/csrf", (route) =>
    state.signedIn
      ? route.fulfill({ json: { csrf_token: "csrf-1" } })
      : route.fulfill({ status: 401, json: errorBody() }),
  );
  await context.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await context.route("**/api/v1/auth/logout", (route) => {
    state.signedIn = false;

    return route.fulfill({ status: 204 });
  });
  const otherTab = await context.newPage();
  await mockAppShellApis(page);
  await mockAppShellApis(otherTab);
  await page.goto("/");
  await otherTab.goto("/");
  await expect(userMenu(otherTab)).toBeVisible();

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "خروج", exact: true }).click();

  await expect(otherTab).toHaveURL(/\/auth\/login$/);
});

for (const pendingEndpoint of ["csrf", "logout"]) {
  test(`local and cross-tab logout finish before a pending ${pendingEndpoint} response`, async ({
    context,
    page,
  }) => {
    await context.routeWebSocket("**/*", (socket) => socket.close());
    await context.route("**/api/v1/**", (route) => route.abort());
    await mockAuthenticatedSession(context);
    const otherTab = await context.newPage();
    for (const tab of [page, otherTab]) {
      await mockAppShellApis(tab);
      await tab.goto("/profile/settings");
      await expect(tab.getByLabel("نام کامل", { exact: true })).toBeVisible();
      await tab.evaluate(async () => {
        const path = "/src/shared/lib/react-query.ts";
        const {
          queryClient,
        }: typeof import("../../../shared/lib/react-query") = await import(
          path
        );
        queryClient.setQueryData(["qa-private-before-logout"], "previous-user");
      });
    }

    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let pending = false;
    await context.route("**/api/v1/auth/logout", (route) =>
      route.fulfill({ status: 204 }),
    );
    await context.route(`**/api/v1/auth/${pendingEndpoint}`, async (route) => {
      pending = true;
      await gate;
      await route.fulfill(
        pendingEndpoint === "csrf"
          ? { json: { csrf_token: "test-csrf-token" } }
          : { status: 204 },
      );
    });

    try {
      await userMenu(page).click();
      await page.getByRole("menuitem", { name: "خروج", exact: true }).click();
      await expect.poll(() => pending).toBe(true);
      for (const tab of [page, otherTab]) {
        await expect(tab).toHaveURL(/\/auth\/login$/);
        const state = await tab.evaluate(async () => {
          const storePath = "/src/features/auth/services/session-store.ts";
          const { sessionStore }: typeof import("../services/session-store") =
            await import(storePath);
          const queryPath = "/src/shared/lib/react-query.ts";
          const {
            queryClient,
          }: typeof import("../../../shared/lib/react-query") = await import(
            queryPath
          );
          const fetchPath = "/src/features/auth/services/authorized-fetch.ts";
          const auth: typeof import("../services/authorized-fetch") =
            await import(fetchPath);
          let sent = 0;
          const request = auth.createAuthorizedFetch(async () => {
            sent += 1;
            return Response.json({});
          });
          let denied = false;
          try {
            await request(`${location.origin}/api/v1/wallet/wallet`);
          } catch {
            denied = true;
          }
          return {
            status: sessionStore.getStatus(),
            hasToken: sessionStore.getAccessToken() !== null,
            cached:
              queryClient.getQueryData(["qa-private-before-logout"]) ?? null,
            sent,
            denied,
          };
        });
        expect(state).toEqual({
          status: "anonymous",
          hasToken: false,
          cached: null,
          sent: 0,
          denied: true,
        });
      }
    } finally {
      release();
    }
  });
}

for (const replacementTab of ["same", "other"]) {
  test(`a logout retry warning is dismissed after replacement login in the ${replacementTab} tab`, async ({
    context,
    page,
  }) => {
    await context.routeWebSocket("**/*", (socket) => socket.close());
    await context.route("**/api/v1/**", (route) => route.abort());
    await mockAuthenticatedSession(context);
    await mockAppShellApis(page);
    await page.goto("/profile/settings");
    await expect(page.getByLabel("نام کامل", { exact: true })).toBeVisible();
    const replacementPage =
      replacementTab === "other" ? await context.newPage() : page;
    if (replacementPage !== page) {
      await mockAppShellApis(replacementPage);
      await replacementPage.goto("/profile/settings");
      await expect(
        replacementPage.getByLabel("نام کامل", { exact: true }),
      ).toBeVisible();
    }
    let logoutRequests = 0;
    await context.route("**/api/v1/auth/logout", (route) => {
      logoutRequests += 1;
      return route.abort();
    });
    await userMenu(page).click();
    await page.getByRole("menuitem", { name: "خروج", exact: true }).click();
    const warning = page.getByText("خروج از حساب تأیید نشد. دوباره امتحان کن.");
    await expect(warning).toBeVisible();
    if (replacementPage !== page) {
      await expect(replacementPage).toHaveURL(/\/auth\/login$/);
    }
    await replacementPage.evaluate(async () => {
      const path = "/src/features/auth/services/session-manager.ts";
      const manager: typeof import("../services/session-manager") =
        await import(path);
      manager.startSession({
        accessToken: "replacement-session",
        csrfToken: "replacement-csrf",
        expiresInSeconds: 900,
      });
    });
    await expect(warning).toBeHidden();
    expect(logoutRequests).toBe(1);
    const retained = await replacementPage.evaluate(async () => {
      const path = "/src/features/auth/services/session-store.ts";
      const { sessionStore }: typeof import("../services/session-store") =
        await import(path);
      return (
        sessionStore.getStatus() === "authenticated" &&
        sessionStore.getAccessToken() === "replacement-session"
      );
    });
    expect(retained).toBe(true);
  });
}

test("changing the password reports a wrong current password without retrying", async ({
  page,
}) => {
  let changes = 0;
  let refreshes = 0;
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) => {
    refreshes += 1;

    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });
  await page.route("**/api/v1/auth/password-changes", (route) => {
    changes += 1;

    return route.fulfill({ status: 401, json: errorBody() });
  });
  await page.goto("/profile/settings");
  const dialog = page.getByRole("region", {
    name: "تغییر رمز عبور",
    exact: true,
  });
  await dialog.getByLabel("رمز عبور فعلی").fill("wrong-current");
  await dialog
    .getByLabel("رمز عبور جدید", { exact: true })
    .fill("NewStrongPass1");
  await dialog.getByLabel("تکرار رمز عبور جدید").fill("NewStrongPass1");
  await dialog.getByRole("button", { name: "تغییر رمز عبور" }).click();

  await expect(dialog.getByRole("alert")).toHaveText(
    "رمز عبور فعلیت درست نیست.",
  );
  expect(changes).toBe(1);
  expect(refreshes).toBe(1);
  await expect(dialog).toBeVisible();
  await expect(page).not.toHaveURL(/\/auth\/login$/);
});

test("a successful password change ends the session and asks to sign in again", async ({
  page,
}) => {
  const state = { changed: false };
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    state.changed
      ? route.fulfill({ status: 401, json: errorBody() })
      : route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await page.route("**/api/v1/auth/password-changes", (route) => {
    state.changed = true;

    return route.fulfill({ status: 204 });
  });
  await page.goto("/profile/settings");
  const dialog = page.getByRole("region", {
    name: "تغییر رمز عبور",
    exact: true,
  });
  await dialog.getByLabel("رمز عبور فعلی").fill("current-pass");
  await dialog
    .getByLabel("رمز عبور جدید", { exact: true })
    .fill("NewStrongPass1");
  await dialog.getByLabel("تکرار رمز عبور جدید").fill("NewStrongPass1");
  await dialog.getByRole("button", { name: "تغییر رمز عبور" }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByText("رمزت عوض شد. دوباره وارد شو.")).toBeVisible();
});
