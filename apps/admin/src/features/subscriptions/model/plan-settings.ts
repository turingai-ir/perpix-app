import type { components } from "@/services/api/api";

export type PlanSettings = components["schemas"]["PlanSettings"];

/** What a plan's settings look like when read from the list, which types them loosely. */
export type PlanSettingsInput = Readonly<Record<string, unknown>> | undefined;

/** The backend rejects a bigger caption preset limit; the form stops it first. */
export const MAX_CAPTION_PRESET_LIMIT = 100;

/** The two scopes that let a user into the studio; a plan needs both. */
export const STUDIO_SCOPES: readonly string[] = ["studio:read", "studio:write"];

export const parseScopes = (text: string): string[] =>
  text
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

export const hasStudioScopes = (scopes: readonly string[]): boolean =>
  STUDIO_SCOPES.every((scope) => scopes.includes(scope));

/** The scopes with both studio scopes added or removed; every other scope is kept as it was. */
export const withStudioScopes = (
  scopes: readonly string[],
  enabled: boolean,
): string[] =>
  enabled
    ? [...scopes, ...STUDIO_SCOPES.filter((scope) => !scopes.includes(scope))]
    : scopes.filter((scope) => !STUDIO_SCOPES.includes(scope));

/**
 * The list endpoint types a plan's settings loosely, so the studio section is
 * read defensively; a plan saved before the setting existed has none, meaning 0.
 */
export const readCaptionPresetLimit = (settings: PlanSettingsInput): number => {
  const studio = settings?.studio;
  if (typeof studio !== "object" || studio === null) return 0;
  const limit = (studio as { caption_preset_limit?: unknown })
    .caption_preset_limit;
  return typeof limit === "number" ? limit : 0;
};

/** A whole number from 0 to the maximum, or null when the text is not one. */
export const parseCaptionPresetLimit = (text: string): number | null => {
  if (!/^\d+$/.test(text.trim())) return null;
  const limit = Number(text);
  return limit <= MAX_CAPTION_PRESET_LIMIT ? limit : null;
};

/**
 * The settings sent to the backend, which replaces the whole object. The
 * sections of the plan being edited are carried over and only the studio one
 * is replaced, so a section this form does not know yet is never erased by
 * saving it.
 */
export const toPlanSettings = (
  existing: PlanSettingsInput,
  studio: { captionPresetLimit: number },
): PlanSettings => ({
  ...existing,
  studio: { caption_preset_limit: studio.captionPresetLimit },
});
