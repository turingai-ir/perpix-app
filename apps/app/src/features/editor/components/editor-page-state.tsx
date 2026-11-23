import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";

export function EditorPageLoading() {
  const { t } = useAppTranslate();

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-night text-night-foreground/80">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-sm font-semibold">
        {t("pages.editor.loadingImage")}
      </span>
    </div>
  );
}

export function EditorPageLoadError({ onBack }: { onBack: () => void }) {
  const { t } = useAppTranslate();

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-night p-6 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="text-sm font-bold text-night-foreground/80">
        {t("pages.editor.loadError")}
      </p>
      <Button onClick={onBack} className="rounded-full px-6">
        {t("pages.editor.back")}
      </Button>
    </div>
  );
}
