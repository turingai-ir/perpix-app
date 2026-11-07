import { useState } from "react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../hooks/image-editor-workspace-types";
import { DEFAULT_EDITOR_EDITS } from "../model/editor-edits";
import type { EditorOverlay } from "../model/editor-overlays";
import {
  FIELD_LABEL_CLASS,
  GRID_2_TABS_CLASS,
  INPUT_LABEL_CLASS,
  PANEL_CONTENT_CLASS,
  POSITION_GRID_CLASS,
  SECONDARY_BUTTON_CLASS,
  SLIDER_CLASS,
} from "./editor-styles";

type OverlayKey = "textOverlay" | "watermarkOverlay";

export function EditorOverlayControls({
  editor,
}: {
  editor: ImageEditorWorkspaceViewModel;
}) {
  const { t } = useAppTranslate();
  const [kind, setKind] = useState<OverlayKey>("textOverlay");
  const overlay = editor.edits[kind] ?? DEFAULT_EDITOR_EDITS[kind]!;
  const update = (patch: Partial<EditorOverlay>, commit = false) => {
    const next = { ...editor.edits, [kind]: { ...overlay, ...patch } };
    if (commit) editor.commitEdits(next);
    else editor.previewEdits(next);
  };
  const positions = [
    "topRight",
    "topCenter",
    "topLeft",
    "middleRight",
    "middleCenter",
    "middleLeft",
    "bottomRight",
    "bottomCenter",
    "bottomLeft",
  ] as const;

  return (
    <section className={PANEL_CONTENT_CLASS}>
      <div
        className={GRID_2_TABS_CLASS}
        role="group"
        aria-label={t("pages.editor.studio.overlayKind")}
      >
        {(["textOverlay", "watermarkOverlay"] as const).map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={kind === value}
            onClick={() => setKind(value)}
          >
            {t(`pages.editor.studio.${value}`)}
          </button>
        ))}
      </div>
      <label className={INPUT_LABEL_CLASS}>
        {t("pages.editor.studio.overlayContent")}
        <textarea
          value={overlay.text}
          maxLength={120}
          rows={3}
          placeholder={t(
            kind === "watermarkOverlay"
              ? "pages.editor.studio.watermarkPlaceholder"
              : "pages.editor.studio.textPlaceholder",
          )}
          onChange={(event) => update({ text: event.target.value })}
          onBlur={() => editor.commitEdits()}
        />
      </label>
      <div className={SLIDER_CLASS}>
        <span>
          <span>{t("pages.editor.studio.textSize")}</span>
          <b>{overlay.size}%</b>
        </span>
        <input
          type="range"
          min="2"
          max="20"
          value={overlay.size}
          aria-label={t("pages.editor.studio.textSize")}
          onChange={(event) => update({ size: Number(event.target.value) })}
          onPointerUp={() => editor.commitEdits()}
          onKeyUp={() => editor.commitEdits()}
          onBlur={() => editor.commitEdits()}
        />
      </div>
      <div className={SLIDER_CLASS}>
        <span>
          <span>{t("pages.editor.studio.opacity")}</span>
          <b>{overlay.opacity}%</b>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={overlay.opacity}
          aria-label={t("pages.editor.studio.opacity")}
          onChange={(event) => update({ opacity: Number(event.target.value) })}
          onPointerUp={() => editor.commitEdits()}
          onKeyUp={() => editor.commitEdits()}
          onBlur={() => editor.commitEdits()}
        />
      </div>
      <label className="text-foreground/85 flex items-center justify-between text-xs [&_input]:h-9.5 [&_input]:w-12 [&_input]:cursor-pointer [&_input]:border-0 [&_input]:bg-transparent">
        {t("pages.editor.studio.textColor")}
        <input
          type="color"
          value={overlay.color}
          onChange={(event) => update({ color: event.target.value })}
          onBlur={() => editor.commitEdits()}
        />
      </label>
      <div className={FIELD_LABEL_CLASS}>
        {t("pages.editor.studio.textPosition")}
      </div>
      <div
        className={POSITION_GRID_CLASS}
        role="group"
        aria-label={t("pages.editor.studio.textPosition")}
      >
        {positions.map((position, index) => (
          <button
            type="button"
            key={position}
            title={t(`pages.editor.studio.${position}`)}
            aria-label={t(`pages.editor.studio.${position}`)}
            aria-pressed={overlay.position === index}
            onClick={() => update({ position: index }, true)}
          >
            <span />
          </button>
        ))}
      </div>
      {overlay.text && (
        <button
          type="button"
          className={SECONDARY_BUTTON_CLASS}
          onClick={() => update({ text: "" }, true)}
        >
          {t("pages.editor.studio.removeOverlay")}
        </button>
      )}
    </section>
  );
}
