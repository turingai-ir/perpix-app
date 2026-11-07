import { CircleCheck, CircleDashed, CircleX, Image, Video } from "lucide-react";
import { Link } from "react-router";
import {
  DATA_ICON_CLASS,
  DATA_ROW_CLASS,
  EMPTY_STATE_CLASS,
  GLASS_PANEL_CLASS,
} from "./dashboard-styles";
import { DashboardSectionHeader } from "./dashboard-parts";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate } from "@/shared/hooks";
import { dayjs } from "@/shared/lib/dayjs";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import type { SchemaAiTaskResponse } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

interface DashboardActivityProps {
  isLoading: boolean;
  tasks: SchemaAiTaskResponse[];
}

const statusStyles = {
  FAILED: { Icon: CircleX, className: "text-destructive" },
  IN_PROGRESS: {
    Icon: CircleDashed,
    className: "animate-spin text-(--video-accent)",
  },
  PENDING: { Icon: CircleDashed, className: "text-warning" },
  SUCCESS: { Icon: CircleCheck, className: "text-accent-emerald" },
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
      className={GLASS_PANEL_CLASS}
      data-dashboard-panel
    >
      <DashboardSectionHeader
        eyebrow={t("pages.root.dashboard.activity.eyebrow")}
        title={t("pages.root.dashboard.activity.title")}
        titleId="activity-heading"
        tone="blue"
      />
      <div className="grid gap-1">
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
              <Link key={task.uuid} to={path} className={DATA_ROW_CLASS}>
                <span className={cn(DATA_ICON_CLASS, "size-10 rounded-xl")}>
                  <MediaIcon className="text-foreground/80 size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-foreground block text-sm font-medium">
                    {isVideo
                      ? t("pages.root.dashboard.activity.video")
                      : t("pages.root.dashboard.activity.image")}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block text-xs">
                    {dayjs(task.created_at)
                      .calendar("jalali")
                      .locale("fa")
                      .format("YYYY/MM/DD · HH:mm")}
                  </span>
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Icon className={`h-4 w-4 ${className}`} />
                  {t(`common.taskStatus.${getStatusTranslationKey(status)}`)}
                </span>
              </Link>
            );
          })
        ) : (
          <p className={EMPTY_STATE_CLASS}>
            {t("pages.root.dashboard.activity.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
