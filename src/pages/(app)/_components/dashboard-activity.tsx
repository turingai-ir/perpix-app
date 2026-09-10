import { CircleCheck, CircleDashed, CircleX, Image, Video } from "lucide-react";
import { Link } from "react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import { APP_ROUTES_KEY } from "@/router/routes";
import type { SchemaAiTaskResponse } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardActivityProps {
  isLoading: boolean;
  tasks: SchemaAiTaskResponse[];
}

const statusStyles = {
  FAILED: { Icon: CircleX, className: "text-red-400" },
  IN_PROGRESS: { Icon: CircleDashed, className: "animate-spin text-blue-400" },
  PENDING: { Icon: CircleDashed, className: "text-amber-400" },
  SUCCESS: { Icon: CircleCheck, className: "text-emerald-400" },
};

const getStatusTranslationKey = (status: keyof typeof statusStyles) => {
  if (status === "SUCCESS") return "completed";
  if (status === "FAILED") return "failed";
  return "inProgress";
};

export function DashboardActivity({
  isLoading,
  tasks,
}: DashboardActivityProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  if (isLoading) return <Skeleton className="h-80 w-full rounded-2xl" />;

  return (
    <section
      aria-labelledby="activity-heading"
      className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5"
    >
      <div className="mb-4">
        <p className="text-xs text-blue-300">
          {t("pages.root.dashboard.activity.eyebrow")}
        </p>
        <h2
          id="activity-heading"
          className="mt-1 text-lg font-semibold text-white"
        >
          {t("pages.root.dashboard.activity.title")}
        </h2>
      </div>
      <div className="space-y-1">
        {tasks.length ? (
          tasks.map((task) => {
            const lastMessage = task.messages[task.messages.length - 1];
            const status: keyof typeof statusStyles =
              lastMessage?.task_status ?? "PENDING";
            const { Icon, className } = statusStyles[status];
            const isVideo = task.task_type === "VIDEO";
            const MediaIcon = isVideo ? Video : Image;
            const path = `${isVideo ? APP_ROUTES_KEY.generation.video.path : APP_ROUTES_KEY.generation.image.path}/${task.uuid}`;
            return (
              <Link
                key={task.uuid}
                to={path}
                className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition duration-300 hover:border-white/8 hover:bg-white/[0.055] focus-visible:outline-2 focus-visible:outline-fuchsia-400"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.08] to-transparent transition group-hover:border-fuchsia-300/20">
                  <MediaIcon className="h-4 w-4 text-zinc-300" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-white">
                    {isVideo
                      ? t("pages.root.dashboard.activity.video")
                      : t("pages.root.dashboard.activity.image")}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {dayjs(task.created_at)
                      .calendar("jalali")
                      .locale("fa")
                      .format("YYYY/MM/DD · HH:mm")}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Icon className={`h-4 w-4 ${className}`} />
                  {t(`common.taskStatus.${getStatusTranslationKey(status)}`)}
                </span>
              </Link>
            );
          })
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
            {t("pages.root.dashboard.activity.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
