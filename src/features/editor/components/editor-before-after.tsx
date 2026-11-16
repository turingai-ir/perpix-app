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
      className="bg-background/90 absolute inset-0 z-5 flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-lg min-[701px]:gap-3.75 min-[701px]:p-6"
      role="group"
      aria-label={t("pages.editor.studio.compare")}
    >
      <div className="border-foreground/27 bg-background shadow-modal relative min-h-0 w-[min(100%,900px)] flex-1 overflow-hidden rounded-lg border [&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-contain [&>img]:select-none">
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
          className="bg-night-foreground shadow-raised absolute inset-y-0 w-0.5"
          style={{ left: `${split}%` }}
          aria-hidden="true"
        >
          <span className="bg-primary text-primary-foreground shadow-raised absolute top-1/2 left-1/2 grid size-8.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
            ↔
          </span>
        </div>
        <span className="bg-background/75 text-foreground text-caption absolute top-3 left-3 rounded-lg px-2.5 py-1">
          {t("pages.editor.studio.before")}
        </span>
        <span className="bg-background/75 text-foreground text-caption absolute top-3 right-3 rounded-lg px-2.5 py-1">
          {t("pages.editor.studio.after")}
        </span>
      </div>
      <label className="text-foreground/85 [&_input]:accent-primary text-caption max-[700px]:text-caption flex w-[min(100%,420px)] items-center gap-3 [&_input]:min-w-0 [&_input]:flex-1">
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
