import { useEffect, useState } from "react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

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
    <div className="editor-studio-size-controls">
      <div className="editor-studio-field-label">
        {t("pages.editor.studio.resize")}
      </div>
      <div className="editor-studio-size-fields">
        <label className="editor-studio-input-label">
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
        <div className="editor-studio-input-label">
          {t("pages.editor.studio.height")}
          <output dir="ltr">{height}</output>
        </div>
      </div>
      <p>{t("pages.editor.studio.aspectLocked")}</p>
      <div
        className="editor-studio-size-presets"
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
