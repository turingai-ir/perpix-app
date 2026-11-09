import { ChevronLeft, Clock3, Image, Video } from "lucide-react";
import { NavLink } from "react-router";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskResponse,
} from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { IconTile } from "./sidebar-parts";

const historyDate = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "short",
});

type HistoryItemProps = {
  item: Pick<SchemaAiTaskResponse, "uuid" | "task_type" | "updated_at">;
  message?: string | null;
};

export default function HistoryItem({ item, message }: HistoryItemProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const isVideo = item.task_type === AiRegistryModelSupportedTypesEnumMap.VIDEO;
  const ItemIcon = isVideo ? Video : Image;
  const historyPath = isVideo
    ? APP_ROUTES_KEY.generation.video.history.path
    : APP_ROUTES_KEY.generation.image.history.path;
  const title =
    message?.trim().substring(0, 50) ||
    t("pages.app.layout.sidebar.history.emptyTitle");
  return (
    <li className="ease-out-quint translate-y-0 opacity-100 transition-[opacity,transform] duration-200 group-data-[entry-motion=false]/list:transition-none nth-[5n+2]:delay-30 nth-[5n+3]:delay-60 nth-[5n+4]:delay-100 nth-[5n+5]:delay-[120ms] motion-reduce:transition-opacity motion-reduce:delay-0 starting:translate-y-1.5 starting:opacity-0 motion-reduce:starting:translate-y-0">
      <NavLink
        to={historyPath.replace(":chatId", item.uuid)}
        className="group/item text-sidebar-foreground/80 ease-out-quint hover-capable:hover:-translate-x-0.5 hover-capable:hover:border-foreground/10 hover-capable:hover:bg-linear-110 hover-capable:hover:from-foreground/8 hover-capable:hover:to-foreground/3 hover-capable:hover:text-sidebar-foreground focus-visible:text-sidebar-foreground focus-visible:outline-primary aria-[current=page]:border-primary/20 aria-[current=page]:text-sidebar-foreground relative grid min-h-14 min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_0.875rem] items-center gap-2.5 overflow-hidden rounded-2xl border border-transparent px-2 py-2 transition-transform duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 aria-[current=page]:bg-linear-110 aria-[current=page]:from-(--image-accent-soft) aria-[current=page]:to-(--video-accent-soft) aria-[current=page]:shadow-[inset_-2px_0_var(--image-accent)] motion-reduce:transition-none motion-reduce:hover:translate-x-0"
        data-sidebar-history-item
      >
        <IconTile
          className="border-foreground/10 from-foreground/9 to-foreground/3 text-primary size-9 rounded-xl bg-linear-[145deg] shadow-[inset_0_1px_rgb(255_255_255/10%),0_6px_16px_rgb(0_0_0/14%)]"
          aria-hidden="true"
        >
          <ItemIcon />
        </IconTile>
        <span className="min-w-0">
          <span className="block truncate text-xs leading-relaxed font-semibold">
            {title}
          </span>
          <span className="text-sidebar-foreground/60 mt-px flex items-center gap-1 text-xs tabular-nums">
            <Clock3 aria-hidden="true" className="size-3 flex-none" />
            <time dateTime={item.updated_at}>
              {historyDate.format(new Date(item.updated_at))}
            </time>
          </span>
        </span>
        <ChevronLeft
          className="text-sidebar-foreground/30 ease-out-quint group-hover/item:text-primary size-3.5 flex-none transition-transform duration-150 group-hover/item:-translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </NavLink>
    </li>
  );
}
