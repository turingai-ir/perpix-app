import type { FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Film } from "lucide-react";

import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { StudioScreen } from "../shell/studio-screen";
import { useProject } from "./hooks/use-projects";
import { isMissing } from "./model/project-error";

/**
 * A project's screen. Phase 1 only opens it and shows its name; the video,
 * subtitles and cuts are added in the next phases.
 */
export const ProjectPage: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { projectUuid = "" } = useParams();
  const project = useProject(projectUuid);
  const back = () => navigate(APP_ROUTES_KEY.studio.path, { replace: true });

  return (
    <StudioScreen
      title={project.data?.title ?? t("features.studio.projects.title")}
      onBack={back}
      className="flex flex-col items-center justify-center gap-3 text-center"
    >
      {project.isPending ? (
        <Skeleton className="h-24 w-full max-w-64" aria-hidden />
      ) : project.isError ? (
        isMissing(project.error) ? (
          <p className="text-muted-foreground text-sm">
            {t("features.studio.projects.errors.missing")}
          </p>
        ) : (
          <ErrorSection onRetry={() => void project.refetch()} />
        )
      ) : (
        <>
          <Film className="text-muted-foreground size-12" aria-hidden />
          <p className="text-muted-foreground max-w-64 text-sm">
            {t("features.studio.projects.workspaceSoon")}
          </p>
        </>
      )}
    </StudioScreen>
  );
};
