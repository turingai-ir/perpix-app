import { expect, test, type Page } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

interface MockProject {
  uuid: string;
  title: string;
  revision: number;
}

// Five days minus an hour: clear of the rounding edge, so it reads "5 days left".
const FUTURE = () =>
  new Date(Date.now() + 5 * 86_400_000 - 3_600_000).toISOString();
const NOW = () => new Date().toISOString();

const summary = (project: MockProject) => ({
  uuid: project.uuid,
  title: project.title,
  schema_version: 1,
  revision: project.revision,
  expire_at: FUTURE(),
  created_at: NOW(),
  updated_at: NOW(),
});

const full = (project: MockProject) => ({
  ...summary(project),
  document: { canvas: { width: 1080, height: 1920, fps: 30 }, tracks: [] },
  files: [],
});

/** A small in-memory studio backend, so the screens can be driven end to end. */
async function mockStudio(page: Page, initial: MockProject[] = []) {
  const projects = [...initial];
  const requests: Array<{ method: string; body: unknown }> = [];

  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/me", (route) =>
    route.fulfill({
      json: {
        email: "test@example.com",
        phone_number: "+989123456789",
        name: null,
        is_verified: true,
        scopes: [],
        default_wallet_uuid: null,
        is_active: true,
        created_at: "2026-10-18T00:00:00Z",
        updated_at: "2026-10-18T00:00:00Z",
      },
    }),
  );
  for (const path of ["/api/v1/ai-task/events", "/api/v1/payment-events"]) {
    await page.route(`**${path}`, (route) =>
      route.fulfill({ contentType: "text/event-stream", body: "" }),
    );
  }

  await page.route("**/api/v1/studio/projects**", async (route) => {
    const request = route.request();
    const method = request.method();
    const { pathname } = new URL(request.url());
    const uuid = pathname.split("/").at(-1);
    const isCollection = pathname.endsWith("/studio/projects");
    const body = request.postDataJSON() as { title?: string } | null;
    requests.push({ method, body });

    if (isCollection && method === "GET") {
      return route.fulfill({
        json: { items: projects.map(summary), has_next: false },
      });
    }
    if (isCollection && method === "POST") {
      const project = {
        uuid: `p-${projects.length + 1}`,
        title: body?.title ?? "",
        revision: 1,
      };
      projects.unshift(project);
      return route.fulfill({ json: full(project) });
    }
    const project = projects.find((item) => item.uuid === uuid);
    if (!project) return route.fulfill({ status: 404, json: {} });
    if (method === "GET") return route.fulfill({ json: full(project) });
    if (method === "PUT") {
      project.title = body?.title ?? project.title;
      project.revision += 1;
      return route.fulfill({ json: full(project) });
    }
    projects.splice(projects.indexOf(project), 1);
    return route.fulfill({ status: 204, body: "" });
  });

  return { projects, requests };
}

test("an empty studio invites the user to start a project", async ({
  page,
}) => {
  await mockStudio(page);
  await page.goto("/studio");

  await expect(page.getByRole("heading", { name: "پروژه‌ها" })).toBeVisible();
  await expect(page.getByText("هنوز پروژه‌ای نداری")).toBeVisible();
  await expect(page.getByRole("button", { name: "پروژهٔ جدید" })).toBeVisible();
});

test("lists projects with the days they have left", async ({ page }) => {
  await mockStudio(page, [
    { uuid: "a", title: "معرفی محصول", revision: 1 },
    { uuid: "b", title: "ولاگ سفر", revision: 1 },
  ]);
  await page.goto("/studio");

  await expect(page.getByText("معرفی محصول")).toBeVisible();
  await expect(page.getByText("ولاگ سفر")).toBeVisible();
  await expect(page.getByText("۵ روز مانده")).toHaveCount(2);
});

test("a new project is named in a sheet and then opened", async ({ page }) => {
  const { requests } = await mockStudio(page);
  await page.goto("/studio");

  await page.getByRole("button", { name: "پروژهٔ جدید" }).click();
  const field = page.getByRole("textbox", { name: "اسم پروژه" });
  await expect(field).toBeFocused();
  await field.fill("کلیپ تبلیغاتی");
  await page.getByRole("button", { name: "ساخت پروژه" }).click();

  await expect(page).toHaveURL(/\/studio\/p-1$/);
  await expect(
    page.getByRole("heading", { name: "کلیپ تبلیغاتی" }),
  ).toBeVisible();

  const created = requests.find((request) => request.method === "POST");
  expect(created?.body).toMatchObject({
    title: "کلیپ تبلیغاتی",
    schema_version: 1,
    document: { canvas: { width: 1080, height: 1920, fps: 30 } },
  });
});

test("a blank name cannot be saved", async ({ page }) => {
  await mockStudio(page);
  await page.goto("/studio");

  await page.getByRole("button", { name: "پروژهٔ جدید" }).click();
  await page.getByRole("textbox", { name: "اسم پروژه" }).fill("   ");
  await expect(page.getByRole("button", { name: "ساخت پروژه" })).toBeDisabled();
});

test("renames a project from its menu", async ({ page }) => {
  await mockStudio(page, [{ uuid: "a", title: "قدیمی", revision: 3 }]);
  await page.goto("/studio");

  await page.getByRole("button", { name: /گزینه‌های «قدیمی»/ }).click();
  await page.getByRole("button", { name: "تغییر اسم" }).click();
  const field = page.getByRole("textbox", { name: "اسم پروژه" });
  await expect(field).toHaveValue("قدیمی");
  await field.fill("جدید");
  await page.getByRole("button", { name: "ذخیره" }).click();

  await expect(page.getByText("جدید", { exact: true })).toBeVisible();
  await expect(page.getByText("قدیمی")).toHaveCount(0);
});

test("deleting asks once more and then removes the card", async ({ page }) => {
  await mockStudio(page, [
    { uuid: "a", title: "یکی", revision: 1 },
    { uuid: "b", title: "دیگری", revision: 1 },
  ]);
  await page.goto("/studio");

  await page.getByRole("button", { name: /گزینه‌های «یکی»/ }).click();
  await page.getByRole("button", { name: "حذف پروژه" }).click();
  await expect(page.getByText(/فایل‌های ویدیو و زیرنویس‌ها/)).toBeVisible();
  await page.getByRole("button", { name: "بله، حذف کن" }).click();

  await expect(page.getByText("یکی", { exact: true })).toHaveCount(0);
  await expect(page.getByText("دیگری")).toBeVisible();
});

test("a missing project says so instead of failing silently", async ({
  page,
}) => {
  await mockStudio(page);
  await page.goto("/studio/nope");

  await expect(page.getByText("این پروژه دیگه وجود نداره.")).toBeVisible();
});
