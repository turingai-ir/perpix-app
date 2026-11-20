import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate } from "@/shared/hooks";
import type { CaptionPreset } from "../model/preset";

interface PresetGalleryProps {
  system: readonly CaptionPreset[];
  mine: readonly CaptionPreset[];
  selectedUuid: string | null;
  onSelect: (preset: CaptionPreset) => void;
  pending: boolean;
  onRetry?: () => void;
}

export function PresetGallery({
  system,
  mine,
  selectedUuid,
  onSelect,
  pending,
  onRetry,
}: PresetGalleryProps) {
  const { t } = useAppTranslate();
  if (pending)
    return (
      <Skeleton
        className="h-14"
        aria-label={t("features.studio.styles.loading")}
      />
    );
  if (onRetry) {
    return (
      <div role="status" className="gap-group flex flex-wrap items-center">
        <p className="text-body">{t("features.studio.styles.loadError")}</p>
        <Button variant="outline" onClick={onRetry}>
          {t("features.studio.styles.retry")}
        </Button>
      </div>
    );
  }
  if (!system.length && !mine.length) {
    return (
      <p className="text-muted-foreground text-body">
        {t("features.studio.styles.empty")}
      </p>
    );
  }
  const groups = [
    { title: t("features.studio.styles.system"), presets: system },
    { title: t("features.studio.styles.mine"), presets: mine },
  ].filter((group) => group.presets.length);

  return (
    <div className="gap-block flex flex-col">
      {groups.map(({ title, presets }) => (
        <section key={title} aria-label={title} className="space-y-group">
          <h2 className="text-headline font-semibold">{title}</h2>
          <div className="gap-group flex flex-wrap">
            {presets.map((preset) => (
              <Button
                key={preset.uuid}
                type="button"
                variant={preset.uuid === selectedUuid ? "secondary" : "outline"}
                aria-pressed={preset.uuid === selectedUuid}
                className="h-auto min-w-0 whitespace-normal"
                onClick={() => onSelect(preset)}
              >
                <bdi className="min-w-0 wrap-anywhere">{preset.name}</bdi>
              </Button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
