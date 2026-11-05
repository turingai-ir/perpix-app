import { ChevronLeft, Clock3, Image, Video } from "lucide-react";
import { NavLink } from "react-router";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskResponse,
} from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "./sidebar.module.css";

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
    <li className={styles.historyRow}>
      <NavLink
        to={historyPath.replace(":chatId", item.uuid)}
        className={styles.historyItem}
        data-sidebar-history-item
      >
        <span className={styles.historyIcon} aria-hidden="true">
          <ItemIcon />
        </span>
        <span className={styles.historyCopy}>
          <span className={styles.historyTitle}>{title}</span>
          <span className={styles.historyMeta}>
            <Clock3 aria-hidden="true" />
            <time dateTime={item.updated_at}>
              {historyDate.format(new Date(item.updated_at))}
            </time>
          </span>
        </span>
        <ChevronLeft className={styles.historyArrow} aria-hidden="true" />
      </NavLink>
    </li>
  );
}
