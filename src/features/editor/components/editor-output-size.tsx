import { useEffect, useState } from "react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import {
  FIELD_LABEL_CLASS,
  INPUT_LABEL_CLASS,
  SIZE_PRESETS_CLASS,
} from "./editor-styles";

interface Props {
  naturalWidth: number;
  naturalHeight: number;
  outputWidth: number | null;
  onChange: (width: number | null) => void;
}

export function EditorOutputSize({
  naturalWidth,
  naturalHeight,
  outputWidth,
  onChange,
}: Props) {
  const { t } = useAppTranslate();
  const [draft, setDraft] = useState(String(outputWidth ?? naturalWidth));
  const maxWidth = Math.min(
    8192,
    Math.floor((8192 * naturalWidth) / naturalHeight),
  );
  const width = outputWidth ?? naturalWidth;
  const height = Math.round((width * naturalHeight) / naturalWidth);
  useEffect(() => setDraft(String(width)), [width]);

  const commit = () => {
    const parsed = Number(draft);
    if (!Number.isFinite(parsed) || parsed < 1) {
      setDraft(String(width));
      return;
    }
    const next = Math.max(1, Math.min(maxWidth, Math.round(parsed)));
    onChange(next === naturalWidth ? null : next);
    setDraft(String(next));
  };

  return (
    <div className="[&>p]:text-muted-foreground flex flex-col gap-2.75 [&>p]:m-0 [&>p]:text-[11px]">
      <div className={FIELD_LABEL_CLASS}>{t("pages.editor.studio.resize")}</div>
      <div className="[&>span]:text-muted-foreground grid grid-cols-[minmax(0,1fr)_12px_minmax(0,1fr)] items-end gap-2 [&>span]:pb-2.75">
        <label className={INPUT_LABEL_CLASS}>
          {t("pages.editor.studio.width")}
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max={maxWidth}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
        </label>
        <span aria-hidden="true">×</span>
        <div className={INPUT_LABEL_CLASS}>
          {t("pages.editor.studio.height")}
          <output dir="ltr">{height}</output>
        </div>
      </div>
      <p>{t("pages.editor.studio.aspectLocked")}</p>
      <div
        className={SIZE_PRESETS_CLASS}
        role="group"
        aria-label={t("pages.editor.studio.resizePresets")}
      >
        {[50, 100, 200].map((percent) => (
          <button
            type="button"
            key={percent}
            aria-pressed={
              width ===
              Math.min(maxWidth, Math.round((naturalWidth * percent) / 100))
            }
            onClick={() =>
              onChange(
                percent === 100
                  ? null
                  : Math.min(
                      maxWidth,
                      Math.max(1, Math.round((naturalWidth * percent) / 100)),
                    ),
              )
            }
          >
            {percent}%
          </button>
        ))}
      </div>
    </div>
  );
}
