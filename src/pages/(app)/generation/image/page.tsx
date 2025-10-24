import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { useImmerAtom } from 'jotai-immer';
import { selectAtom } from 'jotai/utils';
import { useAtom } from 'jotai';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router';

import appLayoutAtom from '../../_layout/_state';

import { APP_LAYOUT_SIDEBAR_WIDTH, simplifyAspect, urlToFile } from '@/utils';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate, useViewportBreakpoint } from '@/hook';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';
import { APP_I18_KEYS } from '@/services/i18';
import { ButtonFullIcon } from '@/components/custom/button-full-icon';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { MultiImageUploadInput } from '@/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Muted, Paragraph } from '@/components/ui/typography';
import { APP_ROUTES_KEY } from '@/router';
import { AiChatRole, UploadedFileTypeEnum, type components } from '@/services/api';
import { ChatBubble } from '@/components/custom/chat-bubble';
import { cn } from '@/lib/utils';
import { appEventBus } from '@/lib/event-bus';
import { LoadingGeneration } from '@/components/custom/loading-generation';
// import { ChatBubble } from '@/components/custom/chat-bubble';
// import { AiChatRole, UploadedFileTypeEnum } from '@/services/api';

const selectedModelAtom = selectAtom(appLayoutAtom, (val) => val.chooseModelSelect);
const isSidebarOpenAtom = selectAtom(appLayoutAtom, (val) => val.isSidebarOpen);

const scrollUntilDown = () => {
  appEventBus.emit('SCROLL_APP_LAYOUT_UNTIL_END', undefined);
};

