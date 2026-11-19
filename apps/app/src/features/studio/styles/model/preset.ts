import { z } from "zod";

export const presetSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  config: z.record(z.string(), z.unknown()),
  schema_version: z.number(),
  is_active: z.boolean(),
  sort_order: z.number(),
});
export type CaptionPreset = z.infer<typeof presetSchema>;

export const presetsSchema = z.object({
  system: z.array(presetSchema),
  mine: z.array(presetSchema),
  mine_limit: z.number(),
});
