import type { FC } from "react";
import { useNavigate } from "react-router";
import { Clapperboard, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { StudioScreen } from "../shell/studio-screen";

/** The studio's home. Phase 0 is the empty shell; the project list arrives in phase 1. */
export const ProjectsHome: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();

  return (
    <StudioScreen
      title={t("features.studio.projects.title")}
      actions={
        <Button
          variant="ghost"
          size="icon"
          className="size-11 rounded-full"
          aria-label={t("features.studio.shell.exit")}
          onClick={() => navigate(APP_ROUTES_KEY.app.path)}
        >
          <X className="size-5" />
        </Button>
      }
      className="flex flex-col items-center justify-center gap-3 text-center"
    >
      <Clapperboard className="text-muted-foreground size-12" aria-hidden />
      <p className="text-muted-foreground max-w-64 text-sm">
        {t("features.studio.projects.empty")}
      </p>
    </StudioScreen>
  );
};
