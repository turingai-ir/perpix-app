import type { FC } from "react";
import { Captions } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { StudioScreen } from "../shell/studio-screen";

/** The caption styles tab. Phase 0 is the empty shell; the gallery arrives in phase 4. */
export const StylesHome: FC = () => {
  const { t } = useAppTranslate();

  return (
    <StudioScreen
      title={t("features.studio.styles.title")}
      className="flex flex-col items-center justify-center gap-3 text-center"
    >
      <Captions className="text-muted-foreground size-12" aria-hidden />
      <p className="text-muted-foreground max-w-64 text-sm">
        {t("features.studio.styles.empty")}
      </p>
    </StudioScreen>
  );
};
