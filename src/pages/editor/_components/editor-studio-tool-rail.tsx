import {
  Crop,
  Download,
  RotateCw,
  SlidersHorizontal,
  Type,
} from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
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
      className="editor-studio-tool-rail"
      role="toolbar"
      aria-label={t("pages.editor.studio.tools")}
    >
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className="editor-studio-tool"
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
