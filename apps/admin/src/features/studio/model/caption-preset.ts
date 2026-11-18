import type { components } from "@/services/api/api";

export type CaptionPreset = components["schemas"]["CaptionPresetResponse"];
export type SaveCaptionPresetBody =
  components["schemas"]["SaveAdminCaptionPresetRequest"];

/** The backend refuses more; the form stops it first. */
export const MAX_PRESET_NAME_LENGTH = 64;
export const MAX_PRESET_CONFIG_BYTES = 64 * 1024;
export const MAX_SORT_ORDER = 10_000;

export type ConfigParse =
  | { ok: true; value: Record<string, unknown>; bytes: number }
  | {
      ok: false;
      reason: "invalid_json" | "not_object" | "too_large";
      bytes: number;
    };

const sizeInBytes = (value: unknown) =>
  new TextEncoder().encode(JSON.stringify(value)).length;

/**
 * The caption's look is the frontend's own JSON, which the backend only keeps,
 * so all that can be checked here is that it is an object that fits. The size
 * is counted the way the backend counts it: compact JSON in UTF-8.
 */
export const parseConfigText = (text: string): ConfigParse => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: "invalid_json", bytes: 0 };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, reason: "not_object", bytes: 0 };
  }
  const bytes = sizeInBytes(parsed);
  if (bytes > MAX_PRESET_CONFIG_BYTES) {
    return { ok: false, reason: "too_large", bytes };
  }
  return { ok: true, value: parsed as Record<string, unknown>, bytes };
};

/** The text of a config as the form edits it. */
export const formatConfig = (config: Readonly<Record<string, unknown>>) =>
  JSON.stringify(config, null, 2);

const wholeNumber = (text: string): number | null =>
  /^\d+$/.test(text.trim()) ? Number(text) : null;

/** A whole number from 0 to the maximum, or null when the text is not one. */
export const parseSortOrder = (text: string): number | null => {
  const value = wholeNumber(text);
  return value !== null && value <= MAX_SORT_ORDER ? value : null;
};

/** A whole number from 1, or null when the text is not one. */
export const parseSchemaVersion = (text: string): number | null => {
  const value = wholeNumber(text);
  return value !== null && value >= 1 ? value : null;
};
