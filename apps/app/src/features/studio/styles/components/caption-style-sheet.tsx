import { useState } from "react";
import type { CaptionTemplate } from "@perpix/caption-renderer";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { BottomSheet } from "../../ui/bottom-sheet";
import { usePresets } from "../hooks/use-presets";
import { styleFromPreset, type CaptionStyle } from "../model/caption-style";
import { CaptionStyleControls } from "./caption-style-controls";
import { PersonalPresetForm } from "./personal-preset-form";
import { PresetGallery } from "./preset-gallery";
import { StyleSample } from "./style-sample";

interface CaptionStyleSheetProps {
  style: CaptionStyle | null | undefined;
  template: CaptionTemplate;
  onClose: () => void;
  onApply: (style: CaptionStyle) => void;
}

export function CaptionStyleSheet({
  style,
  template,
  onClose,
  onApply,
}: CaptionStyleSheetProps) {
  const { t } = useAppTranslate();
  const presets = usePresets();
  const [draft, setDraft] = useState<CaptionStyle>(
    () => style ?? { preset_uuid: null, config: template },
  );

  return (
    <BottomSheet
      open
      size="lg"
      title={t("features.studio.styles.appearance")}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="flex flex-col gap-section lg:grid lg:grid-cols-2">
        <div className="flex flex-col gap-block">
          <StyleSample template={draft.config} />
          <PresetGallery
            system={presets.data?.system ?? []}
            mine={presets.data?.mine ?? []}
            selectedUuid={draft.preset_uuid}
            onSelect={(preset) => setDraft(styleFromPreset(preset))}
            pending={presets.isPending}
            onRetry={
              presets.isError && !presets.data
                ? () => void presets.refetch()
                : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-block">
          <CaptionStyleControls
            template={draft.config}
            onChange={(config) =>
              setDraft((current) => ({ ...current, config }))
            }
          />
          <Button onClick={() => onApply(draft)}>
            {t("features.studio.styles.apply")}
          </Button>
          {presets.data && (
            <PersonalPresetForm
              template={draft.config}
              count={presets.data.mine.length}
              limit={presets.data.mine_limit}
            />
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
