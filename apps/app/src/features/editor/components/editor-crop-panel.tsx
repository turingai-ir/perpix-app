import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../hooks/image-editor-workspace-types";
import { CROP_RATIO_OPTIONS, type CropRatioId } from "../model/crop-ratios";
import {
  ACTION_ROW_CLASS,
  FIELD_LABEL_CLASS,
  GRID_3_CLASS,
  PANEL_CONTENT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  SOCIAL_GRID_CLASS,
} from "./editor-styles";

const socialPresets: { id: CropRatioId; key: string }[] = [
  { id: "1:1", key: "squarePost" },
  { id: "4:5", key: "portraitPost" },
  { id: "9:16", key: "story" },
  { id: "1.91:1", key: "landscapePost" },
];

export function EditorCropPanel({
  editor,
}: {
  editor: ImageEditorWorkspaceViewModel;
}) {
  const { t } = useAppTranslate();
  const selectSocialPreset = (id: CropRatioId) => {
    if (!editor.isCropping) editor.beginCrop();
    editor.selectCropRatio(id);
  };

  return (
    <section className={PANEL_CONTENT_CLASS}>
      <div className={FIELD_LABEL_CLASS}>
        {t("pages.editor.studio.socialPresets")}
      </div>
      <div
        className={SOCIAL_GRID_CLASS}
        role="group"
        aria-label={t("pages.editor.studio.socialPresets")}
      >
        {socialPresets.map(({ id, key }) => (
          <button
            type="button"
            key={id}
            aria-pressed={editor.isCropping && editor.selectedCropRatio === id}
            onClick={() => selectSocialPreset(id)}
          >
            <strong>{t(`pages.editor.studio.${key}`)}</strong>
            <span dir="ltr">{id}</span>
          </button>
        ))}
      </div>
      {!editor.isCropping ? (
        <button
          type="button"
          className={PRIMARY_BUTTON_CLASS}
          onClick={editor.beginCrop}
        >
          {t("pages.editor.cropImage")}
        </button>
      ) : (
        <>
          <div className={FIELD_LABEL_CLASS}>
            {t("pages.editor.studio.cropRatios")}
          </div>
          <div
            className={GRID_3_CLASS}
            role="toolbar"
            aria-label={t("pages.editor.studio.cropRatios")}
          >
            {CROP_RATIO_OPTIONS.map(({ id, label }) => (
              <button
                type="button"
                key={id}
                aria-pressed={editor.selectedCropRatio === id}
                onClick={() => editor.selectCropRatio(id)}
              >
                {id === "free" ? t("pages.editor.studio.freeRatio") : label}
              </button>
            ))}
          </div>
          <div className={ACTION_ROW_CLASS}>
            <button
              type="button"
              className={SECONDARY_BUTTON_CLASS}
              onClick={editor.cancelCrop}
            >
              {t("pages.editor.studio.cancel")}
            </button>
            <button
              type="button"
              className={PRIMARY_BUTTON_CLASS}
              onClick={editor.applyCrop}
            >
              {t("pages.editor.studio.apply")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
