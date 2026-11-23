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
import { SHORTCUTS } from "../model/shortcuts";

export type EditAction =
  | "split"
  | "trimStart"
  | "trimEnd"
  | "remove"
  | "earlier"
  | "later"
  | "undo";

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
  /** `row` is a strip that scrolls sideways under the player; `grid` is a panel for a large screen. */
  layout: "row" | "grid";
  /** Actions that cannot be done now (a cut too close to an end, no history to undo, ...). */
  disabled: ReadonlySet<EditAction>;
  onAction: (action: EditAction) => void;
}

/** The cutting tools, each big enough for a thumb and labelled with its shortcut where there is a keyboard. */
export const EditTools: FC<EditToolsProps> = ({
  layout,
  disabled,
  onAction,
}) => {
  const { t } = useAppTranslate();
  const grid = layout === "grid";

  return (
    <div
      role="toolbar"
      aria-label={t("features.studio.editor.tools.label")}
      className={cn(
        grid
          ? "flex flex-col gap-1.5"
          : "flex shrink-0 justify-between gap-0.5 overflow-x-auto px-2 py-2",
      )}
    >
      {TOOLS.map(({ action, icon: Icon, danger }) => {
        const label = t(`features.studio.editor.tools.${action}`);
        const shortcut = SHORTCUTS[action];
        return (
          <button
            key={action}
            type="button"
            disabled={disabled.has(action)}
            title={shortcut ? `${label} (${shortcut})` : label}
            onClick={(event) => {
              onAction(action);
              // A mouse click must not leave focus here, or the space bar would press this tool again instead of playing.
              if (event.detail > 0) event.currentTarget.blur();
            }}
            className={cn(
              "cursor-pointer rounded-xl font-medium transition-[background-color,transform] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-35",
              grid
                ? "hover-capable:hover:bg-muted flex min-h-12 items-center gap-2 bg-muted/50 px-3 text-sm"
                : "hover-capable:hover:bg-muted flex min-h-14 min-w-[3.1rem] flex-1 flex-col items-center justify-center gap-1 px-0.5 text-caption",
              danger ? "text-destructive" : "text-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span>{label}</span>
            {grid && shortcut && (
              <kbd
                dir="ltr"
                className="ms-auto rounded border bg-background px-1.5 py-0.5 text-xs font-normal text-muted-foreground"
              >
                {shortcut}
              </kbd>
            )}
          </button>
        );
      })}
    </div>
  );
};
