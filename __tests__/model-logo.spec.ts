import { expect, test } from "@playwright/test";

import { getModelLogo } from "../src/pages/(app)/generation/_utils/model-logo";

const providerCases = [
  ["OPENAI_GPT_IMAGE_2_5_SUNBURST", "openai"],
  ["GPT_IMAGE_2_5_FLARE", "openai"],
  ["GOOGLE_NANO_BANANA", "google"],
  ["BLACK_FOREST_LABS_FLUX", "bfl"],
  ["IDEOGRAM_V3", "ideogram"],
  ["RECRAFT_V3", "recraft"],
  ["SEEDREAM_4", "bytedance"],
  ["WAN_2_2", "alibaba"],
  ["Z_IMAGE_TURBO", "alibaba"],
  ["KLING_O1", "kuaishou"],
  ["GROK_IMAGINE", "xai"],
  ["SEEDANCE_1_0", "bytedance"],
  ["ALEPH", "runway"],
] as const;

for (const [name, provider] of providerCases) {
  test(`${name} resolves to ${provider}`, () => {
    expect(getModelLogo(name)?.id).toBe(provider);
  });
}

test("uses the display name when the model identifier is opaque", () => {
  expect(getModelLogo("video-123", "Runway Aleph")?.id).toBe("runway");
});

test("keeps unknown models available for their backend icon fallback", () => {
  expect(getModelLogo("SOUL_CINEMA")).toBeUndefined();
});
