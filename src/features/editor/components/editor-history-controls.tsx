import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface EditorHistoryControlsProps {
  canRedo: boolean;
  canUndo: boolean;
  onRedo: () => void;
  onUndo: () => void;
}

export function EditorHistoryControls(props: EditorHistoryControlsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="بازگردانی"
        disabled={!props.canUndo}
        onClick={props.onUndo}
        className="text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="انجام دوباره"
        disabled={!props.canRedo}
        onClick={props.onRedo}
        className="text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </>
  );
}
