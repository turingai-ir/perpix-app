import { useState } from "react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../_hooks/image-editor-workspace-types";
import { DEFAULT_EDITOR_EDITS } from "../_model/editor-edits";
import type { EditorOverlay } from "../_model/editor-overlays";

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
    <section className="editor-studio-panel-content">
      <div
        className="editor-studio-overlay-tabs"
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
      <label className="editor-studio-input-label">
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
      <div className="editor-studio-slider">
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
      <div className="editor-studio-slider">
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
      <label className="editor-studio-color-label">
        {t("pages.editor.studio.textColor")}
        <input
          type="color"
          value={overlay.color}
          onChange={(event) => update({ color: event.target.value })}
          onBlur={() => editor.commitEdits()}
        />
      </label>
      <div className="editor-studio-field-label">
        {t("pages.editor.studio.textPosition")}
      </div>
      <div
        className="editor-studio-position-grid"
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
          className="editor-studio-secondary-button"
          onClick={() => update({ text: "" }, true)}
        >
          {t("pages.editor.studio.removeOverlay")}
        </button>
      )}
    </section>
  );
}
