import {
  ChevronDown,
  Download,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

type EditorSaveMenuProps = {
  disabled: boolean;
  saving: boolean;
  srcImage: string | null;
  onSave?: (dataUrl: string) => void;
  onSaveToGallery?: (dataUrl: string) => Promise<void>;
};

export function EditorSaveMenu({
  disabled,
  saving,
  srcImage,
  onSave,
  onSaveToGallery,
}: EditorSaveMenuProps) {
  const { t } = useAppTranslate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          className="bg-primary text-primary-foreground hover:bg-primary/95 h-9 gap-2 rounded-full px-5 font-bold shadow-md transition-all duration-200 hover:scale-103 hover:shadow-lg active:scale-97"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span>{t("pages.editor.saveOptions")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-48 rounded-xl border-neutral-800 bg-neutral-900 p-1 text-neutral-200 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => srcImage && onSave?.(srcImage)}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-800 focus:bg-neutral-800"
        >
          <Download className="h-4 w-4 text-amber-500" />
          <span>{t("pages.editor.download")}</span>
        </DropdownMenuItem>
        {onSaveToGallery ? (
          <DropdownMenuItem
            onClick={() => srcImage && onSaveToGallery(srcImage)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-800 focus:bg-neutral-800"
          >
            <ImageIcon className="h-4 w-4 text-emerald-500" />
            <span>{t("pages.editor.saveToGallery")}</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
