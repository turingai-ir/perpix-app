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
import { getModelDynamicConfig } from "../src/pages/(app)/generation/_utils/model-dynamic-config";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

test("recompiles an updated schema without colliding on its stable id", async () => {
  const initialSchema: JsonConfigSchema = {
    $id: "stable-model-config",
    type: "object",
    properties: { prompt: { type: "string", minLength: 3 } },
    required: ["prompt"],
    additionalProperties: false,
  };
  const updatedSchema: JsonConfigSchema = {
    $id: "stable-model-config",
    type: "object",
    properties: { prompt: { type: "string", minLength: 10 } },
    required: ["prompt"],
    additionalProperties: false,
  };
  const initialResolver = buildAjvResolver(initialSchema, undefined, {
    cacheKey: initialSchema.$id,
  });
  const updatedResolver = buildAjvResolver(updatedSchema, undefined, {
    cacheKey: updatedSchema.$id,
  });

  const initiallyValidResult = await initialResolver(
    { prompt: "short" },
    {},
    {} as never,
  );
  const updatedInvalidResult = await updatedResolver(
    { prompt: "short" },
    {},
    {} as never,
  );

  expect(initiallyValidResult.errors).toEqual({});
  expect(updatedInvalidResult.errors.prompt).toMatchObject({
    type: "minLength",
  });
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

test("validates multi-mode schema using default resolution and aspect_ratio values", async () => {
  const openAiModel = {
    uuid: "c469ae94-c0b8-4fdd-b07d-475cfffc0b41",
    name: "OPENAI_GPT_IMAGE_2",
    modes: {
      text_to_image: {
        value: "text_to_image",
        config_schema: {
          $id: "OPENAI_GPT_IMAGE_2_RUNWARE_TEXT_TO_IMAGE",
          type: "object",
          properties: {
            prompt: { type: "string", minLength: 3, maxLength: 3000 },
            resolution: {
              type: "string",
              enum: ["1024px", "2048px"],
              default: "1024px",
            },
            aspect_ratio: {
              type: "string",
              enum: ["1:1", "16:9"],
              default: "1:1",
            },
          },
          required: ["resolution", "aspect_ratio", "prompt"],
          additionalProperties: false,
        },
      },
    },
    canonical_ui_schema: {
      selectors: [
        {
          field: "mode",
          options: [{ value: "text_to_image" }],
        },
      ],
    },
  };

  const dynamicConfig = getModelDynamicConfig(openAiModel);
  expect(dynamicConfig.configSchema).not.toBeNull();

  const defaults = buildDefaultValues(
    dynamicConfig.configSchema!,
    dynamicConfig.configDefaults,
  );
  expect(defaults).toMatchObject({
    mode: "text_to_image",
    resolution: "1024px",
    aspect_ratio: "1:1",
  });

  const resolver = buildAjvResolver(dynamicConfig.configSchema!, undefined, {
    configMeta: dynamicConfig.configMeta,
  });

  const result = await resolver(
    {
      ...defaults,
      prompt: "A beautiful sunset over mountains",
    },
    {},
    {} as never,
  );

  expect(result.errors).toEqual({});
  expect(result.values).toMatchObject({
    mode: "text_to_image",
    prompt: "A beautiful sunset over mountains",
    resolution: "1024px",
    aspect_ratio: "1:1",
  });
});

test("validates all 10 real backend model fixtures from perpix-core-api", async () => {
  const fixturesDir = new URL(
    "../../perpix-core-api/tests/fixtures/",
    import.meta.url,
  );
  const fixtureFiles = [
    "BLACK_FOREST_LABS_FLUX_1_1_PRO_ULTRA.json",
    "BYTEDANCE_SEEDANCE_2_0.json",
    "GOOGLE_GEMINI_OMNI_FLASH.json",
    "GOOGLE_NANO_BANANA_2.json",
    "GOOGLE_NANO_BANANA_2_LITE.json",
    "GOOGLE_VEO_3_1_FAST.json",
    "IDEOGRAM_4_0.json",
    "KLINGAI_VIDEO_3_0_STANDARD.json",
    "OPENAI_IMAGE_2.json",
    "RUNWAY_ALEPH_2_0.json",
  ];

  for (const fileName of fixtureFiles) {
    const filePath = new URL(fileName, fixturesDir);
    const modelData = JSON.parse(readFileSync(filePath, "utf8"));

    const rawModel = isRecord(modelData.model) ? modelData.model : modelData;
    const firstProvider = isRecord(modelData.providers)
      ? Object.values(modelData.providers)[0]
      : undefined;
    const providerModes = isRecord(firstProvider) ? firstProvider.modes : undefined;

    const normalizedModel = {
      ...rawModel,
      modes: isRecord(rawModel.modes) ? rawModel.modes : providerModes ?? {},
    };

    const dynamicConfig = getModelDynamicConfig(normalizedModel);

    expect(
      dynamicConfig.configSchema,
      `Failed to generate configSchema for ${fileName}`,
    ).not.toBeNull();

    const defaults = buildDefaultValues(
      dynamicConfig.configSchema!,
      dynamicConfig.configDefaults,
    );

    const resolver = buildAjvResolver(
      dynamicConfig.configSchema!,
      undefined,
      {
        configMeta: dynamicConfig.configMeta,
      },
    );

    const testPrompt = "A futuristic city with flying vehicles";
    const valuesToValidate: Record<string, unknown> = {
      ...defaults,
      prompt: testPrompt,
    };

    const activeMode = String(defaults.mode);
    const activeModeConfig = modelData.modes?.[activeMode]?.config_schema;
    if (activeModeConfig?.required?.includes("reference_images")) {
      valuesToValidate.reference_images = ["test-ref-image-id"];
    }
    if (activeModeConfig?.required?.includes("reference_videos")) {
      valuesToValidate.reference_videos = ["test-ref-video-id"];
    }
    if (activeModeConfig?.required?.includes("frame_images")) {
      valuesToValidate.frame_images = ["test-frame-image-id"];
    }

    const result = await resolver(valuesToValidate, {}, {} as never);

    expect(
      result.errors,
      `Validation errors for model ${fileName} in mode ${activeMode}: ${JSON.stringify(result.errors, null, 2)}`,
    ).toEqual({});
  }
});


