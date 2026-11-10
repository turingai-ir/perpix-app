import { Download } from "lucide-react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { ImageEditorWorkspaceViewModel } from "../hooks/image-editor-workspace-types";
import { EditorOutputSize } from "./editor-output-size";
import {
  FIELD_LABEL_CLASS,
  GRID_3_CLASS,
  PANEL_CONTENT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SLIDER_CLASS,
} from "./editor-styles";

export type EditorExportFormat = "png" | "jpeg" | "webp";

export interface EditorExportPanelProps {
  editor: ImageEditorWorkspaceViewModel;
  format: EditorExportFormat;
  setFormat: (format: EditorExportFormat) => void;
  quality: number;
  setQuality: (quality: number) => void;
  onDownload: () => void;
  outputWidth: number | null;
  setOutputWidth: (width: number | null) => void;
}

export function EditorExportPanel(props: EditorExportPanelProps) {
  const { t } = useAppTranslate();
  const quarterTurn =
    props.editor.edits.rotation === 90 || props.editor.edits.rotation === 270;
  const outputWidth = quarterTurn
    ? props.editor.appliedCrop.height
    : props.editor.appliedCrop.width;
  const outputHeight = quarterTurn
    ? props.editor.appliedCrop.width
    : props.editor.appliedCrop.height;

  return (
    <section className={PANEL_CONTENT_CLASS}>
      <div className={FIELD_LABEL_CLASS}>{t("pages.editor.studio.format")}</div>
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
            onChange={(event) => props.setQuality(Number(event.target.value))}
          />
        </div>
      )}
      <div className="border-foreground/13 text-muted-foreground [&_strong]:text-foreground flex items-center justify-between gap-2.5 border-y py-3.5 text-xs [&_strong]:font-mono">
        <span>{t("pages.editor.studio.dimensions")}</span>
        <strong dir="ltr">
          {props.outputWidth ?? Math.round(outputWidth)} ×{" "}
          {Math.round(
            ((props.outputWidth ?? outputWidth) * outputHeight) / outputWidth,
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
  );
}
