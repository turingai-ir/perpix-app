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
  AiModelSupportedTaskTypeEnum,
  type SchemaAiChatSessionHistoryResponse,
  type SchemaAiChatSessionSummary,
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

const GenerationImageLayout: FC = () => {
  const reactQueryApi = useReactQueryApi();
  const [allItemsFetched] = useAtom(sidebarHistoryChatsAllItemsFetchedAtom);
  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);

  const sessionHistoryQuery = reactQueryApi.useInfiniteQuery(
    'get',
    '/ai/session-history',
    {
      params: {
        query: {
          limit: DEFAULT_PAGE_SIZE,
          task_type: AiModelSupportedTaskTypeEnum.IMAGE,
        },
      },
    },
    {
      enabled: !allItemsFetched,
      initialPageParam: 0,
      pageParamName: 'offset',
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length * DEFAULT_PAGE_SIZE : undefined,
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
    const pages = normalizeList<SchemaAiChatSessionHistoryResponse>(sessionHistoryData?.pages);
    const sessions = pages.flatMap((page) =>
      normalizeList<SchemaAiChatSessionSummary>(page.sessions),
    );
    const lastPage = pages[pages.length - 1];
    const newList = sessions.map((item) => ({
      id: item.uuid,
      link: APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', item.uuid),
      title: item.user_prompt ?? '',
    }));

    setAppLayoutState((draft) => {
      const prevList = draft.sidebarHistoryChats.list;
      const newLastId = newList[newList.length - 1]?.id;
      const prevLastId = prevList[prevList.length - 1]?.id;

      if (prevList.length !== newList.length || newLastId !== prevLastId) {
        draft.sidebarHistoryChats.list = newList;
      }
      draft.sidebarHistoryChats.AllItemsFetched = lastPage ? !lastPage.hasNextPage : false;
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

export default GenerationImageLayout;
