import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../hooks/image-editor-workspace-types";
import { DEFAULT_EDITOR_EDITS } from "../model/editor-edits";
import {
  PANEL_CONTENT_CLASS,
  SECONDARY_BUTTON_CLASS,
  SLIDER_CLASS,
} from "./editor-styles";

export function EditorAdjustPanel({
  editor,
}: {
  editor: ImageEditorWorkspaceViewModel;
}) {
  const { t } = useAppTranslate();

  return (
    <section className={PANEL_CONTENT_CLASS}>
      {(["brightness", "contrast", "saturation"] as const).map((key) => (
        <div className={SLIDER_CLASS} key={key}>
          <span>
            <span>
              {t(
                key === "saturation"
                  ? "pages.editor.studio.saturation"
                  : `pages.editor.${key}`,
              )}
            </span>
            <b dir="ltr">{editor.edits[key]}%</b>
          </span>
          <input
            type="range"
            aria-label={t(
              key === "saturation"
                ? "pages.editor.studio.saturation"
                : `pages.editor.${key}`,
            )}
            min="0"
            max="200"
            value={editor.edits[key]}
            onChange={(event) =>
              editor.previewEdits({
                ...editor.edits,
                [key]: Number(event.target.value),
              })
            }
            onPointerUp={() => editor.commitEdits()}
            onKeyUp={() => editor.commitEdits()}
            onBlur={() => editor.commitEdits()}
          />
        </div>
      ))}
      <button
        type="button"
        className={SECONDARY_BUTTON_CLASS}
        onClick={() =>
          editor.commitEdits({
            ...editor.edits,
            brightness: DEFAULT_EDITOR_EDITS.brightness,
            contrast: DEFAULT_EDITOR_EDITS.contrast,
            saturation: DEFAULT_EDITOR_EDITS.saturation,
          })
        }
      >
        {t("pages.editor.studio.resetAdjustments")}
      </button>
    </section>
  );
}
