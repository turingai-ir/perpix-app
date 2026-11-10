import { expect, test } from "@playwright/test";

import {
  buildRetryConfig,
  mergeRequestConfig,
  resolveRequest,
} from "../model/retry-config";

const model = {
  modes: {
    text_to_image: {
      value: "text_to_image",
      config_schema: {
        type: "object",
        required: ["prompt"],
        properties: {
          prompt: { type: "string" },
          aspect_ratio: {
            type: "string",
            enum: ["1:1", "3:2"],
            default: "1:1",
          },
        },
      },
    },
  },
};

test("retry config drops server output fields and unknown keys", () => {
  const config = buildRetryConfig(
    {
      mode: "text_to_image",
      prompt: "a cat",
      aspect_ratio: "3:2",
      images_generated: ["https://cdn/x.png"],
      server_only: true,
    },
    model,
  );

  expect(config).toEqual({
    mode: "text_to_image",
    prompt: "a cat",
    aspect_ratio: "3:2",
  });
});

test("retry config without a model schema still drops output fields", () => {
  expect(
    buildRetryConfig({ prompt: "a", videos_generated: ["v"] }, undefined),
  ).toEqual({ prompt: "a" });
});

const multiModeModel = {
  modes: {
    text_to_image: model.modes.text_to_image,
    image_to_image: {
      value: "image_to_image",
      config_schema: {
        type: "object",
        required: ["prompt", "reference_images"],
        properties: {
          prompt: { type: "string" },
          reference_images: {
            type: "array",
            minItems: 1,
            items: { type: "string" },
          },
          aspect_ratio: {
            type: "string",
            enum: ["1:1", "3:2"],
            default: "1:1",
          },
        },
      },
    },
  },
};

test("retry keeps reference images and their mode", () => {
  expect(
    buildRetryConfig(
      {
        mode: "image_to_image",
        prompt: "a cat",
        reference_images: ["file-1"],
        aspect_ratio: "3:2",
      },
      multiModeModel,
    ),
  ).toEqual({
    mode: "image_to_image",
    prompt: "a cat",
    reference_images: ["file-1"],
    aspect_ratio: "3:2",
  });
});

test("retry infers the mode that accepts the stored references", () => {
  expect(
    buildRetryConfig(
      { prompt: "a cat", reference_images: ["file-1"] },
      multiModeModel,
    ),
  ).toMatchObject({ mode: "image_to_image", reference_images: ["file-1"] });
});

test("request config merges the user request into the failed reply", () => {
  expect(
    mergeRequestConfig(
      { prompt: "a cat", images_generated: [] },
      { prompt: "a cat", reference_images: ["file-1"], aspect_ratio: "3:2" },
    ),
  ).toEqual({
    prompt: "a cat",
    reference_images: ["file-1"],
    aspect_ratio: "3:2",
  });
});

test("request config keeps assistant inputs the request lacks", () => {
  expect(
    mergeRequestConfig(
      { prompt: "a cat", reference_images: ["file-1"] },
      { prompt: "a cat", reference_images: [] },
    ),
  ).toEqual({ prompt: "a cat", reference_images: ["file-1"] });
});

const turn = (
  uuid: string,
  role: "USER" | "ASSISTANT",
  ai_model_config: Record<string, unknown>,
  ai_model_uuid: string | null = null,
) => ({ uuid, role, ai_model_config, ai_model_uuid });

test("a request resolves from its USER message with the reply's inputs", () => {
  const messages = [
    turn("u1", "USER", { prompt: "first" }, "m1"),
    turn("a1", "ASSISTANT", { prompt: "first", reference_images: ["r1"] }),
    turn("u2", "USER", { prompt: "second" }),
    turn("a2", "ASSISTANT", { prompt: "second" }, "m2"),
  ];

  expect(resolveRequest(messages, messages[0])).toEqual({
    config: { prompt: "first", reference_images: ["r1"] },
    modelUuid: "m1",
  });
  expect(resolveRequest(messages, messages[2]).modelUuid).toBe("m2");
  expect(resolveRequest(messages, messages[3]).config).toEqual({
    prompt: "second",
  });
});

test("mode inference ignores server-added keys like the backend does", () => {
  // Stored canonical configs have no `mode` and carry `include_cost`.
  expect(
    buildRetryConfig(
      {
        prompt: "a cat",
        reference_images: ["file-1"],
        aspect_ratio: "1:1",
        include_cost: true,
      },
      multiModeModel,
    ),
  ).toEqual({
    mode: "image_to_image",
    prompt: "a cat",
    reference_images: ["file-1"],
    aspect_ratio: "1:1",
  });
});

test("mode inference skips modes whose required inputs are missing", () => {
  expect(
    buildRetryConfig({ prompt: "a cat", aspect_ratio: "3:2" }, multiModeModel),
  ).toMatchObject({ mode: "text_to_image", prompt: "a cat" });
});
