import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { ChevronDown, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";

import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";
import {
  AI_TASKS_PAGE_SIZE,
  useAiTasksList,
} from "@/pages/(app)/generation/_hooks";
import HistoryItem from "./history-item";
import styles from "./sidebar.module.css";

export default function AppLayoutSidebarHistory() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { pathname } = useLocation();
  const [animateEntry, setAnimateEntry] = useState(true);
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
    data,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isFetchNextPageError,
    isError,
    fetchNextPage,
  } = aiTasksListStatus;
  const historyItems = useMemo(() => {
    const items = data?.pages.flatMap((page) => Array.from(page.items)) ?? [];
    return Array.from(new Map(items.map((item) => [item.uuid, item])).values());
  }, [data?.pages]);
  const hasItems = historyItems.length > 0;
  const amount = formatLocalizedNumber({ value: AI_TASKS_PAGE_SIZE });
  const total = formatLocalizedNumber({ value: historyItems.length });
  let buttonLabel = t("pages.app.layout.sidebar.history.loadMore", { amount });
  let ButtonIcon = ChevronDown;
  if (isFetchingNextPage) {
    buttonLabel = t("pages.app.layout.sidebar.history.loading");
    ButtonIcon = LoaderCircle;
  } else if (isFetchNextPageError) {
    buttonLabel = t("pages.app.layout.sidebar.history.retry");
    ButtonIcon = RotateCcw;
  }
  if (!taskType) return null;

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
          {total}
        </span>
      </header>
      <ul
        id="sidebar-history-list"
        className={styles.historyList}
        data-entry-motion={animateEntry}
        aria-busy={isLoading || isFetchingNextPage}
      >
        {historyItems.map((item) => (
          <HistoryItem
            key={item.uuid}
            item={item}
            message={item.messages?.[0]?.message}
          />
        ))}
      </ul>
      {isLoading && <LoadingSection />}
      {!isLoading && !isError && !hasItems && (
        <p className={styles.historyEmpty}>
          {t("pages.app.layout.sidebar.history.empty")}
        </p>
      )}
      {isError && !hasItems && (
        <ErrorSection
          onRetry={() => {
            void aiTasksListStatus.refetch();
          }}
        />
      )}
      {hasItems && (hasNextPage || isFetchNextPageError) && (
        <div className={styles.historyFooter}>
          {isFetchNextPageError && (
            <p role="alert" className={styles.historyError}>
              {t("pages.app.layout.sidebar.history.loadError")}
            </p>
          )}
          <button
            type="button"
            className={styles.historyMore}
            aria-controls="sidebar-history-list"
            aria-disabled={isFetchingNextPage}
            data-loading={isFetchingNextPage}
            onClick={(event) => {
              setAnimateEntry(event.detail > 0);
              if (!isFetchingNextPage) void fetchNextPage();
            }}
          >
            <span className={styles.historyMoreIcon}>
              <ButtonIcon aria-hidden="true" />
            </span>
            <span>{buttonLabel}</span>
          </button>
        </div>
      )}
      <p className="sr-only" role="status">
        {!isLoading && t("pages.app.layout.sidebar.history.shown", { total })}
      </p>
    </section>
  );
}
