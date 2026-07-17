import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import {
  buildAjvResolver,
  buildDefaultValues,
  buildFieldMeta,
  getPrimaryType,
  type JsonConfigMeta,
  type JsonConfigSchema,
} from "../src/hooks/use-dynamic-config-form";

const klingVideoConfig = JSON.parse(
  readFileSync(
    new URL("./fixtures/kling-video-config-schema.json", import.meta.url),
    "utf8",
  ),
) as [
  { meta: JsonConfigMeta },
  { RUNWARE: { config_schema: JsonConfigSchema } },
];
const videoConfigMeta = klingVideoConfig[0].meta;
const videoConfigSchema = klingVideoConfig[1].RUNWARE.config_schema;

function buildVideoConfigResolver() {
  return buildAjvResolver(videoConfigSchema, undefined, {
    configMeta: videoConfigMeta,
  });
}

test("resolves nullable JSON Schema types consistently", () => {
  expect(getPrimaryType({ type: ["string", "null"] })).toBe("string");
  expect(getPrimaryType({ type: ["null", "integer"] })).toBe("integer");
  expect(getPrimaryType({ type: "boolean" })).toBe("boolean");
});

test("does not let hidden field defaults require motion-control references", async () => {
  const defaults = buildDefaultValues(videoConfigSchema);
  const resolver = buildVideoConfigResolver();

  const result = await resolver(
    {
      ...defaults,
      mode: "image_to_video",
      prompt: "Animate this image",
      frame_images: ["frame-image-id"],
    },
    {},
    {} as never,
  );

  expect(result.errors).toEqual({});
  expect(result.values).toMatchObject({
    mode: "image_to_video",
    prompt: "Animate this image",
    frame_images: ["frame-image-id"],
    duration: 5,
  });
  expect(result.values).not.toHaveProperty("reference_videos");
  expect(result.values).not.toHaveProperty("reference_images");
  expect(result.values).not.toHaveProperty("character_orientation");
});

test("keeps visible motion-control defaults and validates required references", async () => {
  const defaults = buildDefaultValues(videoConfigSchema);
  const resolver = buildVideoConfigResolver();

  const result = await resolver(
    {
      ...defaults,
      mode: "motion_control",
      prompt: "Match this motion",
    },
    {},
    {} as never,
  );

  expect(result.values).toEqual({});
  expect(result.errors).toMatchObject({
    reference_videos: { type: "required" },
    reference_images: { type: "required" },
  });
});

test("submits motion-control references when all visible requirements are met", async () => {
  const defaults = buildDefaultValues(videoConfigSchema);
  const resolver = buildVideoConfigResolver();

  const result = await resolver(
    {
      ...defaults,
      mode: "motion_control",
      prompt: "Match this motion",
      reference_videos: ["reference-video-id"],
      reference_images: ["reference-image-id"],
    },
    {},
    {} as never,
  );

  expect(result.errors).toEqual({});
  expect(result.values).toMatchObject({
    mode: "motion_control",
    prompt: "Match this motion",
    reference_videos: ["reference-video-id"],
    reference_images: ["reference-image-id"],
    character_orientation: "image",
  });
  expect(result.values).not.toHaveProperty("frame_images");
  expect(result.values).not.toHaveProperty("duration");
});

test("reads nested array field metadata from the standard detail UI schema", () => {
  const multiPromptItems = videoConfigSchema.properties.multi_prompt?.items;
  const promptProperty = multiPromptItems?.properties?.prompt;

  expect(promptProperty).toBeDefined();

  const fieldMeta = buildFieldMeta({
    name: "multi_prompt.0.prompt",
    prop: promptProperty!,
    requiredFields: multiPromptItems?.required ?? [],
    defaultValues: {},
    configMeta: videoConfigMeta,
  });

  expect(fieldMeta).toMatchObject({
    inputType: "textarea",
    title: "پرامپت بخش",
    hint: "برای هر segment حرکت، صحنه و صدای همان بخش را بنویسید.",
  });
});
