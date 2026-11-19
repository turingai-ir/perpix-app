import { readFileSync } from "node:fs";
import { type Page } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

const VIDEO = readFileSync("src/features/studio/_tests/clip.webm");
const FUTURE = () => new Date(Date.now() + 5 * 86_400_000).toISOString();
const NOW = () => new Date().toISOString();

export async function openEditor(
  page: Page,
  status: "COMPLETED" | "PROCESSING",
) {
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/me", (route) =>
    route.fulfill({
      json: {
        email: "t@example.com",
        phone_number: "+989123456789",
        name: null,
        is_verified: true,
        scopes: [],
        default_wallet_uuid: null,
        is_active: true,
        created_at: NOW(),
        updated_at: NOW(),
      },
    }),
  );
  for (const path of ["/api/v1/ai-task/events", "/api/v1/payment-events"]) {
    await page.route(`**${path}`, (route) =>
      route.fulfill({ contentType: "text/event-stream", body: "" }),
    );
  }
  const project = {
    revision: 1,
    document: {
      tracks: [
        {
          kind: "video",
          clips: [
            {
              id: "c1",
              file_uuid: "f1",
              name: "clip",
              duration_ms: 2000,
              source_in_ms: 0,
              source_out_ms: 2000,
            },
          ],
        },
      ],
    } as Record<string, unknown>,
  };
  const saves: Array<{ document: Record<string, unknown>; revision: number }> =
    [];
  await page.route("**/api/v1/studio/projects/p1", (route) => {
    if (route.request().method() === "PUT") {
      const body = route.request().postDataJSON() as (typeof saves)[number];
      saves.push(body);
      project.document = body.document;
      project.revision += 1;
    }
    return route.fulfill({
      json: {
        uuid: "p1",
        title: "پروژه",
        schema_version: 1,
        revision: project.revision,
        expire_at: FUTURE(),
        created_at: NOW(),
        updated_at: NOW(),
        document: project.document,
        files: [
          {
            file_uuid: "f1",
            role: "SOURCE",
            available: true,
            content_type: "video/webm",
            expire_at: FUTURE(),
          },
        ],
      },
    });
  });
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "f1",
            preview_url: "http://localhost:5173/__media/f1.webm",
            download_url: "http://localhost:5173/__media/f1.webm",
            expire_at: FUTURE(),
          },
        ],
      },
    }),
  );
  await page.route("**/__media/f1.webm", (route) =>
    route.fulfill({
      status: 200,
      contentType: "video/webm",
      headers: { "Accept-Ranges": "none" },
      body: VIDEO,
    }),
  );
  await page.route("**/api/v1/studio/transcripts**", (route) => {
    if (route.request().url().includes("/transcripts/t1")) {
      return route.fulfill({
        json: {
          uuid: "t1",
          file_uuid: "f1",
          status: "COMPLETED",
          language: "fa",
          duration_ms: 2000,
          failure_message: null,
          created_at: NOW(),
          expire_at: FUTURE(),
          text: "سلام دنیا",
          words: [
            { text: "سلام", start_ms: 200, end_ms: 900, speaker: null },
            { text: "دنیا", start_ms: 1000, end_ms: 1800, speaker: null },
          ],
        },
      });
    }
    return route.fulfill({
      json: {
        items: [
          {
            uuid: "t1",
            file_uuid: "f1",
            status,
            language: "fa",
            duration_ms: 2000,
            failure_message: null,
            created_at: NOW(),
            expire_at: FUTURE(),
          },
        ],
      },
    });
  });
  await page.route("**/api/v1/studio/caption-presets", (route) =>
    route.fulfill({ json: { system: [], mine: [], mine_limit: 0 } }),
  );
  await page.goto("/studio/p1/edit");
  return { saves };
}
