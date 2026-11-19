import { useMemo } from "react";
import {
  normalizeTemplate,
  REFERENCE_TEMPLATES,
  type CaptionTemplate,
} from "@perpix/caption-renderer";
import { usePresets } from "../../styles/hooks/use-presets";

/**
 * The look the captions are drawn in. Until the user can choose (phase 4) it
 * is the first preset the admin offers, or the built-in classic look while
 * there is none or the list has not loaded.
 */
export function useCaptionTemplate(): CaptionTemplate {
  const presets = usePresets();
  const first = presets.data?.system.find((preset) => preset.is_active);
  return useMemo(
    () =>
      first
        ? normalizeTemplate(first.config)
        : REFERENCE_TEMPLATES.classic.template,
    [first],
  );
}
