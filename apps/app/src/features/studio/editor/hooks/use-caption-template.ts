import { useMemo, useState } from "react";
import {
  normalizeTemplate,
  REFERENCE_TEMPLATES,
} from "@perpix/caption-renderer";
import { usePresets } from "../../styles/hooks/use-presets";
import {
  readCaptionStyle,
  type CaptionStyle,
} from "../../styles/model/caption-style";

export function useCaptionTemplate(
  document: Record<string, unknown> | undefined,
) {
  const [style, setStyle] = useState<CaptionStyle | null>();
  if (style === undefined && document) setStyle(readCaptionStyle(document));
  const presets = usePresets();
  const first = presets.data?.system.find((preset) => preset.is_active);
  const template = useMemo(
    () =>
      style?.config ??
      (first
        ? normalizeTemplate(first.config)
        : REFERENCE_TEMPLATES.classic.template),
    [style, first],
  );
  return { style, setStyle, template };
}
