import { Alert, Button, Container, Flex, Image, Loader, ScrollArea, Title } from '@mantine/core';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import { useParams } from 'react-router';

import TextPageLayout from './layout';
import SearchBox from './_components/searchbox';
import { imageLayoutState, imagePageState, type ConversionRole } from './_state';

import ChatBubble from '@/components/chat-bubble';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate } from '@/hook';
import { ROUTES_KEY } from '@/router';
import { MarkdownRenderer } from '@/components/markdown';
import type { OPEN_AI_IMAGE_MODELS } from '@/services/api';
import { downloadFile } from '@/utils';

const ImagePage = () => {
  const [state, setState] = useAtom(imagePageState);
  const { t } = useAppTranslate();
  const reactQueryApi = useReactQueryApi();
  const [layoutState] = useAtom(imageLayoutState);

  const createImage = reactQueryApi.useMutation('post', '/open-ai/image/create');

  const params = useParams();

  const getConversion = reactQueryApi.useQuery(
    'get',
    '/open-ai/image/{image_chat_id}',
    {
      params: { path: { image_chat_id: params.id ?? '' } },
    },
    { enabled: false, retry: false },
  );

  const dataConversion = getConversion.data?.messages.filter(
    (i) => i.role === 'user' || i.role === 'assistant',
  );

  const haveConversation = dataConversion?.length || state.conversions.length;

  const handleCreate = async (input: string) => {
    const res = await createImage.mutateAsync({
      body: {
        input,
        model: layoutState.currentModel as OPEN_AI_IMAGE_MODELS,
      },
    });
    setState((draft) => {
      draft.conversions.push({
        message: res.messages[0].message ?? undefined,
        role: res.messages[0].role as ConversionRole,
        images: res.messages[0].images
          ? res.messages[0].images.map(({ name, url }) => ({ name, url }))
          : [],
      });
      draft.chatId = res.image_chat_id;
    });
    window.history.pushState({}, '', ROUTES_KEY.image.chat.path.replace(':id', res.image_chat_id));
  };

  const handleFinishSearchBox = async (input: string) => {
    if (!haveConversation) {
      await handleCreate(input);
    }
  };
  const handleRetryRequest = async () => {
    if (state.conversions.length === 1 && state.conversions[0].message) {
      await handleCreate(state.conversions[0].message);
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
                      {item.message ? <MarkdownRenderer content={item.message ?? ''} /> : null}
                      {item.images?.length ? (
                        <Flex
                          className="lg:tw-max-w-[50%] md:tw-max-w-[70%]"
                          direction="column"
                          gap="md"
                          align="center"
                        >
                          {item.images && item.images[0] && (
                            <>
                              <Image
                                radius="md"
                                src={item.images[0].url}
                                alt={item.images[0].name}
                              />
                              <Button
                                fullWidth={false}
                                radius="xl"
                                color="dark"
                                variant="light"
                                onClick={() => {
                                  downloadFile(item.images![0].url, item.images![0].name);
                                }}
                              >
                                {t('common.download')}
                              </Button>
                            </>
                          )}
                        </Flex>
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
                      {item.message ? <MarkdownRenderer content={item.message ?? ''} /> : null}
                      {item.images?.length ? (
                        <Flex
                          className="lg:tw-max-w-[50%] md:tw-max-w-[70%]"
                          direction="column"
                          gap="md"
                          align="center"
                        >
                          <Image radius="md" src={item.images[0].url} alt={item.images[0].name} />

                          {item.images && item.images[0] && (
                            <>
                              <Image
                                radius="md"
                                src={item.images[0].url}
                                alt={item.images[0].name}
                              />
                              <Button
                                fullWidth={false}
                                radius="xl"
                                color="dark"
                                variant="light"
                                onClick={() => {
                                  downloadFile(item.images![0].url, item.images![0].name);
                                }}
                              >
                                {t('common.download')}
                              </Button>
                            </>
                          )}
                        </Flex>
                      ) : null}
                    </ChatBubble>
                  );
                })}

                {createImage.error && state.conversions.length ? (
                  <Flex justify="center" className=" tw-w-full">
                    <Alert
                      variant="light"
                      color="red"
                      radius="xl"
                      title=""
                      className="md:tw-max-w-96 tw-w-full"
                    >
                      <Flex direction="column" gap="md" align="center">
                        {t('pages.image.apiCallError.content')}
                        <div>
                          <Button
                            onClick={handleRetryRequest}
                            loading={createImage.isPending}
                            variant="outline"
                            color="red"
                            radius="xl"
                          >
                            {t('pages.image.apiCallError.action')}
                          </Button>
                        </div>
                      </Flex>
                    </Alert>
                  </Flex>
                ) : null}

                {haveConversation ? <div className="tw-py-16 tw-w-full " /> : null}
                {!haveConversation ? (
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
                        {t('pages.image.searchBox.title')}
                      </Title>
                    ) : null}

                    <SearchBox
                      onFinish={handleFinishSearchBox}
                      loading={createImage.isPending}
                      error={createImage.isError}
                    />
                  </Flex>
                ) : null}
              </Flex>
            )}
          </Container>
        </ScrollArea>
      </Flex>
    </TextPageLayout>
  );
};

export default ImagePage;
