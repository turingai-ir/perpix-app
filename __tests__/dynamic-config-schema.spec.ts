import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import {
  buildAjvResolver,
  buildDefaultValues,
  type JsonConfigSchema,
} from "../src/hooks/use-dynamic-config-form";

const videoConfigSchema = JSON.parse(
  readFileSync(
    new URL("./fixtures/kling-video-config-schema.json", import.meta.url),
    "utf8",
  ),
) as JsonConfigSchema;

test("does not let hidden field defaults require motion-control references", async () => {
  const defaults = buildDefaultValues(videoConfigSchema);
  const resolver = buildAjvResolver(videoConfigSchema);

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
  const resolver = buildAjvResolver(videoConfigSchema);

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
  const resolver = buildAjvResolver(videoConfigSchema);

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
