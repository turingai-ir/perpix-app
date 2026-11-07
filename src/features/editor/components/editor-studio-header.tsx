import { useAtom } from "jotai";
import { ArrowRight, Download, Grid2X2, Ruler, Columns2 } from "lucide-react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import { showGridAtom, showRulerAtom } from "../model/editor-settings";
import { EditorHistoryControls } from "./editor-history-controls";
import { ImageEditorZoomControls } from "./image-editor-zoom-controls";
import {
  CHIP_BUTTON_CLASS,
  HEADER_GROUP_CLASS,
  ICON_BUTTON_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "./editor-styles";

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
      className="border-foreground/13 bg-card/75 z-2 flex h-14.75 flex-none items-center justify-between gap-3.5 border-b px-2.5 backdrop-blur-xl min-[701px]:h-17.5 min-[701px]:px-5.5"
      aria-label={t("pages.editor.studio.topMenu")}
    >
      <div className="flex min-w-0 items-center gap-1 min-[701px]:gap-2.5">
        <button
          type="button"
          className={ICON_BUTTON_CLASS}
          onClick={props.onBack}
          aria-label={t("pages.editor.back")}
          title={t("pages.editor.back")}
        >
          <ArrowRight size={19} />
        </button>
        <span
          className="from-primary to-primary/60 text-primary-foreground grid size-8 place-items-center rounded-[11px] bg-linear-145 font-black shadow-[0_8px_28px_color-mix(in_srgb,var(--primary)_29%,transparent)] max-[400px]:hidden"
          aria-hidden="true"
        >
          P
        </span>
        <span className="hidden flex-col text-left leading-tight [direction:ltr] min-[701px]:flex">
          <strong className="text-[15px]">PerPix</strong>
          <small className="text-muted-foreground text-[10px]">
            {t("pages.editor.studio.eyebrow")}
          </small>
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-0.75 min-[701px]:gap-2.5">
        <button
          type="button"
          className={`${CHIP_BUTTON_CLASS} inline-flex items-center justify-center gap-1.75 px-2.75 max-[700px]:w-9.5 max-[700px]:px-0`}
          aria-pressed={props.showCompare}
          disabled={props.compareDisabled}
          onClick={props.onToggleCompare}
          title={t("pages.editor.studio.compare")}
        >
          <Columns2 size={17} />
          <span className="max-[700px]:hidden">
            {t("pages.editor.studio.compare")}
          </span>
        </button>
        <div className={HEADER_GROUP_CLASS}>
          <EditorHistoryControls
            canUndo={props.canUndo}
            canRedo={props.canRedo}
            onUndo={props.onUndo}
            onRedo={props.onRedo}
          />
        </div>
        <div className={`${HEADER_GROUP_CLASS} max-[1000px]:hidden`}>
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label={t("pages.editor.toggleGrid")}
            title={t("pages.editor.toggleGrid")}
            aria-pressed={showGrid}
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid2X2 size={17} />
          </button>
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label={t("pages.editor.toggleRuler")}
            title={t("pages.editor.toggleRuler")}
            aria-pressed={showRuler}
            onClick={() => setShowRuler(!showRuler)}
          >
            <Ruler size={17} />
          </button>
        </div>
        <div className="max-[1000px]:hidden">
          <ImageEditorZoomControls stageSize={props.stageSize} />
        </div>
        <button
          type="button"
          className={PRIMARY_BUTTON_CLASS}
          onClick={props.onDownload}
        >
          <Download size={17} />
          <span>{t("pages.editor.download")}</span>
        </button>
      </div>
    </header>
  );
}
