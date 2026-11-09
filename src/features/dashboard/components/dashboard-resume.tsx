import { ArrowUpLeft, CircleDashed, Image, Video } from "lucide-react";
import { Link } from "react-router";
import { RESUME_CARD_CLASS } from "../model/dashboard-styles";

import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import type { SchemaAiTaskResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

interface DashboardResumeProps {
  task?: SchemaAiTaskResponse;
}

export function DashboardResume({ task }: DashboardResumeProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  if (!task) return null;
  const isVideo = task.task_type === "VIDEO";
  const MediaIcon = isVideo ? Video : Image;
  const path = `${
    isVideo
      ? APP_ROUTES_KEY.generation.video.path
      : APP_ROUTES_KEY.generation.image.path
  }/${task.uuid}`;
  const status =
    task.messages[task.messages.length - 1]?.task_status ?? "PENDING";
  const isActive = status === "PENDING" || status === "IN_PROGRESS";

  return (
    <Link to={path} className={RESUME_CARD_CLASS}>
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-(--image-accent-soft) to-transparent text-(--image-accent)">
        <MediaIcon className="h-5 w-5" aria-hidden="true" />
        {isActive ? (
          <CircleDashed
            className="absolute -end-1 -top-1 h-4 w-4 animate-spin text-(--video-accent)"
            aria-hidden="true"
          />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-(--image-accent)">
          {t("pages.root.dashboard.resume.eyebrow")}
        </span>
        <span className="text-foreground mt-1 block truncate text-sm font-semibold sm:text-base">
          {t(`pages.root.dashboard.resume.${isVideo ? "video" : "image"}`)}
        </span>
      </span>
      <span className="text-muted-foreground hidden text-xs sm:block">
        {t(`common.taskStatus.${resolveStatusKey(status)}`)}
      </span>
      <ArrowUpLeft
        className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition group-hover:-translate-x-1 group-hover:translate-y-1"
        aria-hidden="true"
      />
    </Link>
  );
}

function resolveStatusKey(status: string) {
  if (status === "SUCCESS") return "completed";
  if (status === "FAILED") return "failed";
  return "inProgress";
}
