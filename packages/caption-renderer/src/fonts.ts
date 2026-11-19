import type { CaptionTemplate } from "./template";

/**
 * Waits until the template's font can be drawn. A canvas silently uses a fallback
 * for a font that has not loaded, so the first frame would be wrong.
 */
export const ensureCaptionFont = async (
  template: CaptionTemplate,
): Promise<void> => {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const { family, weight, italic } = template.base.font;
  try {
    await document.fonts.load(
      `${italic ? "italic " : ""}${weight} 48px "${family}"`,
      "آابپ Aa",
    );
  } catch {
    // A font that cannot load leaves the fallback; the caption still draws.
  }
};
