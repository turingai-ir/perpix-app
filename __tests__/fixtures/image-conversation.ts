import { expect, test as base, type Route } from "@playwright/test";

export const compatibleModelUuid = "a509b349-d43f-4065-9cf2-de444bf4aa2c";
export const incompatibleModelUuid = "2d1fcf14-a655-47c5-af08-3fa450dc99cc";
export const taskUuid = "11111111-1111-4111-8111-111111111111";
export const generatedImageUuid = "22222222-2222-4222-8222-222222222222";

type MessageStatus = "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED";

export interface ConversationMessage {
  ai_model_config: Record<string, unknown>;
  ai_model_uuid: string;
  cost_usdmicro: number | null;
  message: string | null;
  role: "USER" | "ASSISTANT";
  task_status: MessageStatus;
  uuid: string;
}

interface MockTask {
  uuid: string;
  task_type: "IMAGE";
  expire_date: string;
  created_at: string;
  updated_at: string;
  messages: ConversationMessage[];
}

interface PendingGeneration {
  route: Route;
  requestBody: Record<string, unknown>;
}

interface ImageConversationApi {
  generateRequests: Record<string, unknown>[];
  setTaskMessages: (messages: ConversationMessage[]) => void;
  resolveGeneration: (messages: ConversationMessage[]) => Promise<void>;
  disconnectGeneration: () => Promise<void>;
}

function imageModel(supportsReferences: boolean) {
  const modelUuid = supportsReferences
    ? compatibleModelUuid
    : incompatibleModelUuid;
  const properties = {
    prompt: { type: "string", minLength: 3, maxLength: 3000 },
    aspect_ratio: {
      type: "string",
      enum: ["1:1", "16:9", "9:16"],
      default: "1:1",
    },
  };
  const modes: Record<string, unknown> = {
    text_to_image: {
      value: "text_to_image",
      provider_uuid: "provider-1",
      config_schema: {
        type: "object",
        required: ["prompt", "aspect_ratio"],
        additionalProperties: false,
        properties,
      },
    },
  };

  if (supportsReferences) {
    modes.image_to_image = {
      value: "image_to_image",
      provider_uuid: "provider-1",
      config_schema: {
        type: "object",
        required: ["prompt", "aspect_ratio", "reference_images"],
        additionalProperties: false,
        properties: {
          ...properties,
          reference_images: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: { type: "string" },
          },
        },
      },
    };
  }

  return {
    uuid: modelUuid,
    model_owner: supportsReferences ? "GOOGLE" : "OPEN_AI",
    name: supportsReferences ? "CONVERSATION_IMAGE" : "TEXT_ONLY_IMAGE",
    display_name: supportsReferences
      ? "Conversation image fixture"
      : "Text-only image fixture",
    description: "Fully mocked serial image conversation model",
    icon_url: null,
    tags: [],
    supported_inputs: supportsReferences ? ["TEXT", "IMAGE"] : ["TEXT"],
    supported_outputs: ["IMAGE"],
    min_cost: 1,
    max_cost: 1,
    modes,
    canonical_ui_schema: {
      elements: [
        {
          type: "Control",
          scope: "#/properties/prompt",
          label: "Prompt",
          options: { widget: "textarea" },
        },
        ...(supportsReferences
          ? [
              {
                type: "Control",
                scope: "#/properties/reference_images",
                label: "Reference images",
                options: { widget: "file-list" },
              },
            ]
          : []),
        {
          type: "Control",
          scope: "#/properties/aspect_ratio",
          label: "Aspect ratio",
          options: { widget: "select" },
        },
      ],
      selectors: supportsReferences
        ? [
            {
              field: "mod",
              label: "Mode",
              widget: "select",
              required: true,
              options: [
                { label: "Text to image", order: 1, value: "text_to_image" },
                { label: "Image to image", order: 2, value: "image_to_image" },
              ],
            },
          ]
        : [],
    },
  };
}

function makeTask(messages: ConversationMessage[]): MockTask {
  const now = "2026-09-14T12:00:00.000Z";
  return {
    uuid: taskUuid,
    task_type: "IMAGE",
    expire_date: "2026-09-15T12:00:00.000Z",
    created_at: now,
    updated_at: now,
    messages,
  };
}

