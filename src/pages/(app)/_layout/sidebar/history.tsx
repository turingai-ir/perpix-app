import { Activity, useCallback, useMemo, type FC } from "react";
import { NavLink, useLocation } from "react-router";
import { Clock3, Image, Sparkles, Video } from "lucide-react";

import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";
import { useAppTranslate, useInfiniteScroll } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";

import { useAiTasksList } from "@/pages/(app)/generation/_hooks";
import styles from "./sidebar.module.css";

const HISTORY_TITLE_MAX_LENGTH = 50;

const AppLayoutSidebarHistory: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const location = useLocation();
  const pathname = location.pathname;

  const taskType = useMemo(() => {
    if (pathname.includes(APP_ROUTES_KEY.generation.image.path)) {
      return AiRegistryModelSupportedTypesEnumMap.IMAGE;
    }

    if (pathname.includes(APP_ROUTES_KEY.generation.video.path)) {
      return AiRegistryModelSupportedTypesEnumMap.VIDEO;
    }

    return undefined;
  }, [pathname]);

  const { aiTasksListStatus } = useAiTasksList(taskType);
  const {
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    data,
  } = aiTasksListStatus;

  const getHistoryHref = useCallback(
    (id: string) => {
      if (taskType === AiRegistryModelSupportedTypesEnumMap.IMAGE) {
        return APP_ROUTES_KEY.generation.image.history.path.replace(
          ":chatId",
          id,
        );
      }

      if (taskType === AiRegistryModelSupportedTypesEnumMap.VIDEO) {
        return APP_ROUTES_KEY.generation.video.history.path.replace(
          ":chatId",
          id,
        );
      }

      return APP_ROUTES_KEY.app.path;
    },
    [taskType],
  );

  const historyItems = useMemo(
    () => data?.pages.flatMap((page) => Array.from(page?.items ?? [])) ?? [],
    [data?.pages],
  );

  const getHistoryTitle = useCallback(
    (message?: string | null) => {
      const title = message?.trim();

      if (!title) {
        return t("common.emptyTitle");
      }

      return title.substring(0, HISTORY_TITLE_MAX_LENGTH);
    },
    [t],
  );

  const triggerMoreData = useCallback(() => {
    if (hasNextPage && !isLoading && !isFetchingNextPage && !isError) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading]);

  const scrollRef = useInfiniteScroll<HTMLDivElement>({
    offset: 500,
    disabled: !hasNextPage || isError,
    loading: isLoading || isFetchingNextPage,
    onTrigger: triggerMoreData,
  });

  const formatHistoryDate = useCallback((value: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "short",
    }).format(new Date(value));
  }, []);

  if (!taskType) {
    return null;
  }

  return (
    <section
      className={styles.historyPanel}
      aria-labelledby="sidebar-history-heading"
    >
      <header className={styles.historyHeader}>
        <h2 id="sidebar-history-heading" className={styles.historyHeading}>
          <Sparkles aria-hidden="true" />
          {t("pages.app.layout.sidebar.history.title")}
        </h2>
        <span className={styles.historyCount} aria-hidden="true">
          {formatLocalizedNumber({ value: historyItems.length })}
        </span>
      </header>
      <Activity
        mode={
          aiTasksListStatus.isLoading && !historyItems.length
            ? "hidden"
            : "visible"
        }
      >
        <div className={styles.historyList}>
          {historyItems.map((item) => {
            const isVideo =
              item.task_type === AiRegistryModelSupportedTypesEnumMap.VIDEO;
            const ItemIcon = isVideo ? Video : Image;

            return (
              <NavLink
                key={item.uuid}
                to={getHistoryHref(item.uuid)}
                className={styles.historyItem}
                data-sidebar-history-item
              >
                <span className={styles.historyIcon} aria-hidden="true">
                  <ItemIcon />
                </span>
                <span className={styles.historyCopy}>
                  <span className={styles.historyTitle}>
                    {getHistoryTitle(item.messages?.[0]?.message)}
                  </span>
                  <span className={styles.historyMeta}>
                    <Clock3 aria-hidden="true" />
                    <time dateTime={item.updated_at}>
                      {formatHistoryDate(item.updated_at)}
                    </time>
                  </span>
                </span>
                <span className={styles.historyArrow} aria-hidden="true">
                  ‹
                </span>
              </NavLink>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </Activity>
      {aiTasksListStatus.isLoading ? (
        <div className="flex w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}
      {aiTasksListStatus.isError ? (
        <ErrorSection
          onRetry={() => {
            aiTasksListStatus.refetch();
          }}
        />
      ) : null}
    </section>
  );
};

export default AppLayoutSidebarHistory;