const GenerationImagePage: FC = () => {
  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const { lg } = useViewportBreakpoint();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const reactQueryApi = useReactQueryApi();
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom);

  const params = useParams();

  const [chatId, setChatId] = useState(params?.chatId ?? undefined);
  const [chatMessages, setChatMessages] = useState<
    components['schemas']['GetModelsOpenAiImagesGenerationsResponseBodyMessage'][]
  >([]);

  useEffect(() => {
    if (chatMessages.length) {
      setTimeout(() => {
        scrollUntilDown();
      }, 1000);
    }
  }, [chatMessages]);

  const chatHistory = reactQueryApi.useMutation(
    'get',
    '/models/open-ai/images/generations/{chat_uuid}',
    {
      onSuccess: async (data) => {
        if (data.messages) {
          setChatMessages([...data.messages]);
        }
        if (data) {
          const reverseChats = Array.from(data.messages ?? []).reverse();
          const referenceImage = reverseChats
            .find((i) => i.role === AiChatRole.ASSISTANT)
            ?.files?.find((i) => i.type === UploadedFileTypeEnum.IMAGE_GENERATED)?.url;

          if (referenceImage) {
            const file = await urlToFile(
              referenceImage,
              referenceImage.split('/').pop() ?? 'file.png',
            );
            form.setValue('images', [file]);
          }
        }
      },
    },
  );

  useEffect(() => {
    if (chatId) {
      chatHistory.mutate({
        params: {
          path: {
            chat_uuid: chatId,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const formSchema = z.object({
    images: z.array(z.instanceof(File)).max(3),
    size: z.string(),
    prompt: z.string(),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      size: '',
      prompt: '',
    },
  });

  const resetForm = useCallback(() => {
    form.reset({
      images: [],
      prompt: '',
      size: form.getValues('size'),
    });
  }, [form]);

  const promptInputWatch = form.watch('prompt');

  // change chat id
  useEffect(() => {
    setChatId(params?.chatId);
    setChatMessages([]);
    resetForm();
  }, [form, params, resetForm]);

  const AiModesList = reactQueryApi.useQuery('get', '/admin/ai-models/', {
    params: {
      query: {
        page: 0,
        page_size: 100,
      },
    },
  });

  const AiModel = reactQueryApi.useQuery(
    'get',
    `/admin/ai-model/{uuid}`,
    {
      params: {
        path: {
          uuid: selectedModel.currentSelectedId || '',
        },
      },
    },
    {
      enabled: !!selectedModel.currentSelectedId,
    },
  );

  const imageGenerationMutate = reactQueryApi.useMutation(
    'post',
    '/models/open-ai/images/generations',
    {
      onSuccess: (data) => {
        const dataChatId = data.id;

        setChatMessages((pre) => [...pre, ...(data?.messages ?? [])]);

        resetForm();
        if (dataChatId !== chatId) {
          setChatId(dataChatId);

          window.history.pushState(
            {},
            '',
            APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', dataChatId),
          );
        }
      },
    },
  );

  const imageEditMutate = reactQueryApi.useMutation('post', '/models/open-ai/images/edits', {
    onSuccess: (data) => {
      const dataChatId = data.id;

      setChatMessages((pre) => [...pre, ...(data?.messages ?? [])]);

      resetForm();
      if (dataChatId !== chatId) {
        setChatId(dataChatId);

        window.history.pushState(
          {},
          '',
          APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', dataChatId),
        );
      }
    },
  });

  const modelHaveRequirements = () => {
    if (promptInputWatch.length > 5) {
      return true;
    }
    return false;
  };

  const generationIsPending = imageGenerationMutate.isPending || imageEditMutate.isPending;
  const disableForm = AiModel.isLoading || generationIsPending || chatHistory.isPending;

  const disabledSubmit =
    AiModel.isLoading || generationIsPending || chatHistory.isPending || !modelHaveRequirements();

  // change ai models list
  useEffect(() => {
    const aiModelFromChatHistory = chatHistory.data?.ai_model_id;
    const aiModelUUID = AiModesList.data?.data?.[0]?.uuid ?? null;

    if (!aiModelUUID && aiModelFromChatHistory) {
      return;
    }

    if ((aiModelUUID || aiModelFromChatHistory) && AiModesList.isSuccess) {
      setAppLayoutState((draft) => {
        draft.chooseModelSelect.currentSelectedId =
          aiModelFromChatHistory || aiModelUUID || undefined;
        draft.chooseModelSelect.list = AiModesList?.data.data.map((item) => ({
          name: item.display_name ?? item.model_name,
          id: item.uuid,
        }));
      });
    }
  }, [AiModesList.data, AiModesList.isSuccess, setAppLayoutState, chatHistory.data]);

  // successLoad ai model
  useEffect(() => {
    if (AiModel.isSuccess && AiModel.data && AiModel.data.config_defaults?.size) {
      form.setValue('size', AiModel.data.config_defaults.size as string);
    }
  }, [AiModel.isSuccess, AiModel.data, form]);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }

    el.style.height = 'auto';
    // 4 rows max
    const maxHeight = parseInt(getComputedStyle(el).lineHeight, 10) * 4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //  edit
    if (values.images.length > 0) {
      const formData = new FormData();

      formData.append(
        'ai_model_config',
        JSON.stringify({
          prompt: values.prompt,
          size: values.size,
        }),
      );

      formData.append('ai_model_id', selectedModel.currentSelectedId ?? '');

      for (let i = 0; i < values.images.length; i++) {
        formData.append(`images`, values.images[i]);
      }
      imageEditMutate.mutate({
        body: formData as unknown as any,
        params: {
          query: {
            chat_id: chatId ?? undefined,
          },
        },
      });
    }

    // generate
    else {
      imageGenerationMutate.mutate({
        body: {
          ai_model_id: selectedModel.currentSelectedId ?? '',
          ai_model_config: {
            prompt: values.prompt,
            size: values.size,
          },
        },
        params: {
          query: {
            chat_id: chatId ?? undefined,
          },
        },
      });
    }
  }

  if (AiModesList.isError) {
    return (
      <div className="mx-auto flex justify-center py-4 items-center w-full h-dvh">
        <ErrorSection onRetry={() => AiModesList.refetch()} />
      </div>
    );
  }

  if (AiModel.isError) {
    return (
      <div className="mx-auto flex justify-center py-4 items-center w-full h-dvh">
        <ErrorSection onRetry={() => AiModel.refetch()} />
      </div>
    );
  }

  if (chatHistory.isError) {
    return (
      <div className="mx-auto flex justify-center py-4 items-center w-full h-dvh">
        <ErrorSection
          onRetry={() =>
            chatHistory.mutate({
              params: {
                path: {
                  chat_uuid: chatId ?? '',
                },
              },
            })
          }
        />
      </div>
    );
  }

  if (chatHistory.isPending) {
    return (
      <div className="w-full flex-1 mx-auto flex justify-center py-4 items-center ">
        <LoadingSection />
      </div>
    );
  }
  return (
    <div className="w-full min-h-full relative pb-64 p-4">
      {!chatMessages.length ? (
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <Paragraph>
            {t('pages.generation.image.requirementsSection.title', {
              modelName:
                selectedModel.list.find((item) => item.id === selectedModel.currentSelectedId)
                  ?.name ?? '',
            })}
          </Paragraph>
          <ul className="!m-0 !p-0 flex flex-col gap-2">
            {(AiModel?.data?.config_schema as any)?.required.includes('prompt') ? (
              <li>
                <Muted>{t('pages.generation.image.requirementsSection.required.prompt')}</Muted>
              </li>
            ) : null}
            {(AiModel?.data?.config_schema as any)?.required.includes('image') ? (
              <li>
                <Muted>{t('pages.generation.image.requirementsSection.required.image')}</Muted>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
      <div className="flex flex-col gap-8">
        {chatMessages?.map((item) => (
          <div
            className={cn([
              'w-full max-w-[500px]',
              {
                'ml-auto': item.role === AiChatRole.USER,
                'mr-auto': item.role !== AiChatRole.USER,
              },
            ])}
            key={item.id}
          >
            <ChatBubble
              avatar="P"
              images={(item.files ?? [])
                .filter((i) =>
                  item.role === AiChatRole.USER
                    ? i.type === UploadedFileTypeEnum.IMAGE_REFERENCE
                    : i.type === UploadedFileTypeEnum.IMAGE_GENERATED,
                )
                .map((i) => i.url)}
              sender={item.role === AiChatRole.USER ? 'user' : 'agent'}
              message={item.message ?? undefined}
            />
          </div>
        ))}
      </div>

      {generationIsPending ? (
        <div className="w-full flex flex-col justify-center items-center py-8">
          <LoadingGeneration />
        </div>
      ) : null}

      {imageGenerationMutate.isError ? (
        <div className="w-full flex flex-col justify-center items-center py-8">
          <ErrorSection />
        </div>
      ) : null}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="fixed bottom-0 bg-background"
          style={{
            right: lg && isSidebarOpen ? APP_LAYOUT_SIDEBAR_WIDTH : '0',
            width: lg && isSidebarOpen ? `calc(100% - ${APP_LAYOUT_SIDEBAR_WIDTH})` : '100%',
          }}
        >
          <div className="mx-auto p-4 lg:max-w-[80%] w-full max-w-full flex flex-col gap-2">
            <div className="relative bg-accent p-2 rounded-lg flex gap-4 items-center">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field: { ref, ...myField } }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <textarea
                        ref={(r) => {
                          textareaRef.current = r;
                          ref(r);
                        }}
                        disabled={disableForm}
                        onInput={handleInput}
                        rows={2}
                        placeholder={t(
                          'pages.generation.image.promptBox.promptTextArea.placeholder',
                        )}
                        className="resize-none overflow-y-auto border-none outline-0 w-full"
                        {...myField}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <ButtonFullIcon type="submit" size="lg" disabled={disabledSubmit} className="mr-auto">
                {t('pages.generation.image.promptBox.generate')}
              </ButtonFullIcon>
            </div>
            <div className="relative p-2 rounded-lg flex gap-4 items-center">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value || ''}
                      onValueChange={(v) => {
                        if (v !== field.value && v !== '') {
                          field.onChange(v);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(AiModel.data?.config_schema as any)?.properties.size?.enum?.map(
                          (item: string) => (
                            <SelectItem value={item} key={item}>
                              {simplifyAspect(item)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiImageUploadInput
                        label={t('pages.generation.image.promptBox.referenceImages.label')}
                        maxSizeMb={10}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GenerationImagePage;