export function conversationMessages({
  aspectRatio = "16:9",
  modelUuid = compatibleModelUuid,
  prompt,
  status = "SUCCESS",
}: {
  aspectRatio?: string;
  modelUuid?: string;
  prompt: string;
  status?: MessageStatus;
}): ConversationMessage[] {
  const config: Record<string, unknown> = {
    aspect_ratio: aspectRatio,
    mode: "text_to_image",
    prompt,
  };
  return [
    {
      ai_model_config: config,
      ai_model_uuid: modelUuid,
      cost_usdmicro: null,
      message: prompt,
      role: "USER",
      task_status: "SUCCESS",
      uuid: "user-message-1",
    },
    {
      ai_model_config:
        status === "SUCCESS"
          ? { ...config, images_generated: [generatedImageUuid] }
          : config,
      ai_model_uuid: modelUuid,
      cost_usdmicro: null,
      message: status === "FAILED" ? "MOCK_PROVIDER_FAILURE" : null,
      role: "ASSISTANT",
      task_status: status,
      uuid: "assistant-message-1",
    },
  ];
}

export const test = base.extend<{ imageConversationApi: ImageConversationApi }>(
  {
    imageConversationApi: async ({ baseURL, context }, fixtureUse) => {
      const models = [imageModel(true), imageModel(false)];
      const generateRequests: Record<string, unknown>[] = [];
      const forbiddenMutations: string[] = [];
      const pendingGenerations: PendingGeneration[] = [];
      let task = makeTask([]);

      await context.addCookies([
        { name: "access_token", value: "test-token", url: baseURL },
      ]);
      await context.addInitScript(() => {
        localStorage.clear();
        indexedDB.deleteDatabase("REACT_QUERY_OFFLINE_CACHE");
      });
      await context.routeWebSocket(/.*/, (socket) => socket.close());
      await context.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        const path = url.pathname.replace(/^\/api\/v1/, "");

        if (request.method() === "POST" && path === "/ai-task/generate") {
          const requestBody = request.postDataJSON() as Record<string, unknown>;
          generateRequests.push(requestBody);
          pendingGenerations.push({ route, requestBody });
          return;
        }

        if (
          request.method() === "POST" &&
          path === "/file-manager/files/presigned-urls"
        ) {
          const body = request.postDataJSON() as { file_uuids?: string[] };
          await route.fulfill({
            json: {
              files: (body.file_uuids ?? []).map((fileUuid) => ({
                file_uuid: fileUuid,
                preview_url:
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'/%3E",
                download_url: "data:text/plain,mocked-image",
              })),
            },
          });
          return;
        }

        if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
          forbiddenMutations.push(`${request.method()} ${path}`);
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
          [`/ai-task/${taskUuid}`]: task,
          "/file-manager/user-files": { files: [], has_next: false },
          "/ai-registry/models": models,
          ...Object.fromEntries(
            models.map((model) => [`/ai-registry/models/${model.uuid}`, model]),
          ),
        };
        if (request.method() === "GET" && Object.hasOwn(responses, path)) {
          await route.fulfill({ json: responses[path] });
          return;
        }

        const localAsset =
          url.origin === baseURL &&
          request.method() === "GET" &&
          ["document", "script", "stylesheet", "image", "font"].includes(
            request.resourceType(),
          ) &&
          !/^\/(api|ai-task|ai-registry|file-manager|user|wallet)(\/|$)/.test(
            url.pathname,
          );
        if (localAsset) {
          await route.continue();
          return;
        }
        await route.abort("blockedbyclient");
      });

      const nextPendingGeneration = () => {
        const pending = pendingGenerations.shift();
        expect(
          pending,
          "A mocked generate request must be pending",
        ).toBeDefined();
        return pending!;
      };
      await fixtureUse({
        generateRequests,
        setTaskMessages(messages) {
          task = makeTask(messages);
        },
        async resolveGeneration(messages) {
          task = makeTask(messages);
          await nextPendingGeneration().route.fulfill({ json: task });
        },
        async disconnectGeneration() {
          await nextPendingGeneration().route.abort("connectionreset");
        },
      });

      expect(
        forbiddenMutations,
        "Conversation tests must not upload or mutate wallet/API state",
      ).toEqual([]);
      for (const pending of pendingGenerations) {
        await pending.route.abort("blockedbyclient").catch(() => undefined);
      }
    },
  },
);

export { expect } from "@playwright/test";
