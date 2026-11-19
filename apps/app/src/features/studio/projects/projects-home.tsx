import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { Clapperboard, Loader2, Plus, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { useAppTranslate, useInfiniteScroll } from "@/shared/hooks";
import { APP_ROUTES_KEY, studioProjectPath } from "@/app/router/routes";
import { StudioScreen } from "../shell/studio-screen";
import { useProjectActions } from "./hooks/use-project-actions";
import { useNow } from "./hooks/use-now";
import { useProjects } from "./hooks/use-projects";
import type { ProjectSummary } from "./model/project";
import { ProjectActionsSheet } from "./components/project-actions-sheet";
import { ProjectCard } from "./components/project-card";
import { ProjectTitleSheet } from "./components/project-title-sheet";

type Naming = { mode: "create" } | { mode: "rename"; project: ProjectSummary };

/** The studio's home: the user's projects, newest change first. */
export const ProjectsHome: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const projects = useProjects();
  const { create, rename, remove } = useProjectActions();

  const [naming, setNaming] = useState<Naming | null>(null);
  const [menuFor, setMenuFor] = useState<ProjectSummary | null>(null);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = projects;
  const sentinel = useInfiniteScroll<HTMLDivElement>({
    offset: 240,
    disabled: !hasNextPage,
    loading: isFetchingNextPage,
    onTrigger: () => void fetchNextPage(),
  });

  const open = (project: ProjectSummary) =>
    navigate(studioProjectPath(project.uuid));

  const submitName = (title: string) => {
    if (naming?.mode === "rename") {
      rename.mutate(
        { uuid: naming.project.uuid, title },
        { onSuccess: () => setNaming(null) },
      );
    } else {
      create.mutate(title, {
        onSuccess: (project) => {
          setNaming(null);
          open(project);
        },
      });
    }
  };

  const startCreate = () => setNaming({ mode: "create" });
  const now = useNow();

  return (
    <StudioScreen
      title={t("features.studio.projects.title")}
      actions={
        <>
          <Button
            className="hidden min-h-10 gap-2 rounded-full px-5 lg:inline-flex"
            onClick={startCreate}
          >
            <Plus className="size-4" aria-hidden />
            {t("features.studio.projects.create")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full lg:hidden"
            aria-label={t("features.studio.shell.exit")}
            onClick={() => navigate(APP_ROUTES_KEY.app.path)}
          >
            <X className="size-5" />
          </Button>
        </>
      }
      footer={
        <div className="shrink-0 border-t px-4 py-3 lg:hidden">
          <Button
            size="lg"
            className="min-h-12 w-full gap-2 text-base"
            onClick={startCreate}
          >
            <Plus className="size-5" aria-hidden />
            {t("features.studio.projects.create")}
          </Button>
        </div>
      }
    >
      {projects.isPending ? (
        <ul
          className="grid gap-2 lg:grid-cols-2 lg:gap-3 xl:grid-cols-3"
          aria-hidden
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-[5.25rem] rounded-2xl" />
          ))}
        </ul>
      ) : projects.isError ? (
        <ErrorSection onRetry={() => void projects.refetch()} />
      ) : projects.data.length === 0 ? (
        <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
          <Clapperboard className="text-muted-foreground size-12" aria-hidden />
          <p className="text-muted-foreground max-w-64 text-sm">
            {t("features.studio.projects.empty")}
          </p>
        </div>
      ) : (
        <>
          <ul className="grid gap-2 lg:grid-cols-2 lg:gap-3 xl:grid-cols-3">
            {projects.data.map((project) => (
              <ProjectCard
                key={project.uuid}
                project={project}
                now={now}
                onOpen={open}
                onMenu={setMenuFor}
              />
            ))}
          </ul>
          <div ref={sentinel} className="flex h-10 items-center justify-center">
            {isFetchingNextPage && (
              <Loader2 className="text-muted-foreground size-5 animate-spin" />
            )}
          </div>
        </>
      )}

      <ProjectTitleSheet
        open={naming !== null}
        onOpenChange={(isOpen) => !isOpen && setNaming(null)}
        mode={naming?.mode ?? "create"}
        initialTitle={
          naming?.mode === "rename"
            ? naming.project.title
            : t("features.studio.projects.naming.default")
        }
        pending={create.isPending || rename.isPending}
        onSubmit={submitName}
      />
      <ProjectActionsSheet
        project={menuFor}
        onClose={() => setMenuFor(null)}
        onRename={(project) => {
          setMenuFor(null);
          setNaming({ mode: "rename", project });
        }}
        onDelete={(project) =>
          remove.mutate(project.uuid, { onSettled: () => setMenuFor(null) })
        }
        deleting={remove.isPending}
      />
    </StudioScreen>
  );
};
