import { useEffect, type FC } from 'react';
import { Outlet } from 'react-router';
import { useImmerAtom } from 'jotai-immer';
import { useAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import { useReactQueryApi } from '@/hook/app';
import { appEventBus } from '@/lib/event-bus';
import appLayoutAtom from '@/pages/(app)/_layout/_state';
import { APP_ROUTES_KEY } from '@/router';
import {
  AiRegistryModelSupportedTypesEnumMap,
  AiTaskRuleEnumMap,
  type SchemaAiTaskListResponse,
  type SchemaAiTaskResponse,
} from '@/services/api';

const DEFAULT_PAGE_SIZE = 50;
const normalizeList = <T,>(value: unknown): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

const sidebarHistoryChatsAllItemsFetchedAtom = selectAtom(
  appLayoutAtom,
  (val) => val.sidebarHistoryChats.AllItemsFetched,
);

const GenerationVideoLayout: FC = () => {
  const reactQueryApi = useReactQueryApi();
  const [allItemsFetched] = useAtom(sidebarHistoryChatsAllItemsFetchedAtom);
  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);

  const sessionHistoryQuery = reactQueryApi.useInfiniteQuery(
    'get',
    '/ai-task/list',
    {
      params: {
        query: {
          offset: 0,
          limit: DEFAULT_PAGE_SIZE,
        },
      },
    },
    {
      enabled: !allItemsFetched,
      initialPageParam: 0,
      pageParamName: 'offset',
      getNextPageParam: (lastPage, pages) =>
        lastPage.has_next ? pages.length * DEFAULT_PAGE_SIZE : undefined,
    },
  );
  const {
    data: sessionHistoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: sessionHistoryIsError,
    isLoading: sessionHistoryIsLoading,
    refetch: refetchSessionHistory,
  } = sessionHistoryQuery;
  const hasSessionHistory = !!sessionHistoryData?.pages?.length;

  // init
  useEffect(() => {
    setAppLayoutState((draft) => {
      draft.sidebarHistoryChats.isLoading = false;
      draft.sidebarHistoryChats.isError = false;
      draft.sidebarHistoryChats.list = [];
      draft.sidebarHistoryChats.AllItemsFetched = false;
    });
  }, [setAppLayoutState]);

  //   update data
  useEffect(() => {
    const pages = normalizeList<SchemaAiTaskListResponse>(sessionHistoryData?.pages);
    const sessions = pages
      .flatMap((page) => normalizeList<SchemaAiTaskResponse>(page.items))
      .filter((item) => item.task_type === AiRegistryModelSupportedTypesEnumMap.VIDEO);
    const lastPage = pages[pages.length - 1];
    const newList = sessions.map((item) => {
      const lastMessage = item.messages[item.messages.length - 1];

      return {
        id: item.uuid,
        link: APP_ROUTES_KEY.generation.video.history.path.replace(':chatId', item.uuid),
        title:
          item.messages.find((message) => message.role === AiTaskRuleEnumMap.USER)?.message ??
          lastMessage?.message ??
          '',
      };
    });

    setAppLayoutState((draft) => {
      const prevList = draft.sidebarHistoryChats.list;
      const newLastId = newList[newList.length - 1]?.id;
      const prevLastId = prevList[prevList.length - 1]?.id;

      if (prevList.length !== newList.length || newLastId !== prevLastId) {
        draft.sidebarHistoryChats.list = newList;
      }
      draft.sidebarHistoryChats.AllItemsFetched = lastPage ? !lastPage.has_next : false;
    });
  }, [sessionHistoryData, setAppLayoutState]);

  // update state
  useEffect(() => {
    setAppLayoutState((draft) => {
      draft.sidebarHistoryChats.isLoading = sessionHistoryIsLoading || isFetchingNextPage;
      draft.sidebarHistoryChats.isError = sessionHistoryIsError;
    });
  }, [isFetchingNextPage, sessionHistoryIsError, sessionHistoryIsLoading, setAppLayoutState]);

  //   update when new page
  useEffect(() => {
    const appEventBusListener = appEventBus.on('SIDEBAR_REQUEST_FOR_DATA', () => {
      if (hasSessionHistory) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
        return;
      }

      if (!sessionHistoryIsLoading) {
        refetchSessionHistory();
      }
    });
    return () => {
      appEventBusListener();
    };
  }, [
    fetchNextPage,
    hasSessionHistory,
    hasNextPage,
    isFetchingNextPage,
    refetchSessionHistory,
    sessionHistoryIsLoading,
  ]);

  return <Outlet />;
};

export default GenerationVideoLayout;
