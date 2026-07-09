import { useAtom } from "jotai";
import * as store from "../_hooks/store";
import { Button } from "@/components/ui/button";
import { Crop, Scale, Sliders } from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

export function EditorToolbar() {
  const { t } = useAppTranslate();
  const [activeTool, setActiveTool] = useAtom(store.activeToolAtom);

  if (activeTool !== "none") return null;

  const tools = [
    {
      id: "crop",
      icon: Crop,
      label: t("pages.editor.cropImage"),
      color: "hover:text-amber-500",
    },
    {
      id: "resize",
      icon: Scale,
      label: t("pages.editor.resizeImage"),
      color: "hover:text-blue-500",
    },
    {
      id: "filter",
      icon: Sliders,
      label: t("pages.editor.filters"),
      color: "hover:text-purple-500",
    },
  ] as const;

  return (
    <div className="pb-safe mx-4 mb-4 flex h-20 items-center justify-around rounded-2xl border border-neutral-900/60 bg-neutral-950/85 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {tools.map(({ id, icon: Icon, label, color }) => (
        <Button
          key={id}
          variant="ghost"
          className={`group relative flex h-auto flex-col items-center gap-1.5 rounded-xl px-6 py-2 text-neutral-400 transition-all duration-200 hover:scale-105 hover:bg-neutral-900/50 active:scale-95 ${color}`}
          onClick={() => setActiveTool(id)}
        >
          <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-[10px] font-bold tracking-wide">{label}</span>
        </Button>
      ))}
    </div>
  );
}
