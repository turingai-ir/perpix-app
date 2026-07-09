import type { ChangeEvent } from "react";
import { ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useRouteBack } from "@/hooks/use-route-back";

type EditorUploaderEmptyProps = {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function EditorUploaderEmpty({
  onFileChange,
}: EditorUploaderEmptyProps) {
  const { t } = useAppTranslate();
  const routeBack = useRouteBack();

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <Button
        type="button"
        variant="ghost"
        onClick={routeBack}
        className="self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("pages.editor.back")}
      </Button>
      <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full">
        <ImageIcon className="h-8 w-8" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight">
          {t("pages.editor.smartTitle")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("pages.editor.uploaderDesc")}
        </p>
      </div>
      <label className="border-muted-foreground/25 hover:border-primary/50 bg-muted/30 relative flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors">
        <div className="flex flex-col items-center justify-center gap-2 pt-5 pb-6">
          <Upload className="text-muted-foreground h-6 w-6 animate-bounce" />
          <p className="text-muted-foreground text-xs font-medium">
            {t("pages.editor.uploaderBtn")}
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
