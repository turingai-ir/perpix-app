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

test("accepts each mode's duration when mode schemas have different constraints", async () => {
  const makeMode = (value: string, duration: number) => ({
    value,
    config_schema: {
      type: "object" as const,
      properties: {
        duration: {
          type: "integer" as const,
          enum: [duration],
          const: duration,
          default: duration,
        },
      },
      required: ["duration"],
      additionalProperties: false,
    },
  });
  const config = getModelDynamicConfig({
    modes: {
      text_to_video: makeMode("text_to_video", 5),
      image_to_video: makeMode("image_to_video", 10),
    },
  });
  const resolver = buildAjvResolver(config.configSchema!);

  for (const [mode, duration] of [
    ["text_to_video", 5],
    ["image_to_video", 10],
  ] as const) {
    const result = await resolver({ mode, duration }, {}, {} as never);
    expect(result.errors, `${mode} should accept ${duration}s`).toEqual({});
    expect(result.values).toMatchObject({ mode, duration });
  }
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
    "../../perpix-core-api/tests/fixtures/ai_gateway/model_configs/",
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
    const providerModes = isRecord(firstProvider)
      ? firstProvider.modes
      : undefined;

    const normalizedModel = {
      ...rawModel,
      modes: isRecord(rawModel.modes) ? rawModel.modes : (providerModes ?? {}),
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

    const resolver = buildAjvResolver(dynamicConfig.configSchema!, undefined, {
      configMeta: dynamicConfig.configMeta,
    });

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

test("Seedance keeps duration constraints and pricing-only visibility within the active mode", async () => {
  const model: unknown = JSON.parse(
    readFileSync(
      new URL("./fixtures/seedance-video-config.json", import.meta.url),
      "utf8",
    ),
  );
  const { configSchema, configMeta } = getModelDynamicConfig(model);
  if (!configSchema) throw new Error("Expected Seedance schema");
  const resolver = buildAjvResolver(configSchema, undefined, { configMeta });
  for (const duration of [4, 5, 12, 30]) {
    const result = await resolver(
      {
        mode: "text_to_video",
        prompt: "A bird flying",
        duration,
        resolution: "720p",
        aspect_ratio: "16:9",
      },
      {},
      {} as never,
    );
    expect(result.errors).toEqual({});
    expect(result.values).toMatchObject({ duration });
  }
  const result = await resolver(
    {
      mode: "video_edit",
      prompt: "Change the lighting",
      input_video: "https://example.com/video.mp4",
      duration: 5,
      resolution: "720p",
    },
    {},
    {} as never,
  );
  expect(result.errors).toEqual({});
  expect(result.values).toMatchObject({ duration: 30 });
  for (const mode of [
    "text_to_video",
    "video_edit",
    "image_to_video",
    "audio_driven_video",
    "reference_to_video",
    "video_extend",
    "text_to_video",
  ]) {
    const meta = buildFieldMeta({
      name: "duration",
      prop: configSchema.properties.duration,
      requiredFields: [],
      defaultValues: {},
      configSchema,
      configMeta,
      values: { mode },
    });
    expect(meta.inputType).toBe(mode === "video_edit" ? "hidden" : "select");
    expect(meta.property.const).toBe(mode === "video_edit" ? 30 : undefined);
  }
});

test("Seedance image-to-video does not require an optional reference audio", async () => {
  const model: unknown = JSON.parse(
    readFileSync(
      new URL("./fixtures/seedance-video-config.json", import.meta.url),
      "utf8",
    ),
  );
  const { configSchema, configMeta } = getModelDynamicConfig(model);
  if (!configSchema) throw new Error("Expected Seedance schema");
  const resolver = buildAjvResolver(configSchema, undefined, { configMeta });
  const imageValues = {
    ...buildDefaultValues(configSchema, { mode: "image_to_video" }),
    mode: "image_to_video",
    frame_images: ["frame-id"],
  };

  const withoutAudio = await resolver(imageValues, {}, {} as never);
  expect(withoutAudio.errors).toEqual({});
  expect(withoutAudio.values.reference_audios).toBeUndefined();

  const withAudio = await resolver(
    { ...imageValues, reference_audios: ["audio-id"] },
    {},
    {} as never,
  );
  expect(withAudio.errors).toEqual({});
  expect(withAudio.values.reference_audios).toEqual(["audio-id"]);

  const audioDrivenWithoutAudio = await resolver(
    { ...imageValues, mode: "audio_driven_video", frame_images: undefined },
    {},
    {} as never,
  );
  expect(audioDrivenWithoutAudio.errors.reference_audios).toBeDefined();
});

test("Seedance reference-to-video requires a reference but not incompatible defaults", async () => {
  const model: unknown = JSON.parse(
    readFileSync(
      new URL("./fixtures/seedance-video-config.json", import.meta.url),
      "utf8",
    ),
  );
  const { configSchema, configMeta } = getModelDynamicConfig(model);
  if (!configSchema) throw new Error("Expected Seedance schema");
  const resolver = buildAjvResolver(configSchema, undefined, { configMeta });
  const defaults = {
    ...buildDefaultValues(configSchema, { mode: "reference_to_video" }),
    mode: "reference_to_video",
  };

  const noReference = await resolver(defaults, {}, {} as never);
  expect(noReference.errors.root).toBeDefined();

  for (const reference of [
    { reference_images: ["image-id"] },
    { reference_videos: ["video-id"] },
    { input_video: "video-id" },
  ]) {
    const result = await resolver({ ...defaults, ...reference }, {}, {} as never);
    expect(result.errors, JSON.stringify(reference)).toEqual({});
    expect(result.values).toMatchObject(reference);
    if ("input_video" in reference) {
      expect(result.values.aspect_ratio).toBeUndefined();
    }
  }
});

test("wrapped Kling modes retain their conditional validation and defaults", async () => {
  const modes = Object.fromEntries(
    ["text_to_video", "image_to_video", "motion_control"].map((mode) => [
      mode,
      { value: mode, config_schema: videoConfigSchema },
    ]),
  );
  const { configSchema, configMeta } = getModelDynamicConfig({ modes });
  if (!configSchema) throw new Error("Expected Kling schema");
  const resolver = buildAjvResolver(configSchema, undefined, { configMeta });
  const defaults = buildDefaultValues(configSchema);

  for (const [mode, inputs] of [
    ["text_to_video", { prompt: "A flying bird" }],
    [
      "image_to_video",
      { prompt: "Animate this image", frame_images: ["image-id"] },
    ],
    [
      "motion_control",
      { reference_videos: ["video-id"], reference_images: ["image-id"] },
    ],
  ] as const) {
    const result = await resolver(
      { ...defaults, mode, ...inputs },
      {},
      {} as never,
    );
    expect(result.errors, mode).toEqual({});
    expect(result.values).toMatchObject({ mode, ...inputs });
    if (mode === "motion_control") {
      expect(result.values.character_orientation).toBe("image");
      expect(result.values.resolution).toBeUndefined();
      expect(result.values.aspect_ratio).toBeUndefined();
    }
  }
});

test("Seedance modes accept only their real required media without extra references", async () => {
  const model: unknown = JSON.parse(
    readFileSync(
      new URL("./fixtures/seedance-video-config.json", import.meta.url),
      "utf8",
    ),
  );
  const { configSchema, configMeta } = getModelDynamicConfig(model);
  if (!configSchema) throw new Error("Expected Seedance schema");
  const resolver = buildAjvResolver(configSchema, undefined, { configMeta });

  for (const { mode, requiredInput } of [
    { mode: "text_to_video", requiredInput: { prompt: "A flying bird" } },
    { mode: "image_to_video", requiredInput: { frame_images: ["image-id"] } },
    { mode: "video_edit", requiredInput: { input_video: "video-id" } },
    {
      mode: "reference_to_video",
      requiredInput: { reference_images: ["image-id"] },
    },
    { mode: "video_extend", requiredInput: { input_video: "video-id" } },
    {
      mode: "audio_driven_video",
      requiredInput: { reference_audios: ["audio-id"] },
    },
  ]) {
    const defaults = { ...buildDefaultValues(configSchema, { mode }), mode };
    const invalid = await resolver(defaults, {}, {} as never);
    expect(Object.keys(invalid.errors).length, mode).toBeGreaterThan(0);

    const valid = await resolver(
      { ...defaults, ...requiredInput },
      {},
      {} as never,
    );
    expect(valid.errors, mode).toEqual({});
    expect(valid.values).toMatchObject({ mode, ...requiredInput });
  }
});

test("mode-level exclusions remain effective without hiding valid optional inputs", async () => {
  const { configSchema } = getModelDynamicConfig({
    modes: {
      text_to_video: {
        value: "text_to_video",
        config_schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            prompt: { type: "string" },
            reference_images: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
            },
          },
          required: ["prompt"],
          not: { required: ["prompt", "reference_images"] },
        },
      },
    },
  });
  if (!configSchema) throw new Error("Expected schema with exclusion");
  const resolver = buildAjvResolver(configSchema);

  const withoutReference = await resolver(
    { mode: "text_to_video", prompt: "A flying bird" },
    {},
    {} as never,
  );
  expect(withoutReference.errors).toEqual({});

  const withForbiddenReference = await resolver(
    {
      mode: "text_to_video",
      prompt: "A flying bird",
      reference_images: ["image-id"],
    },
    {},
    {} as never,
  );
  expect(withForbiddenReference.errors.root).toBeDefined();
});
