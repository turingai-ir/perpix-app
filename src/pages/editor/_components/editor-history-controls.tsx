import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        className="text-white hover:bg-white/10 hover:text-white"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="انجام دوباره"
        disabled={!props.canRedo}
        onClick={props.onRedo}
        className="text-white hover:bg-white/10 hover:text-white"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </>
  );
}
