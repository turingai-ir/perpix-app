import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";

export function EditorPageLoading() {
  const { t } = useAppTranslate();

  return (
    <div className="bg-night text-night-foreground/80 flex h-dvh w-full flex-col items-center justify-center gap-3">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <span className="text-sm font-semibold">
        {t("pages.editor.loadingImage")}
      </span>
    </div>
  );
}

export function EditorPageLoadError({ onBack }: { onBack: () => void }) {
  const { t } = useAppTranslate();

  return (
    <div className="bg-night flex h-dvh w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertCircle className="text-destructive h-10 w-10" />
      <p className="text-night-foreground/80 text-sm font-bold">
        {t("pages.editor.loadError")}
      </p>
      <Button onClick={onBack} className="rounded-full px-6">
        {t("pages.editor.back")}
      </Button>
    </div>
  );
}
