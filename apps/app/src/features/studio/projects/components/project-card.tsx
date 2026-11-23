import type { FC } from "react";
import { Clapperboard, MoreVertical } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import type { ProjectSummary } from "../model/project";
import {
  daysLeft,
  EXPIRY_WARNING_DAYS,
  relativeTime,
} from "../model/project-time";

interface ProjectCardProps {
  project: ProjectSummary;
  now: number;
  onOpen: (project: ProjectSummary) => void;
  onMenu: (project: ProjectSummary) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  now,
  onOpen,
  onMenu,
}) => {
  const { t } = useAppTranslate();
  const days = daysLeft(project.expire_at, now);
  const warning = days <= EXPIRY_WARNING_DAYS;

  return (
    <li className="hover-capable:hover:border-primary/40 flex items-center gap-1 rounded-2xl border bg-card p-1.5 transition-colors">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="flex min-h-16 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl p-1.5 text-start transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]"
      >
        <span className="flex aspect-[9/16] h-14 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Clapperboard className="size-5" aria-hidden />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-sm font-semibold">
            {project.title}
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{relativeTime(project.updated_at, now)}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5",
                warning
                  ? "bg-destructive/15 text-destructive"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {t("features.studio.projects.daysLeft", {
                days: days.toLocaleString("fa-IR"),
              })}
            </span>
          </span>
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 rounded-full"
        aria-label={t("features.studio.projects.actions.menuLabel", {
          title: project.title,
        })}
        onClick={() => onMenu(project)}
      >
        <MoreVertical className="size-5" />
      </Button>
    </li>
  );
};
