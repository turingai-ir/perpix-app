import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { ChevronDown, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";

import ErrorSection from "@/shared/components/error-section";
import LoadingSection from "@/shared/components/loading-section";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatLocalizedNumber } from "@/shared/utils";
import { AI_TASKS_PAGE_SIZE, useAiTasksList } from "@/features/generation";
import HistoryItem from "./history-item";
import { IconTile } from "./sidebar-parts";
import { Button } from "@/shared/ui/button";

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
      className="border-foreground/8 bg-sidebar-accent/42 relative overflow-hidden rounded-3xl border p-2 shadow-[inset_0_1px_rgb(255_255_255/8%),0_12px_32px_rgb(0_0_0/10%)]"
      aria-labelledby="sidebar-history-heading"
    >
      <header className="flex items-center justify-between px-2 pt-2 pb-3">
        <h2
          id="sidebar-history-heading"
          className="text-sidebar-foreground/90 flex items-center gap-2 text-xs font-bold tracking-tight"
        >
          <Sparkles
            aria-hidden="true"
            className="text-primary size-3.5 drop-shadow-[0_0_0.4rem_var(--primary)]"
          />
          {t("pages.app.layout.sidebar.history.title")}
        </h2>
        <span
          className="border-foreground/8 bg-foreground/4 text-sidebar-foreground/55 min-w-6 rounded-full border px-1.5 py-0.5 text-center text-xs leading-tight"
          aria-hidden="true"
        >
          {total}
        </span>
      </header>
      <ul
        id="sidebar-history-list"
        className="group/list m-0 flex min-w-0 list-none flex-col gap-1 p-0"
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
        <p className="text-sidebar-foreground/65 px-2 py-3 text-center text-xs leading-loose">
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
        <div className="border-foreground/8 mt-2 border-t pt-2">
          {isFetchNextPageError && (
            <p
              role="alert"
              className="text-destructive mb-2 text-xs leading-relaxed"
            >
              {t("pages.app.layout.sidebar.history.loadError")}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="border-primary/25 from-primary/13 text-sidebar-foreground w-full gap-2.5 rounded-xl bg-linear-110 to-(--video-accent-soft) text-xs font-semibold aria-disabled:cursor-wait aria-disabled:opacity-65"
            aria-controls="sidebar-history-list"
            aria-disabled={isFetchingNextPage}
            onClick={(event) => {
              setAnimateEntry(event.detail > 0);
              if (!isFetchingNextPage) void fetchNextPage();
            }}
          >
            <IconTile className="bg-primary/10 text-primary size-6 rounded-full border-0">
              <ButtonIcon
                aria-hidden="true"
                className={
                  isFetchingNextPage
                    ? "animate-spin motion-reduce:animate-none"
                    : undefined
                }
              />
            </IconTile>
            <span>{buttonLabel}</span>
          </Button>
        </div>
      )}
      <p className="sr-only" role="status">
        {!isLoading && t("pages.app.layout.sidebar.history.shown", { total })}
      </p>
    </section>
  );
}
