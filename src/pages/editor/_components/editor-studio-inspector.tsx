import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  Download,
} from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../_hooks/image-editor-workspace-types";
import { CROP_RATIO_OPTIONS, type CropRatioId } from "../_model/crop-ratios";
import { DEFAULT_EDITOR_EDITS, type EditorEdits } from "../_model/editor-edits";
import { EditorOverlayControls } from "./editor-overlay-controls";
import { EditorOutputSize } from "./editor-output-size";

export type EditorTool = "crop" | "adjust" | "transform" | "text" | "export";
type Format = "png" | "jpeg" | "webp";
interface Props {
  tool: EditorTool;
  editor: ImageEditorWorkspaceViewModel;
  format: Format;
  setFormat: (format: Format) => void;
  quality: number;
  setQuality: (quality: number) => void;
  onDownload: () => void;
  outputWidth: number | null;
  setOutputWidth: (width: number | null) => void;
}

export function EditorStudioInspector(props: Props) {
  const { t } = useAppTranslate();
  const title = t(`pages.editor.studio.${props.tool}`);
  const hint = t(`pages.editor.studio.${props.tool}Hint`);
  const updateEdits = (patch: Partial<EditorEdits>) =>
    props.editor.commitEdits({ ...props.editor.edits, ...patch });
  const quarterTurn =
    props.editor.edits.rotation === 90 || props.editor.edits.rotation === 270;
  const outputWidth = quarterTurn
    ? props.editor.appliedCrop.height
    : props.editor.appliedCrop.width;
  const outputHeight = quarterTurn
    ? props.editor.appliedCrop.width
    : props.editor.appliedCrop.height;
  const socialPresets: { id: CropRatioId; key: string }[] = [
    { id: "1:1", key: "squarePost" },
    { id: "4:5", key: "portraitPost" },
    { id: "9:16", key: "story" },
    { id: "1.91:1", key: "landscapePost" },
  ];
  const selectSocialPreset = (id: CropRatioId) => {
    if (!props.editor.isCropping) props.editor.beginCrop();
    props.editor.selectCropRatio(id);
  };

  return (
    <aside className="editor-studio-inspector" aria-label={title}>
      <div className="editor-studio-inspector-heading">
        <span className="editor-studio-inspector-kicker">PERPIX / STUDIO</span>
        <h2>{title}</h2>
        <p>{hint}</p>
      </div>
      {props.tool === "crop" && (
        <section className="editor-studio-panel-content">
          <div className="editor-studio-field-label">
            {t("pages.editor.studio.socialPresets")}
          </div>
          <div
            className="editor-studio-social-grid"
            role="group"
            aria-label={t("pages.editor.studio.socialPresets")}
          >
            {socialPresets.map(({ id, key }) => (
              <button
                type="button"
                key={id}
                aria-pressed={
                  props.editor.isCropping &&
                  props.editor.selectedCropRatio === id
                }
                onClick={() => selectSocialPreset(id)}
              >
                <strong>{t(`pages.editor.studio.${key}`)}</strong>
                <span dir="ltr">{id}</span>
              </button>
            ))}
          </div>
          {!props.editor.isCropping ? (
            <button
              type="button"
              className="editor-studio-panel-primary"
              onClick={props.editor.beginCrop}
            >
              {t("pages.editor.cropImage")}
            </button>
          ) : (
            <>
              <div className="editor-studio-field-label">
                {t("pages.editor.studio.cropRatios")}
              </div>
              <div
                className="editor-studio-ratio-grid"
                role="toolbar"
                aria-label={t("pages.editor.studio.cropRatios")}
              >
                {CROP_RATIO_OPTIONS.map(({ id, label }) => (
                  <button
                    type="button"
                    key={id}
                    aria-pressed={props.editor.selectedCropRatio === id}
                    onClick={() => props.editor.selectCropRatio(id)}
                  >
                    {id === "free" ? t("pages.editor.studio.freeRatio") : label}
                  </button>
                ))}
              </div>
              <div className="editor-studio-action-row">
                <button
                  type="button"
                  className="editor-studio-secondary-button"
                  onClick={props.editor.cancelCrop}
                >
                  {t("pages.editor.studio.cancel")}
                </button>
                <button
                  type="button"
                  className="editor-studio-panel-primary"
                  onClick={props.editor.applyCrop}
                >
                  {t("pages.editor.studio.apply")}
                </button>
              </div>
            </>
          )}
        </section>
      )}
      {props.tool === "adjust" && (
        <section className="editor-studio-panel-content">
          {(["brightness", "contrast", "saturation"] as const).map((key) => (
            <div className="editor-studio-slider" key={key}>
              <span>
                <span>
                  {t(
                    key === "saturation"
                      ? "pages.editor.studio.saturation"
                      : `pages.editor.${key}`,
                  )}
                </span>
                <b dir="ltr">{props.editor.edits[key]}%</b>
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
                value={props.editor.edits[key]}
                onChange={(event) =>
                  props.editor.previewEdits({
                    ...props.editor.edits,
                    [key]: Number(event.target.value),
                  })
                }
                onPointerUp={() => props.editor.commitEdits()}
                onKeyUp={() => props.editor.commitEdits()}
                onBlur={() => props.editor.commitEdits()}
              />
            </div>
          ))}
          <button
            type="button"
            className="editor-studio-secondary-button"
            onClick={() =>
              props.editor.commitEdits({
                ...props.editor.edits,
                brightness: DEFAULT_EDITOR_EDITS.brightness,
                contrast: DEFAULT_EDITOR_EDITS.contrast,
                saturation: DEFAULT_EDITOR_EDITS.saturation,
              })
            }
          >
            {t("pages.editor.studio.resetAdjustments")}
          </button>
        </section>
      )}
      {props.tool === "transform" && (
        <section className="editor-studio-panel-content editor-studio-transform-grid">
          <button
            type="button"
            onClick={() =>
              updateEdits({
                rotation: ((props.editor.edits.rotation + 270) %
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
                rotation: ((props.editor.edits.rotation + 90) %
                  360) as EditorEdits["rotation"],
              })
            }
          >
            <RotateCw size={20} />
            {t("pages.editor.studio.rotateRight")}
          </button>
          <button
            type="button"
            aria-pressed={props.editor.edits.flipX}
            onClick={() => updateEdits({ flipX: !props.editor.edits.flipX })}
          >
            <FlipHorizontal2 size={20} />
            {t("pages.editor.studio.flipHorizontal")}
          </button>
          <button
            type="button"
            aria-pressed={props.editor.edits.flipY}
            onClick={() => updateEdits({ flipY: !props.editor.edits.flipY })}
          >
            <FlipVertical2 size={20} />
            {t("pages.editor.studio.flipVertical")}
          </button>
        </section>
      )}
      {props.tool === "text" && <EditorOverlayControls editor={props.editor} />}
      {props.tool === "export" && (
        <section className="editor-studio-panel-content">
          <div className="editor-studio-field-label">
            {t("pages.editor.studio.format")}
          </div>
          <div className="editor-studio-format-grid">
            {(["png", "jpeg", "webp"] as const).map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={props.format === value}
                onClick={() => props.setFormat(value)}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
          {props.format !== "png" && (
            <div className="editor-studio-slider">
              <span>
                <span>{t("pages.editor.studio.quality")}</span>
                <b dir="ltr">{props.quality}%</b>
              </span>
              <input
                type="range"
                aria-label={t("pages.editor.studio.quality")}
                min="10"
                max="100"
                value={props.quality}
                onChange={(event) =>
                  props.setQuality(Number(event.target.value))
                }
              />
            </div>
          )}
          <div className="editor-studio-output-size">
            <span>{t("pages.editor.studio.dimensions")}</span>
            <strong dir="ltr">
              {props.outputWidth ?? Math.round(outputWidth)} ×{" "}
              {Math.round(
                ((props.outputWidth ?? outputWidth) * outputHeight) /
                  outputWidth,
              )}{" "}
              px
            </strong>
          </div>
          <EditorOutputSize
            naturalWidth={Math.round(outputWidth)}
            naturalHeight={Math.round(outputHeight)}
            outputWidth={props.outputWidth}
            onChange={props.setOutputWidth}
          />
          <button
            type="button"
            className="editor-studio-panel-primary"
            onClick={props.onDownload}
          >
            <Download size={17} />
            {t("pages.editor.download")}
          </button>
        </section>
      )}
      <div className="editor-studio-inspector-foot">
        <span className="editor-studio-inspector-foot-dot" />
        {t("pages.editor.studio.ready")}
      </div>
    </aside>
  );
}
