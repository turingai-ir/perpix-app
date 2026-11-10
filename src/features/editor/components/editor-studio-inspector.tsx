import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import { EditorAdjustPanel } from "./editor-adjust-panel";
import { EditorCropPanel } from "./editor-crop-panel";
import {
  EditorExportPanel,
  type EditorExportPanelProps,
} from "./editor-export-panel";
import { EditorOverlayControls } from "./editor-overlay-controls";
import { EditorTransformPanel } from "./editor-transform-panel";

export type EditorTool = "crop" | "adjust" | "transform" | "text" | "export";
interface Props extends EditorExportPanelProps {
  tool: EditorTool;
}

export function EditorStudioInspector(props: Props) {
  const { t } = useAppTranslate();
  const title = t(`pages.editor.studio.${props.tool}`);
  const hint = t(`pages.editor.studio.${props.tool}Hint`);

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
      {props.tool === "crop" && <EditorCropPanel editor={props.editor} />}
      {props.tool === "adjust" && <EditorAdjustPanel editor={props.editor} />}
      {props.tool === "transform" && (
        <EditorTransformPanel editor={props.editor} />
      )}
      {props.tool === "text" && <EditorOverlayControls editor={props.editor} />}
      {props.tool === "export" && <EditorExportPanel {...props} />}
      <div className="text-muted-foreground mt-auto hidden items-center gap-2 pt-6.5 text-[11px] md:flex">
        <span className="bg-accent-emerald inline-block size-1.75 rounded-full shadow-[0_0_12px_var(--accent-emerald)]" />
        {t("pages.editor.studio.ready")}
      </div>
    </aside>
  );
}
