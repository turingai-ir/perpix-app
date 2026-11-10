import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../hooks/image-editor-workspace-types";
import type { EditorEdits } from "../model/editor-edits";
import { PANEL_CONTENT_CLASS, TRANSFORM_GRID_CLASS } from "./editor-styles";

export function EditorTransformPanel({
  editor,
}: {
  editor: ImageEditorWorkspaceViewModel;
}) {
  const { t } = useAppTranslate();
  const updateEdits = (patch: Partial<EditorEdits>) =>
    editor.commitEdits({ ...editor.edits, ...patch });

  return (
    <section className={`${PANEL_CONTENT_CLASS} ${TRANSFORM_GRID_CLASS}`}>
      <button
        type="button"
        onClick={() =>
          updateEdits({
            rotation: ((editor.edits.rotation + 270) %
              360) as EditorEdits["rotation"],
          })
        }
      >
        <RotateCcw size={20} />
        {t("pages.editor.studio.rotateLeft")}
      </button>
      <button
        type="button"
        onClick={() =>
          updateEdits({
            rotation: ((editor.edits.rotation + 90) %
              360) as EditorEdits["rotation"],
          })
        }
      >
        <RotateCw size={20} />
        {t("pages.editor.studio.rotateRight")}
      </button>
      <button
        type="button"
        aria-pressed={editor.edits.flipX}
        onClick={() => updateEdits({ flipX: !editor.edits.flipX })}
      >
        <FlipHorizontal2 size={20} />
        {t("pages.editor.studio.flipHorizontal")}
      </button>
      <button
        type="button"
        aria-pressed={editor.edits.flipY}
        onClick={() => updateEdits({ flipY: !editor.edits.flipY })}
      >
        <FlipVertical2 size={20} />
        {t("pages.editor.studio.flipVertical")}
      </button>
    </section>
  );
}
