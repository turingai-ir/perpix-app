import { Activity, useCallback, useMemo, type FC } from "react";
import { Link, useLocation } from "react-router";

import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";
import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hook";
import { useInfiniteScroll } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

import { useAiTasksList } from "../../generation/image/_hooks";

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
    () =>
      aiTasksListStatus.data?.pages.flatMap((page) =>
        Array.from(page?.items ?? []),
      ) ?? [],
    [aiTasksListStatus.data?.pages],
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
    if (
      aiTasksListStatus.hasNextPage &&
      !aiTasksListStatus.isLoading &&
      !aiTasksListStatus.isFetchingNextPage &&
      !aiTasksListStatus.isError
    ) {
      aiTasksListStatus.fetchNextPage();
    }
  }, [
    aiTasksListStatus.fetchNextPage,
    aiTasksListStatus.hasNextPage,
    aiTasksListStatus.isError,
    aiTasksListStatus.isFetchingNextPage,
    aiTasksListStatus.isLoading,
  ]);

  const scrollRef = useInfiniteScroll<HTMLDivElement>({
    offset: 500,
    disabled: !aiTasksListStatus.hasNextPage || aiTasksListStatus.isError,
    loading:
      aiTasksListStatus.isLoading || aiTasksListStatus.isFetchingNextPage,
    onTrigger: triggerMoreData,
  });

  if (!taskType) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Activity
        mode={
          aiTasksListStatus.isLoading && !historyItems.length
            ? "hidden"
            : "visible"
        }
      >
        <div className="flex w-full flex-col gap-2">
          {historyItems.map((item) => (
            <Link key={item.uuid} to={getHistoryHref(item.uuid)}>
              <Muted>{getHistoryTitle(item.messages?.[0]?.message)}</Muted>
            </Link>
          ))}
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
    </div>
  );
};

export default AppLayoutSidebarHistory;
