import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  Download,
} from "lucide-react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../hooks/image-editor-workspace-types";
import { CROP_RATIO_OPTIONS, type CropRatioId } from "../model/crop-ratios";
import { DEFAULT_EDITOR_EDITS, type EditorEdits } from "../model/editor-edits";
import { EditorOverlayControls } from "./editor-overlay-controls";
import { EditorOutputSize } from "./editor-output-size";
import {
  ACTION_ROW_CLASS,
  FIELD_LABEL_CLASS,
  GRID_3_CLASS,
  PANEL_CONTENT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  SLIDER_CLASS,
  SOCIAL_GRID_CLASS,
  TRANSFORM_GRID_CLASS,
} from "./editor-styles";

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
    <aside
      className="border-foreground/13 bg-card/62 col-start-1 row-start-3 flex min-h-0 min-w-0 flex-col overflow-y-auto border-0 px-4.25 py-3.5 backdrop-blur-xl max-md:max-h-65 min-[701px]:col-start-3 min-[701px]:row-start-1 min-[701px]:border-s md:px-5 md:pt-6 md:pb-4.5"
      aria-label={title}
    >
      <div>
        <span className="text-muted-foreground hidden text-[9px] tracking-[0.2em] [direction:ltr] md:block">
          PERPIX / STUDIO
        </span>
        <h2 className="mt-1.5 mb-px text-[17px] font-extrabold md:mt-3 md:mb-1.5 md:text-[22px]">
          {title}
        </h2>
        <p className="text-muted-foreground m-0 text-[11px] leading-loose md:text-xs">
          {hint}
        </p>
      </div>
      {props.tool === "crop" && (
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
              className={PRIMARY_BUTTON_CLASS}
              onClick={props.editor.beginCrop}
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
                    aria-pressed={props.editor.selectedCropRatio === id}
                    onClick={() => props.editor.selectCropRatio(id)}
                  >
                    {id === "free" ? t("pages.editor.studio.freeRatio") : label}
                  </button>
                ))}
              </div>
              <div className={ACTION_ROW_CLASS}>
                <button
                  type="button"
                  className={SECONDARY_BUTTON_CLASS}
                  onClick={props.editor.cancelCrop}
                >
                  {t("pages.editor.studio.cancel")}
                </button>
                <button
                  type="button"
                  className={PRIMARY_BUTTON_CLASS}
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
            className={SECONDARY_BUTTON_CLASS}
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
        <section className={`${PANEL_CONTENT_CLASS} ${TRANSFORM_GRID_CLASS}`}>
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
        <section className={PANEL_CONTENT_CLASS}>
          <div className={FIELD_LABEL_CLASS}>
            {t("pages.editor.studio.format")}
          </div>
          <div className={GRID_3_CLASS}>
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
            <div className={SLIDER_CLASS}>
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
          <div className="border-foreground/13 text-muted-foreground [&_strong]:text-foreground flex items-center justify-between gap-2.5 border-y py-3.5 text-xs [&_strong]:font-mono">
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
            className={PRIMARY_BUTTON_CLASS}
            onClick={props.onDownload}
          >
            <Download size={17} />
            {t("pages.editor.download")}
          </button>
        </section>
      )}
      <div className="text-muted-foreground mt-auto hidden items-center gap-2 pt-6.5 text-[11px] md:flex">
        <span className="bg-accent-emerald inline-block size-1.75 rounded-full shadow-[0_0_12px_var(--accent-emerald)]" />
        {t("pages.editor.studio.ready")}
      </div>
    </aside>
  );
}
