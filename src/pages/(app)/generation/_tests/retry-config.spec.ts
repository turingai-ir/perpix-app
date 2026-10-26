import { expect, test } from "@playwright/test";

import { buildRetryConfig } from "../_utils/retry-config";

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
