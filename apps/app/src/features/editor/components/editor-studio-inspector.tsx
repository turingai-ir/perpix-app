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
      className="col-start-1 row-start-3 flex min-h-0 min-w-0 flex-col overflow-y-auto border-0 border-foreground/13 bg-card/62 px-4.25 py-3.5 backdrop-blur-xl max-md:max-h-65 min-[701px]:col-start-3 min-[701px]:row-start-1 min-[701px]:border-s md:px-5 md:pt-6 md:pb-4.5"
      aria-label={title}
    >
      <div>
        <span className="hidden text-caption tracking-[0.2em] text-muted-foreground [direction:ltr] md:block">
          PERPIX / STUDIO
        </span>
        <h2 className="mt-1.5 mb-px text-base font-extrabold md:mt-3 md:mb-1.5 md:text-title-2">
          {title}
        </h2>
        <p className="m-0 text-caption leading-loose text-muted-foreground md:text-xs">
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
      <div className="mt-auto hidden items-center gap-2 pt-6.5 text-caption text-muted-foreground md:flex">
        <span className="inline-block size-1.75 rounded-full bg-accent-emerald shadow-[0_0_12px_var(--accent-emerald)]" />
        {t("pages.editor.studio.ready")}
      </div>
    </aside>
  );
}
