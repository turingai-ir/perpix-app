import {
  Crop,
  Download,
  RotateCw,
  SlidersHorizontal,
  Type,
} from "lucide-react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import type { EditorTool } from "./editor-studio-inspector";

interface Props {
  tool: EditorTool;
  onSelect: (tool: EditorTool) => void;
}

export function EditorStudioToolRail({ tool, onSelect }: Props) {
  const { t } = useAppTranslate();
  const items = [
    { id: "crop", label: t("pages.editor.studio.crop"), icon: Crop },
    {
      id: "adjust",
      label: t("pages.editor.studio.adjust"),
      icon: SlidersHorizontal,
    },
    {
      id: "transform",
      label: t("pages.editor.studio.transform"),
      icon: RotateCw,
    },
    { id: "text", label: t("pages.editor.studio.text"), icon: Type },
    { id: "export", label: t("pages.editor.studio.export"), icon: Download },
  ] as const;
  return (
    <div
      className="border-foreground/13 bg-background/65 col-start-1 row-start-2 flex flex-none items-center justify-around border-y p-1 min-[701px]:row-start-1 min-[701px]:flex-col min-[701px]:justify-start min-[701px]:gap-2.5 min-[701px]:border-0 min-[701px]:border-e min-[701px]:px-2 min-[701px]:py-5.5 max-[1000px]:min-[701px]:px-0.75"
      role="toolbar"
      aria-label={t("pages.editor.studio.tools")}
    >
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className="text-muted-foreground hover-capable:hover:border-primary/30 hover-capable:hover:bg-primary/14 hover-capable:hover:text-foreground aria-pressed:border-primary/30 aria-pressed:bg-primary/14 aria-pressed:text-foreground flex h-13 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[14px] border border-transparent bg-transparent text-[10px] whitespace-nowrap transition-colors motion-reduce:transition-none min-[701px]:h-15.5 min-[701px]:w-14.5 min-[701px]:flex-none min-[701px]:gap-1.5"
          aria-label={label}
          title={label}
          aria-pressed={tool === id}
          onClick={() => onSelect(id)}
        >
          <Icon size={20} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
