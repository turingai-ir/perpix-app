import { useMemo, useState } from "react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";

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
      className="absolute inset-0 z-5 flex flex-col items-center justify-center gap-2 bg-background/90 p-3 backdrop-blur-lg min-[701px]:gap-3.75 min-[701px]:p-6"
      role="group"
      aria-label={t("pages.editor.studio.compare")}
    >
      <div className="relative min-h-0 w-[min(100%,900px)] flex-1 overflow-hidden rounded-lg border border-foreground/27 bg-background shadow-modal [&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-contain [&>img]:select-none">
        <img
          src={afterUrl}
          alt={t("pages.editor.studio.after")}
          draggable={false}
        />
        <img
          src={beforeUrl}
          alt={t("pages.editor.studio.before")}
          draggable={false}

          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-night-foreground shadow-raised"
          style={{ left: `${split}%` }}
          aria-hidden="true"
        >
          <span className="absolute top-1/2 left-1/2 grid size-8.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-raised">
            ↔
          </span>
        </div>
        <span className="absolute top-3 left-3 rounded-lg bg-background/75 px-2.5 py-1 text-caption text-foreground">
          {t("pages.editor.studio.before")}
        </span>
        <span className="absolute top-3 right-3 rounded-lg bg-background/75 px-2.5 py-1 text-caption text-foreground">
          {t("pages.editor.studio.after")}
        </span>
      </div>
      <label className="flex w-[min(100%,420px)] items-center gap-3 text-caption text-foreground/85 max-[700px]:text-caption [&_input]:min-w-0 [&_input]:flex-1 [&_input]:accent-primary">
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
