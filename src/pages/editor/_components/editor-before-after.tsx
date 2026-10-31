import { useMemo, useState } from "react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

export function EditorBeforeAfter({
  before,
  after,
}: {
  before: HTMLCanvasElement;
  after: HTMLCanvasElement;
}) {
  const { t } = useAppTranslate();
  const [split, setSplit] = useState(50);
  const beforeUrl = useMemo(() => before.toDataURL(), [before]);
  const afterUrl = useMemo(() => after.toDataURL(), [after]);

  return (
    <div
      className="editor-studio-compare"
      role="group"
      aria-label={t("pages.editor.studio.compare")}
    >
      <div className="editor-studio-compare-frame">
        <img
          src={afterUrl}
          alt={t("pages.editor.studio.after")}
          draggable={false}
        />
        <img
          src={beforeUrl}
          alt={t("pages.editor.studio.before")}
          draggable={false}
          className="editor-studio-compare-before"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        />
        <div
          className="editor-studio-compare-divider"
          style={{ left: `${split}%` }}
          aria-hidden="true"
        >
          <span>↔</span>
        </div>
        <span className="editor-studio-compare-label editor-studio-compare-label-before">
          {t("pages.editor.studio.before")}
        </span>
        <span className="editor-studio-compare-label editor-studio-compare-label-after">
          {t("pages.editor.studio.after")}
        </span>
      </div>
      <label className="editor-studio-compare-slider">
        {t("pages.editor.studio.compareSlider")}
        <input
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
