import { Button, Flex, Loader, ScrollArea, Text } from '@mantine/core';
import { TbSquareRoundedPlus } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router';
import { parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { useInViewport, useThrottledCallback } from '@mantine/hooks';
import { useEffect, type FC } from 'react';
import { useAtom } from 'jotai';

import { textLayoutState, textPageState } from '../../_state';

import { useAppTranslate } from '@/hook';
import { ROUTES_KEY } from '@/router';
import { useReactQueryApi } from '@/hook/app';
import {
  apiClinet,
  OPEN_AI_TEXT_MODELS,
  type SchemaOpenAiChatCompletionCreateResponse,
} from '@/services/api';

function categorizeChats(chats: SchemaOpenAiChatCompletionCreateResponse[]) {
  const categories: {
    today: SchemaOpenAiChatCompletionCreateResponse[];
    yesterday: SchemaOpenAiChatCompletionCreateResponse[];
    thisWeek: SchemaOpenAiChatCompletionCreateResponse[];
    thisMonth: SchemaOpenAiChatCompletionCreateResponse[];
    older: SchemaOpenAiChatCompletionCreateResponse[];
  } = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    older: [],
  };

  for (const chat of chats) {
    const createdAt = parseISO(chat.created_at ?? new Date().toISOString());

    if (isToday(createdAt)) {
      categories.today.push(chat);
    } else if (isYesterday(createdAt)) {
      categories.yesterday.push(chat);
    } else if (isThisWeek(createdAt, { weekStartsOn: 0 })) {
      categories.thisWeek.push(chat);
    } else if (isThisMonth(createdAt)) {
      categories.thisMonth.push(chat);
    } else {
      categories.older.push(chat);
    }
  }

  return categories;
}

