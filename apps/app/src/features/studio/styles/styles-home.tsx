import { useMemo, useState, type FC } from "react";

import { useAppTranslate } from "@/shared/hooks";
import { StudioScreen } from "../shell/studio-screen";
import { PresetGallery } from "./components/preset-gallery";
import { StyleSample } from "./components/style-sample";
import { usePresets } from "./hooks/use-presets";
import { styleFromPreset } from "./model/caption-style";

export const StylesHome: FC = () => {
  const { t } = useAppTranslate();
  const presets = usePresets();
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const { system = [], mine = [], mine_limit } = presets.data ?? {};
  const selected =
    [...system, ...mine].find((preset) => preset.uuid === selectedUuid) ??
    system[0] ??
    mine[0];
  const template = useMemo(
    () => selected && styleFromPreset(selected).config,
    [selected],
  );

  return (
    <StudioScreen
      title={t("features.studio.styles.title")}
      className="flex flex-col gap-section"
    >
      {template && <StyleSample template={template} />}
      <PresetGallery
        system={system}
        mine={mine}
        selectedUuid={selected?.uuid ?? null}
        onSelect={(preset) => setSelectedUuid(preset.uuid)}
        pending={presets.isPending}
        onRetry={
          presets.isError && !presets.data
            ? () => void presets.refetch()
            : undefined
        }
      />
      {mine_limit !== undefined && (
        <p className="text-footnote text-muted-foreground">
          {t("features.studio.styles.quota", {
            count: mine.length.toLocaleString("fa-IR"),
            limit: mine_limit.toLocaleString("fa-IR"),
          })}
        </p>
      )}
    </StudioScreen>
  );
};
