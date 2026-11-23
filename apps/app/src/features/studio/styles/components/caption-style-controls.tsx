import { ANCHORS, type CaptionTemplate } from "@perpix/caption-renderer";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAppTranslate } from "@/shared/hooks";
import { withBaseColor } from "../model/caption-style";

export function CaptionStyleControls({
  template,
  onChange,
}: {
  template: CaptionTemplate;
  onChange: (template: CaptionTemplate) => void;
}) {
  const { t } = useAppTranslate();
  const size = template.base.font.size;
  const color = template.base.fill.color;
  const colorValue =
    color.length === 4
      ? `#${[...color.slice(1)].map((digit) => digit + digit).join("")}`
      : color;

  return (
    <fieldset className="flex flex-col gap-group">
      <legend className="mb-2 text-headline font-semibold">
        {t("features.studio.styles.adjust")}
      </legend>
      <label className="flex items-center justify-between gap-group">
        <span className="text-body">{t("features.studio.styles.color")}</span>
        <Input
          type="color"
          className="w-14 cursor-pointer"
          value={colorValue}
          onChange={(event) =>
            onChange(withBaseColor(template, event.currentTarget.value))
          }
        />
      </label>
      <label className="flex flex-col gap-group">
        <span className="text-body">{t("features.studio.styles.size")}</span>
        <Input
          type="range"
          min={16}
          max={240}
          step={1}
          value={size}
          aria-valuetext={size.toLocaleString("fa-IR")}
          onChange={(event) =>
            onChange({
              ...template,
              base: {
                ...template.base,
                font: {
                  ...template.base.font,
                  size: event.currentTarget.valueAsNumber,
                },
              },
            })
          }
        />
      </label>
      <div
        role="group"
        aria-label={t("features.studio.styles.position")}
        className="flex flex-wrap gap-group"
      >
        {ANCHORS.map((anchor) => (
          <Button
            key={anchor}
            type="button"
            variant={
              template.layout.anchor === anchor ? "secondary" : "outline"
            }
            aria-pressed={template.layout.anchor === anchor}
            onClick={() =>
              onChange({ ...template, layout: { ...template.layout, anchor } })
            }
          >
            {t(`features.studio.styles.anchor.${anchor}`)}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