interface AsideProps {
  onClose: () => void;
}
const Aside: FC<AsideProps> = ({ onClose }) => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const reactQueryApi = useReactQueryApi();
  const [, setPageState] = useAtom(textPageState);
  const [, setState] = useAtom(textLayoutState);

  const params = useParams();

  const chatsList = reactQueryApi.useInfiniteQuery(
    'get',
    '/open-aichat-completion/list',
    {
      params: {
        query: {
          page_number: 1,
          page_size: 30,
        },
      },
    },
    {
      queryFn: async ({ pageParam = 1 }) => {
        const response = await apiClinet.GET('/open-aichat-completion/list', {
          params: {
            query: {
              page_number: pageParam,
              page_size: 30,
            },
          },
        });
        return {
          chats: response.data?.chats,
          total: response.data?.total,
          page: pageParam,
        };
      },
      getNextPageParam: (lastPage, allPages) => {
        const itemsFetched = allPages.reduce((sum, page) => sum + (page.chats?.length ?? 0), 0);
        const totalItems = lastPage.total;

        return itemsFetched < totalItems
          ? (lastPage as unknown as { page: number }).page + 1
          : undefined;
      },
      initialPageParam: 1,
      staleTime: 0,
      cacheTime: 0,
    },
  );

  const categorizedChat = categorizeChats(
    chatsList.data?.pages
      .map((i) => i.chats)
      .flat()
      .filter(
        (chat): chat is SchemaOpenAiChatCompletionCreateResponse =>
          chat !== null && chat !== undefined,
      ) ?? [],
  );

  const { ref, inViewport } = useInViewport();

  // 3. Throttled side-effect (200 ms)
  const trigger = useThrottledCallback(() => {
    chatsList.fetchNextPage();
  }, 2000);

  useEffect(() => {
    if (inViewport) {
      trigger();
    }
  }, [inViewport, trigger]);

  const handleNewChat = () => {
    setPageState((draft) => {
      if (draft.conversions.length === 1 && !params.id) {
        draft.conversions = [];
      }
    });
    setState((draft) => {
      draft.currentModel = OPEN_AI_TEXT_MODELS.gpt_3_5_turbo;
    });
    navigate(ROUTES_KEY.text.root.path);
    onClose();
  };

  const handleSelectChat = (chatId: string) => {
    navigate(ROUTES_KEY.text.chat.path.replace(':id', chatId));
    onClose();
  };
  return (
    <ScrollArea className="tw-h-full">
      <Flex direction="column" gap="lg" className="tw-w-full tw-h-full">
        <Button
          onClick={() => {
            handleNewChat();
          }}
          color="dark"
          radius="xl"
          justify="start"
          variant="subtle"
          type="button"
        >
          <Flex justify="start" className="tw-w-full" gap="xs" align="center">
            <TbSquareRoundedPlus />
            {t('pages.text.aside.newChat')}
          </Flex>
        </Button>
        <Flex direction="column" className="tw-w-full" gap="md">
          {categorizedChat.today.length ? (
            <Flex direction="column" className="tw-w-full" gap="xs">
              <Text c="gray"> {t('common.today')}</Text>
              <Flex direction="column" className="tw-w-full" gap="xs">
                {categorizedChat.today.map((item) => (
                  <Button
                    key={item.chat_id}
                    onClick={() => {
                      handleSelectChat(item.chat_id);
                    }}
                    color="dark"
                    radius="xl"
                    justify="start"
                    variant={params.id === item.chat_id ? 'light' : 'subtle'}
                    type="button"
                  >
                    <Flex justify="start" className="tw-w-full" gap="xs" align="center">
                      {item.messages[0].content.length > 30
                        ? `${item.messages[0].content.substring(0, 30)} ...`
                        : item.messages[0].content}
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
          {categorizedChat.yesterday.length ? (
            <Flex direction="column" className="tw-w-full" gap="xs">
              <Text c="gray"> {t('common.yesterday')}</Text>
              <Flex direction="column" className="tw-w-full" gap="xs">
                {categorizedChat.yesterday.map((item) => (
                  <Button
                    key={item.chat_id}
                    onClick={() => {
                      handleSelectChat(item.chat_id);
                    }}
                    color="dark"
                    radius="xl"
                    justify="start"
                    variant={params.id === item.chat_id ? 'light' : 'subtle'}
                    type="button"
                  >
                    <Flex justify="start" className="tw-w-full" gap="xs" align="center">
                      {item.messages[0].content.length > 30
                        ? `${item.messages[0].content.substring(0, 30)} ...`
                        : item.messages[0].content}
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
          {categorizedChat.thisWeek.length ? (
            <Flex direction="column" className="tw-w-full" gap="xs">
              <Text c="gray"> {t('common.thisWeek')}</Text>
              <Flex direction="column" className="tw-w-full" gap="xs">
                {categorizedChat.thisWeek.map((item) => (
                  <Button
                    key={item.chat_id}
                    onClick={() => {
                      handleSelectChat(item.chat_id);
                    }}
                    color="dark"
                    radius="xl"
                    justify="start"
                    variant={params.id === item.chat_id ? 'light' : 'subtle'}
                    type="button"
                  >
                    <Flex justify="start" className="tw-w-full" gap="xs" align="center">
                      {item.messages[0].content.length > 30
                        ? `${item.messages[0].content.substring(0, 30)} ...`
                        : item.messages[0].content}
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
          {categorizedChat.thisMonth.length ? (
            <Flex direction="column" className="tw-w-full" gap="xs">
              <Text c="gray"> {t('common.thisMonth')}</Text>
              <Flex direction="column" className="tw-w-full" gap="xs">
                {categorizedChat.thisMonth.map((item) => (
                  <Button
                    key={item.chat_id}
                    onClick={() => {
                      handleSelectChat(item.chat_id);
                    }}
                    color="dark"
                    radius="xl"
                    justify="start"
                    variant={params.id === item.chat_id ? 'light' : 'subtle'}
                    type="button"
                  >
                    <Flex justify="start" className="tw-w-full" gap="xs" align="center">
                      {item.messages[0].content.length > 30
                        ? `${item.messages[0].content.substring(0, 30)} ...`
                        : item.messages[0].content}
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
          {categorizedChat.older.length ? (
            <Flex direction="column" className="tw-w-full" gap="xs">
              <Text c="gray"> {t('common.older')}</Text>
              <Flex direction="column" className="tw-w-full" gap="xs">
                {categorizedChat.older.map((item) => (
                  <Button
                    key={item.chat_id}
                    onClick={() => {
                      handleSelectChat(item.chat_id);
                    }}
                    color="dark"
                    radius="xl"
                    justify="start"
                    variant={params.id === item.chat_id ? 'light' : 'subtle'}
                    type="button"
                  >
                    <Flex justify="start" className="tw-w-full" gap="xs" align="center">
                      {item.messages[0].content.length > 30
                        ? `${item.messages[0].content.substring(0, 30)} ...`
                        : item.messages[0].content}
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      {chatsList.isLoading || chatsList.isError || !chatsList.hasNextPage ? null : (
        <Flex ref={ref} justify="center" className="tw-mt-6">
          <Loader size="xs" color="gray" />
        </Flex>
      )}
    </ScrollArea>
  );
};
export default Aside;
