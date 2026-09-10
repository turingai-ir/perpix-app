import { ArrowUpLeft, CircleDashed, Image, Video } from "lucide-react";
import { Link } from "react-router";

import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import type { SchemaAiTaskResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

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
    <Link
      to={path}
      className="group flex min-h-20 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 sm:p-4"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 to-violet-600/5 text-fuchsia-200">
        <MediaIcon className="h-5 w-5" aria-hidden="true" />
        {isActive ? (
          <CircleDashed
            className="absolute -end-1 -top-1 h-4 w-4 animate-spin text-sky-300"
            aria-hidden="true"
          />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-fuchsia-200">
          {t("pages.root.dashboard.resume.eyebrow")}
        </span>
        <span className="mt-1 block truncate text-sm font-semibold text-white sm:text-base">
          {t(`pages.root.dashboard.resume.${isVideo ? "video" : "image"}`)}
        </span>
      </span>
      <span className="hidden text-xs text-zinc-400 sm:block">
        {t(`common.taskStatus.${resolveStatusKey(status)}`)}
      </span>
      <ArrowUpLeft
        className="h-5 w-5 text-zinc-500 transition group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:text-white"
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
