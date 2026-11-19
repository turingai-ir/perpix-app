import type { FC } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Trash2,
  Undo2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";

export type EditAction =
  "split" | "trimStart" | "trimEnd" | "remove" | "earlier" | "later" | "undo";

interface Tool {
  action: EditAction;
  icon: LucideIcon;
  danger?: boolean;
}

const TOOLS: readonly Tool[] = [
  { action: "undo", icon: Undo2 },
  { action: "split", icon: Scissors },
  { action: "trimStart", icon: ArrowLeftToLine },
  { action: "trimEnd", icon: ArrowRightToLine },
  { action: "earlier", icon: ChevronLeft },
  { action: "later", icon: ChevronRight },
  { action: "remove", icon: Trash2, danger: true },
];

interface EditToolsProps {
  /** Actions that cannot be done now (a cut too close to an end, no history to undo, ...). */
  disabled: ReadonlySet<EditAction>;
  onAction: (action: EditAction) => void;
}

/** The cutting tools in a row that scrolls sideways, each big enough for a thumb. */
export const EditTools: FC<EditToolsProps> = ({ disabled, onAction }) => {
  const { t } = useAppTranslate();
  return (
    <div
      role="toolbar"
      aria-label={t("features.studio.editor.tools.label")}
      className="flex shrink-0 justify-between gap-0.5 overflow-x-auto px-2 py-2"
    >
      {TOOLS.map(({ action, icon: Icon, danger }) => (
        <button
          key={action}
          type="button"
          disabled={disabled.has(action)}
          onClick={() => onAction(action)}
          className={cn(
            "focus-visible:ring-ring text-caption flex min-h-14 min-w-[3.1rem] flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-0.5 font-medium transition-[background-color,transform] focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-35",
            danger ? "text-destructive" : "text-foreground",
            "hover-capable:hover:bg-muted",
          )}
        >
          <Icon className="size-5" aria-hidden />
          {t(`features.studio.editor.tools.${action}`)}
        </button>
      ))}
    </div>
  );
};
