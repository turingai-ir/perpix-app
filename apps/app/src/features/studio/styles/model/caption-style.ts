import {
  normalizeTemplate,
  type CaptionTemplate,
} from "@perpix/caption-renderer";
import { z } from "zod";
import type { CaptionPreset } from "./preset";

export interface CaptionStyle {
  preset_uuid: string | null;
  config: CaptionTemplate;
}

const snapshotSchema = z.object({
  preset_uuid: z.string().nullable().catch(null),
  config: z.record(z.string(), z.unknown()),
});

export const styleFromPreset = (preset: CaptionPreset): CaptionStyle => ({
  preset_uuid: preset.uuid,
  config: normalizeTemplate(preset.config),
});

export function readCaptionStyle(
  document: Record<string, unknown>,
): CaptionStyle | null {
  const result = snapshotSchema.safeParse(document.caption_style);
  if (!result.success) return null;
  return {
    preset_uuid: result.data.preset_uuid,
    config: normalizeTemplate(result.data.config),
  };
}

export function withBaseColor(
  template: CaptionTemplate,
  color: string,
): CaptionTemplate {
  return {
    ...template,
    base: {
      ...template.base,
      fill: {
        ...template.base.fill,
        color,
        gradient: { ...template.base.fill.gradient, enabled: false },
        palette: [],
      },
    },
  };
}
