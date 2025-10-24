import { useEffect, useState, type FC } from 'react';
import { Outlet } from 'react-router';
import { useImmerAtom } from 'jotai-immer';
import { useAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import { useReactQueryApi } from '@/hook/app';
import { appEventBus } from '@/lib/event-bus';
import appLayoutAtom from '@/pages/(app)/_layout/_state';
import { APP_ROUTES_KEY } from '@/router';

const DEFAULT_PAGE_SIZE = 10;
const sidebarHistoryChatsAllItemsFetchedAtom = selectAtom(
  appLayoutAtom,
  (val) => val.sidebarHistoryChats.AllItemsFetched,
);

const GenerationImageLayout: FC = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const reactQueryApi = useReactQueryApi();
  const [allItemsFetched] = useAtom(sidebarHistoryChatsAllItemsFetchedAtom);

  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);

  const getAllImages = reactQueryApi.useQuery(
    'get',
    '/models/open-ai/images/generations/list',
    {
      params: {
        query: {
          page_size: DEFAULT_PAGE_SIZE,
          page: pageNumber,
        },
      },
    },
    {
      enabled: !allItemsFetched,
    },
  );

  // init
  useEffect(() => {
    setAppLayoutState((draft) => {
      draft.sidebarHistoryChats.isLoading = false;
      draft.sidebarHistoryChats.isError = false;
      draft.sidebarHistoryChats.list = [];
    });
  }, [setAppLayoutState]);

  //   update data
  useEffect(() => {
    const totalDataFetchLength =
      ((getAllImages.data?.page ?? 0) + 1) * (getAllImages.data?.page_size ?? DEFAULT_PAGE_SIZE);

    if (getAllImages.data) {
      const newList: { title: string; id: string; link: string }[] = [];
      getAllImages.data.chats.forEach((item) => {
        newList.push({
          id: item.chat_id,
          link: APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', item.chat_id),
          title: item.prompt,
        });
      });
      setAppLayoutState((draft) => {
        draft.sidebarHistoryChats.list = [...draft.sidebarHistoryChats.list, ...newList];
        draft.sidebarHistoryChats.AllItemsFetched =
          totalDataFetchLength >= getAllImages.data.total_count;
      });
    }
  }, [getAllImages.data, setAppLayoutState]);

  // update state
  useEffect(() => {
    setAppLayoutState((draft) => {
      draft.sidebarHistoryChats.isLoading = getAllImages.isLoading;
      draft.sidebarHistoryChats.isError = getAllImages.isError;
    });
  }, [getAllImages.isError, getAllImages.isLoading, setAppLayoutState]);

  //   update when new page
  useEffect(() => {
    const appEventBusListener = appEventBus.on('SIDEBAR_REQUEST_FOR_DATA', () => {
      setPageNumber((pre) => pre + 1);
    });
    return () => {
      appEventBusListener();
    };
  }, [setPageNumber]);

  return <Outlet />;
};

export default GenerationImageLayout;
