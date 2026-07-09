import React, { useState } from "react";
import { ImageEditor } from "./_components/image-editor";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";

export default function EditorPage() {
  const { t } = useAppTranslate();
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("pages.editor.uploaderError"));
        return;
      }
      setImgSrc(URL.createObjectURL(file));
    }
  };

  const handleSave = (dataUrl: string) => {
    const link = document.createElement("a");
    link.download = `perpix-edited-${Date.now()}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t("pages.editor.uploaderSuccess"));
  };

  return (
    <div className="bg-background flex h-[100dvh] w-full flex-col">
      {imgSrc ? (
        <div className="relative h-full w-full flex-1">
          <ImageEditor src={imgSrc} onSave={handleSave} />
          <Button
            onClick={() => setImgSrc(null)}
            variant="outline"
            className="bg-background/90 absolute top-16 right-4 z-40 h-8 px-3 text-xs font-semibold shadow-sm"
          >
            {t("pages.editor.changeImage")}
          </Button>
        </div>
      ) : (
        <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
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
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
