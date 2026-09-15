import { expect, test as base } from "@playwright/test";

const providerUuid = "9a6d5ea1-5276-4d7c-b445-d2e4dc2b4ee5";
export const fullModelUuid = "a509b349-d43f-4065-9cf2-de444bf4aa2c";
export const limitedModelUuid = "2d1fcf14-a655-47c5-af08-3fa450dc99cc";

function imageModel(limited: boolean) {
  const properties = {
    prompt: { type: "string", minLength: 3, maxLength: 3000 },
    aspect_ratio: {
      type: "string",
      enum: ["1:1", "16:9", "9:16"],
      default: "1:1",
    },
    resolution: { type: "string", enum: ["1K", "2K"], default: "1K" },
    guidance_scale: { type: "number", minimum: 1, maximum: 20, default: 7 },
    ...(!limited && {
      negative_prompt: { type: "string", maxLength: 100, default: "" },
      num_inference_steps: {
        type: "integer",
        minimum: 1,
        maximum: 50,
        default: 20,
      },
    }),
  };
  const imageProperties = {
    ...properties,
    reference_images: {
      type: "array",
      default: [],
      maxItems: 4,
      items: { type: "string" },
      "x-file": { type: "list", accept: ["image/png", "image/jpeg"] },
    },
  };
  return {
    uuid: limited ? limitedModelUuid : fullModelUuid,
    model_owner: "GOOGLE",
    name: limited ? "IMAGE_SETTINGS_LIMITED" : "GOOGLE_NANO_BANANA_2_LITE",
    display_name: limited ? "Limited image fixture" : "Nano Banana 2 Lite",
    description: "Local image settings test fixture",
    icon_url: null,
    tags: [],
    supported_inputs: ["TEXT"],
    supported_outputs: ["IMAGE"],
    min_cost: 20_000,
    max_cost: 33_603,
    modes: {
      text_to_image: {
        value: "text_to_image",
        provider_uuid: providerUuid,
        config_schema: {
          type: "object",
          required: ["prompt", "aspect_ratio", "resolution", "guidance_scale"],
          additionalProperties: false,
          properties,
        },
      },
      image_to_image: {
        value: "image_to_image",
        provider_uuid: providerUuid,
        config_schema: {
          type: "object",
          required: [
            "prompt",
            "reference_images",
            "aspect_ratio",
            "resolution",
            "guidance_scale",
          ],
          additionalProperties: false,
          properties: imageProperties,
        },
      },
    },
    canonical_ui_schema: {
      selectors: [
        {
          label: "Mode",
          widget: "segmented",
          options: [
            { value: "text_to_image", label: "Text to image", order: 0 },
            { value: "image_to_image", label: "Image to image", order: 1 },
          ],
        },
      ],
      elements: Object.keys(properties).map((field) => ({
        type: "Control",
        scope: `#/properties/${field}`,
        label: field,
        ...(field === "prompt" && { options: { widget: "textarea" } }),
        ...(["aspect_ratio", "resolution"].includes(field) && {
          options: { widget: "select" },
        }),
      })),
    },
  };
}

export const test = base.extend<{ safeImageApi: void }>({
  safeImageApi: [
    async ({ context, baseURL }, runFixture) => {
      const mutations: string[] = [];
      const generationRequests: string[] = [];
      const models = [imageModel(false), imageModel(true)];
      await context.addCookies([
        { name: "access_token", value: "test-token", url: baseURL },
      ]);
      await context.addInitScript(() => {
        localStorage.clear();
        indexedDB.deleteDatabase("REACT_QUERY_OFFLINE_CACHE");
      });
      // Block WebSockets too; Vite HMR is unnecessary for an isolated test run.
      await context.routeWebSocket(/.*/, (socket) => socket.close());
      await context.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        const path = url.pathname.replace(/^\/api\/v1/, "");
        if (/\/generate(?:\/|$)/.test(path)) {
          generationRequests.push(request.url());
          await route.abort("blockedbyclient");
          return;
        }
        if (
          request.method() === "POST" &&
          path === "/file-manager/files/presigned-urls"
        ) {
          await route.fulfill({
            json: {
              files: [
                {
                  file_uuid: "11111111-1111-4111-8111-111111111111",
                  preview_url:
                    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
                  download_url:
                    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
                },
              ],
            },
          });
          return;
        }
        if (
          request.method() === "GET" &&
          path === `/ai-registry/models/${limitedModelUuid}`
        ) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          await route.fulfill({ json: models[1] });
          return;
        }
        if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
          mutations.push(`${request.method()} ${request.url()}`);
          await route.abort("blockedbyclient");
          return;
        }
        if (request.method() === "GET" && path === "/ai-task/events") {
          await route.fulfill({
            contentType: "text/event-stream",
            body: "retry: 600000\n\n",
          });
          return;
        }
        const responses: Record<string, unknown> = {
          "/user/get-info": { uuid: "user-1", mobile: "09120000000" },
          "/user/subscription/active": {
            uuid: "subscription-1",
            plan: {
              uuid: "plan-1",
              name: "pro",
              display_name: "Pro",
              scopes: ["ai_task:write"],
              allowed_models: models.map((model) => model.name),
              meta: {},
            },
          },
          "/user/subscription/plans": [],
          "/wallet/wallet": {
            wallet_uuid: "wallet-1",
            balance_usdmicro: 1_000_000,
          },
          "/ai-task/list": { items: [], has_next: false },
          "/file-manager/user-files": {
            files: [
              {
                uuid: "11111111-1111-4111-8111-111111111111",
                file_name: "reference-test.png",
                file_size: 2048,
                content_type: "image/png",
                is_public: true,
              },
            ],
            has_next: false,
          },
          "/ai-registry/models": models,
          ...Object.fromEntries(
            models.map((model) => [`/ai-registry/models/${model.uuid}`, model]),
          ),
        };
        if (request.method() === "GET" && Object.hasOwn(responses, path)) {
          await route.fulfill({ json: responses[path] });
          return;
        }
        // Only local app documents/assets can reach a server. Never pass through
        // fetch/XHR, unknown API reads, third-party assets or mutation requests.
        const localAsset =
          url.origin === baseURL &&
          ["document", "script", "stylesheet", "image", "font"].includes(
            request.resourceType(),
          ) &&
          !/^\/(api|ai-task|ai-registry|user|wallet)(\/|$)/.test(url.pathname);
        if (localAsset && request.method() === "GET") {
          await route.continue();
          return;
        }
        await route.abort("blockedbyclient");
      });
      try {
        await runFixture();
      } finally {
        expect(
          generationRequests,
          "No image/video generation may be attempted",
        ).toEqual([]);
        expect(mutations, "Settings must not issue API mutations").toEqual([]);
      }
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
