import { useAtom } from "jotai";
import { ArrowRight, Download, Grid2X2, Ruler, Columns2 } from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { showGridAtom, showRulerAtom } from "../_model/editor-settings";
import { EditorHistoryControls } from "./editor-history-controls";
import { ImageEditorZoomControls } from "./image-editor-zoom-controls";

interface Props {
  onBack: () => void;
  onDownload: () => void;
  showCompare: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  stageSize: { height: number; width: number } | null;
}

export function EditorStudioHeader(props: Props) {
  const { t } = useAppTranslate();
  const [showGrid, setShowGrid] = useAtom(showGridAtom);
  const [showRuler, setShowRuler] = useAtom(showRulerAtom);

  return (
    <header
      className="editor-studio-header"
      aria-label={t("pages.editor.studio.topMenu")}
    >
      <div className="editor-studio-header-title">
        <button
          type="button"
          className="editor-studio-icon-button"
          onClick={props.onBack}
          aria-label={t("pages.editor.back")}
          title={t("pages.editor.back")}
        >
          <ArrowRight size={19} />
        </button>
        <span className="editor-studio-brand-mark" aria-hidden="true">
          P
        </span>
        <span className="editor-studio-brand-copy">
          <strong>PerPix</strong>
          <small>{t("pages.editor.studio.eyebrow")}</small>
        </span>
      </div>
      <div className="editor-studio-header-actions">
        <button
          type="button"
          className="editor-studio-compare-toggle"
          aria-pressed={props.showCompare}
          disabled={props.compareDisabled}
          onClick={props.onToggleCompare}
          title={t("pages.editor.studio.compare")}
        >
          <Columns2 size={17} />
          <span>{t("pages.editor.studio.compare")}</span>
        </button>
        <div className="editor-studio-header-group">
          <EditorHistoryControls
            canUndo={props.canUndo}
            canRedo={props.canRedo}
            onUndo={props.onUndo}
            onRedo={props.onRedo}
          />
        </div>
        <div className="editor-studio-header-group editor-studio-view-controls">
          <button
            type="button"
            className="editor-studio-icon-button"
            aria-label={t("pages.editor.toggleGrid")}
            title={t("pages.editor.toggleGrid")}
            aria-pressed={showGrid}
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid2X2 size={17} />
          </button>
          <button
            type="button"
            className="editor-studio-icon-button"
            aria-label={t("pages.editor.toggleRuler")}
            title={t("pages.editor.toggleRuler")}
            aria-pressed={showRuler}
            onClick={() => setShowRuler(!showRuler)}
          >
            <Ruler size={17} />
          </button>
        </div>
        <div className="editor-studio-view-controls">
          <ImageEditorZoomControls stageSize={props.stageSize} />
        </div>
        <button
          type="button"
          className="editor-studio-primary-button"
          onClick={props.onDownload}
        >
          <Download size={17} />
          <span>{t("pages.editor.download")}</span>
        </button>
      </div>
    </header>
  );
}
