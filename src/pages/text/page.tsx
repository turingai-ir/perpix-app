import { Alert, Button, Container, Flex, Loader, ScrollArea, Title } from '@mantine/core';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import { useParams } from 'react-router';

import TextPageLayout from './layout';
import SearchBox from './_components/searchbox';
import { textLayoutState, textPageState, type ConversionRole } from './_state';

import ChatBubble from '@/components/chat-bubble';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate } from '@/hook';
import { ROUTES_KEY } from '@/router';
import { MarkdownRenderer } from '@/components/markdown';
import type { OPEN_AI_TEXT_MODELS } from '@/services/api';
import { useEffect, useRef } from 'react';

const TextPage = () => {
  const [state, setState] = useAtom(textPageState);
  const { t } = useAppTranslate();
  const reactQueryApi = useReactQueryApi();
  const [layoutState] = useAtom(textLayoutState);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const createChat = reactQueryApi.useMutation('post', '/open-ai/chat-completion/create');
  const continueChat = reactQueryApi.useMutation('post', '/open-ai/chat-completion/{chat_id}');

  const params = useParams();

  const getConversion = reactQueryApi.useQuery(
    'get',
    '/open-ai/chat-completion/{chat_id}',
    {
      params: { path: { chat_id: params.id ?? '' } },
    },
    { enabled: false, retry: false },
  );

  const dataConversion = getConversion.data?.messages.filter(
    (i) => i.role === 'user' || i.role === 'assistant',
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.conversions, dataConversion]);

  const haveConversation = dataConversion?.length || state.conversions.length;

  const handleCreate = async (input: string) => {
    const res = await createChat.mutateAsync({
      body: {
        input,
        model: layoutState.currentModel as OPEN_AI_TEXT_MODELS,
        system_message: 'You are hopfull assistant, answare with markdown format',
      },
    });
    setState((draft) => {
      draft.conversions.push({
        content: res.messages[0].content,
        role: res.messages[0].role as ConversionRole,
      });
      draft.chatId = res.chat_id;
    });
    window.history.pushState({}, '', ROUTES_KEY.text.chat.path.replace(':id', res.chat_id));
  };

  const handleContinue = async (input: string) => {
    const res = await continueChat.mutateAsync({
      body: {
        model: layoutState.currentModel as OPEN_AI_TEXT_MODELS,
        input,
      },
      params: {
        path: {
          chat_id: state.chatId || (params.id ?? ''),
        },
      },
    });

    setState((draft) => {
      draft.conversions.push({
        content: res.messages[0].content,
        role: res.messages[0].role as ConversionRole,
      });
    });
  };

  const handleFinishSearchBox = async (input: string) => {
    if (!haveConversation) {
      await handleCreate(input);
    } else {
      await handleContinue(input);
    }
  };
  const handleRetryRequest = async () => {
    if (state.conversions.length === 1) {
      await handleCreate(state.conversions[0].content);
    } else {
      const usersConversion = state.conversions.filter((item) => item.role === 'user');
      await handleContinue(usersConversion[usersConversion.length - 1].content);
    }
  };

  return (
    <TextPageLayout>
      <Flex className="tw-w-full tw-relative">
        <ScrollArea className="tw-w-full">
          <Container size="lg" className="tw-w-full tw-h-full tw-py-4">
            {getConversion.isLoading ? (
              <Flex justify="center" align="center" className="tw-w-full tw-h-full tw-mt-96">
                <Loader color="gray" size="xl" type="dots" />
              </Flex>
            ) : (
              <Flex
                className="tw-h-full tw-w-full"
                direction="column"
                gap="md"
                justify={haveConversation ? undefined : 'center'}
              >
                {dataConversion?.map((item, index) => {
                  return (
                    <ChatBubble
                      key={index}
                      withBackground={item.role === 'user'}
                      className={clsx([
                        { 'lg:tw-max-w-[50%] md:tw-max-w-[70%]': item.role === 'user' },
                      ])}
                    >
                      <MarkdownRenderer content={item.content} />
                      {!state.conversions.length && index + 1 === dataConversion.length ? (
                        <div ref={bottomRef} />
                      ) : null}
                    </ChatBubble>
                  );
                })}
                {state.conversions.map((item, index) => {
                  return (
                    <ChatBubble
                      key={index}
                      withBackground={item.role === 'user'}
                      className={clsx([
                        { 'lg:tw-max-w-[50%] md:tw-max-w-[70%]': item.role === 'user' },
                      ])}
                    >
                      <MarkdownRenderer content={item.content} />
                      {index + 1 === state.conversions.length ? <div ref={bottomRef} /> : null}
                    </ChatBubble>
                  );
                })}

                {(createChat.error || continueChat.error) && state.conversions.length ? (
                  <Flex justify="center" className=" tw-w-full">
                    <Alert
                      variant="light"
                      color="red"
                      radius="xl"
                      title=""
                      className="md:tw-max-w-96 tw-w-full"
                    >
                      <Flex direction="column" gap="md" align="center">
                        {t('pages.text.apiCallError.content')}
                        <div>
                          <Button
                            onClick={handleRetryRequest}
                            loading={createChat.isPending || continueChat.isPending}
                            variant="outline"
                            color="red"
                            radius="xl"
                          >
                            {t('pages.text.apiCallError.action')}
                          </Button>
                        </div>
                      </Flex>
                    </Alert>
                  </Flex>
                ) : null}

                {haveConversation ? <div className="tw-py-16 tw-w-full " /> : null}

                <Flex
                  className={clsx([
                    {
                      ['tw-mt-auto tw-fixed tw-bottom-2 tw-w-full tw-left-0 tw-right-0']:
                        haveConversation,
                      ['tw-mt-72']: !haveConversation,
                    },
                  ])}
                  direction="column"
                  gap="md"
                >
                  {!haveConversation ? (
                    <Title className="tw-text-center" order={3}>
                      {t('pages.text.searchBox.title')}
                    </Title>
                  ) : null}

                  <SearchBox
                    onFinish={handleFinishSearchBox}
                    loading={createChat.isPending || continueChat.isPending}
                    error={createChat.isError || continueChat.isError}
                  />
                </Flex>
              </Flex>
            )}
          </Container>
        </ScrollArea>
      </Flex>
    </TextPageLayout>
  );
};

export default TextPage;
