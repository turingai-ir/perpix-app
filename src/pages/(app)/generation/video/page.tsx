import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { selectAtom } from 'jotai/utils';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import appLayoutAtom from '../../_layout/_state';

import {
  APP_KEYS,
  APP_LAYOUT_SIDEBAR_WIDTH,
  convertToStorageUrl,
  HttpStatus,
  simplifyAspect,
} from '@/utils';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate, useViewportBreakpoint } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { APP_ROUTES_KEY } from '@/router';
import {
  AiChatRoleEnum,
  AiModelSupportedTaskTypeEnum,
  AiModelTaskStatusEnum,
  UploadedFileTypeEnum,
  type SchemaGenerationResponseBodyMessage,
} from '@/services/api';
import { cn } from '@/lib/utils';
import { appEventBus } from '@/lib/event-bus';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';
import { LoadingGeneration } from '@/components/custom/loading-generation';
import { ChatBubble } from '@/components/custom/chat-bubble';
import { ButtonFullIcon } from '@/components/custom/button-full-icon';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiImageUploadInput } from '@/components/form';
import { Muted, Paragraph } from '@/components/ui/typography';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';

// ======= Atoms
const selectedModelAtom = selectAtom(appLayoutAtom, (v) => v.chooseModelSelect);
const isSidebarOpenAtom = selectAtom(appLayoutAtom, (v) => v.isSidebarOpen);

// ======= Utils
const scrollUntilDown = () => {
  appEventBus.emit('SCROLL_APP_LAYOUT_UNTIL_END', undefined);
};

const formSchema = z.object({
  images_frame: z.array(z.instanceof(File)).max(16),
  size: z.string(),
  prompt: z.string(),
  include_audio: z.boolean(),
});

const VIDEO_RESULT_POLL_INTERVAL_MS = 5_000;
const VIDEO_RESULT_MAX_DURATION_MS = 5 * 60 * 1000;

const GenerationVideoPage: FC = () => {
  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom);

  const navigate = useNavigate();

  const reactQueryApi = useReactQueryApi();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { lg } = useViewportBreakpoint();
  const params = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatId, setChatId] = useState<string | undefined>(params?.chatId ?? undefined);
  const [chatMessages, setChatMessages] = useState<SchemaGenerationResponseBodyMessage[]>([]);
  const videoResultPollingRef = useRef<
    Record<string, { startedAt: number; timeoutId?: number | ReturnType<typeof setTimeout> }>
  >({});
  const [isLoadingPulling, setIsLoadingPulling] = useState(false);

  const updateIsLoadingPulling = useCallback(() => {
    setIsLoadingPulling(Object.keys(videoResultPollingRef.current).length > 0);
  }, []);

  const userInfoQuery = reactQueryApi.useQuery('get', '/user/get-info', undefined, {
    enabled: false,
  });

  const stopVideoResultPolling = useCallback(
    (chatMessageUuid: string) => {
      const timeoutId = videoResultPollingRef.current[chatMessageUuid]?.timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      delete videoResultPollingRef.current[chatMessageUuid];
      updateIsLoadingPulling();
    },
    [updateIsLoadingPulling],
  );

  const stopAllVideoResultPolling = useCallback(() => {
    Object.values(videoResultPollingRef.current).forEach(({ timeoutId }) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
    videoResultPollingRef.current = {};
    updateIsLoadingPulling();
  }, [updateIsLoadingPulling]);

  const markVideoResultPollingStart = useCallback(
    (chatMessageUuid: string) => {
      if (!videoResultPollingRef.current[chatMessageUuid]) {
        videoResultPollingRef.current[chatMessageUuid] = { startedAt: Date.now() };
        updateIsLoadingPulling();
      }
    },
    [updateIsLoadingPulling],
  );

  const scheduleVideoResultPolling = useCallback(
    (chatMessageUuid: string, triggerFn: () => void) => {
      const current = videoResultPollingRef.current[chatMessageUuid];
      const startedAt = current?.startedAt ?? Date.now();
      const elapsed = Date.now() - startedAt;

      if (elapsed >= VIDEO_RESULT_MAX_DURATION_MS) {
        stopVideoResultPolling(chatMessageUuid);
        return;
      }

      if (current?.timeoutId) {
        clearTimeout(current.timeoutId);
      }

      const timeoutId = setTimeout(triggerFn, VIDEO_RESULT_POLL_INTERVAL_MS);
      videoResultPollingRef.current[chatMessageUuid] = { startedAt, timeoutId };
    },
    [stopVideoResultPolling],
  );

  useEffect(
    () => () => {
      stopAllVideoResultPolling();
    },
    [stopAllVideoResultPolling],
  );

  // ======= Form
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { images_frame: [], size: '', prompt: '', include_audio: false },
  });

  const promptValue = form.watch('prompt');
  const sizeValue = form.watch('size');
  const imagesReferenceValue = form.watch('images_frame');

  const resetForm = useCallback(() => {
    form.reset({
      images_frame: [],
      prompt: '',
      size: form.getValues('size'),
      include_audio: false,
    });
  }, [form]);

  const updateFormConfig = useCallback(
    ({ images_frame, size }: { images_frame?: File[]; size?: string }) => {
      if (images_frame) {
        form.setValue('images_frame', images_frame, { shouldDirty: false });
      }
      if (size) {
        form.setValue('size', size, { shouldDirty: false });
      }
    },
    [form],
  );

  // ======= Auto scroll when messages change
  useEffect(() => {
    if (!chatMessages.length) {
      return;
    }
    const id = setTimeout(scrollUntilDown, 400);
    return () => clearTimeout(id);
  }, [chatMessages]);

  // ======= Queries
  const AiModelList = reactQueryApi.useQuery('get', '/ai/models/list', {
    params: {
      query: { page: 0, page_size: 100, supported_outputs: [AiModelSupportedTaskTypeEnum.VIDEO] },
    },
  });

  // select active id if we do not have chat id
  useEffect(() => {
    setAppLayoutState((pre) => {
      pre.chooseModelSelect.list = (AiModelList.data?.data ?? []).map((item) => ({
        name: item.display_name ?? '',
        id: item.uuid ?? '',
        description: '',
      }));
      const firstModel = AiModelList.data?.data[0];

      // we do not have chat id
      if (!chatId && firstModel) {
        pre.chooseModelSelect.currentSelectedId = firstModel.uuid;
      }
    });

    return () => {
      setAppLayoutState((pre) => {
        pre.chooseModelSelect.list = [];
        pre.chooseModelSelect.currentSelectedId = '';
      });
    };
  }, [AiModelList.data?.data, chatId, setAppLayoutState]);

  const AiModel = reactQueryApi.useQuery(
    'get',
    '/ai/models/{uuid}',
    { params: { path: { uuid: selectedModel.currentSelectedId! } } },
    { enabled: !!selectedModel.currentSelectedId },
  );

  useEffect(() => {
    // do not use default config if we have chat id
    if (chatId) {
      return;
    }
    const size = AiModel.data?.config_defaults?.size as string | undefined;
    updateFormConfig({ size });
  }, [AiModel.data?.config_defaults?.size, chatId, updateFormConfig]);

  const chatHistory = reactQueryApi.useQuery(
    'get',
    '/ai/session-history/{session_uuid}',
    {
      params: {
        path: {
          session_uuid: chatId!,
        },
      },
    },
    {
      enabled: !!chatId,
    },
  );

  useEffect(() => {
    if (!chatHistory.data?.messages?.length) {
      return;
    }

    setChatMessages(
      chatHistory.data.messages.map((i) => ({
        created_at: i.created_at,
        role: i.role,
        files: i.files,
        uuid: i.uuid,
        message: i.message,
        task_status: i.task_status,
        updated_at: i.updated_at,
      })),
    );

    const lastAssistantMsg = [...chatHistory.data.messages]
      .reverse()
      .find((m) => m.role === AiChatRoleEnum.ASSISTANT);

    // update selected model
    setAppLayoutState((pre) => {
      pre.chooseModelSelect.currentSelectedId = lastAssistantMsg?.ai_model_uuid ?? '';
    });

    const size = lastAssistantMsg?.ai_model_config?.size as string | undefined;
    updateFormConfig({ size });
  }, [chatHistory?.data?.messages, form, setAppLayoutState, updateFormConfig]);

  // update chatId if needed
  useEffect(() => {
    if (!params?.chatId) {
      setChatMessages([]);
      resetForm();
      return;
    }
    if (params?.chatId === chatId) {
      return;
    }
    setChatId(params?.chatId);
    setChatMessages([]);
    resetForm();
  }, [chatId, params?.chatId, resetForm]);

  useEffect(() => {
    stopAllVideoResultPolling();
  }, [chatId, stopAllVideoResultPolling]);

  // ======= Mutations
  const videoGenerationResultMutate = reactQueryApi.useMutation(
    'post',
    '/ai/generate/video/generation/check-result',
    {
      onSuccess: (data) => {
        setChatMessages((messages) => {
          const index = messages.findIndex((m) => m.uuid === data.uuid);
          if (index === -1) {
            return messages;
          }
          const updatedMessage =
            data.task_status === AiModelTaskStatusEnum.COMPLETED
              ? { ...messages[index], ...data }
              : {
                  ...messages[index],
                  task_status: data.task_status ?? messages[index].task_status,
                  files: data.files ?? messages[index].files,
                };

          return [...messages.slice(0, index), updatedMessage, ...messages.slice(index + 1)];
        });

        if (data.task_status === AiModelTaskStatusEnum.IN_PROGRESS) {
          scheduleVideoResultPolling(data.uuid, () =>
            videoGenerationResultMutate.mutate({
              params: {
                query: {
                  chat_message_uuid: data.uuid,
                },
              },
            }),
          );
          return;
        }

        stopVideoResultPolling(data.uuid);
      },
      onError: (_error, variables) => {
        const uuid = variables?.params?.query?.chat_message_uuid;
        if (uuid) {
          setChatMessages((messages) => {
            const index = messages.findIndex((m) => m.uuid === uuid);
            if (index === -1) {
              return messages;
            }
            const failedMessage = { ...messages[index], task_status: AiModelTaskStatusEnum.FAILED };
            return [...messages.slice(0, index), failedMessage, ...messages.slice(index + 1)];
          });
          stopVideoResultPolling(uuid);
        }
      },
    },
  );

  const videoGenerationMutate = reactQueryApi.useMutation('post', '/ai/generate/video/generation', {
    onSuccess: (data) => {
      const dataChatId = data.uuid;
      setChatMessages((prev) => [...prev, ...(data?.messages ?? [])]);
      resetForm();

      // update chat id
      if (dataChatId && dataChatId !== chatId) {
        setChatId(dataChatId);
        window.history.pushState(
          {},
          '',
          APP_ROUTES_KEY.generation.video.history.path.replace(':chatId', dataChatId),
        );
      }
    },
    onError(error: any) {
      if ((error as any).response.status === HttpStatus.FORBIDDEN) {
        navigate(APP_KEYS.URL_HASH.pricing);
      }
    },
  });

  useEffect(() => {
    chatMessages
      .filter((message) => message.role === AiChatRoleEnum.ASSISTANT)
      .filter((message) => message.task_status === AiModelTaskStatusEnum.IN_PROGRESS)
      .forEach((message) => {
        if (videoResultPollingRef.current[message.uuid]) {
          return;
        }
        markVideoResultPollingStart(message.uuid);
        videoGenerationResultMutate.mutate({
          params: {
            query: {
              chat_message_uuid: message.uuid,
            },
          },
        });
      });
  }, [chatMessages, markVideoResultPollingStart, videoGenerationResultMutate]);

  useEffect(() => {
    const inProgressAssistantUuids = new Set(
      chatMessages
        .filter((message) => message.role === AiChatRoleEnum.ASSISTANT)
        .filter((message) => message.task_status === AiModelTaskStatusEnum.IN_PROGRESS)
        .map((message) => message.uuid),
    );

    Object.keys(videoResultPollingRef.current).forEach((uuid) => {
      if (!inProgressAssistantUuids.has(uuid)) {
        stopVideoResultPolling(uuid);
      }
    });
  }, [chatMessages, stopVideoResultPolling]);

  // ======= Derived states
  const generationIsPending =
    videoGenerationMutate.isPending || videoGenerationResultMutate.isPending || isLoadingPulling;
  const disableForm = AiModel.isLoading || generationIsPending || chatHistory.isLoading;

  // ======= Textarea auto-resize
  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    const maxHeight = parseInt(getComputedStyle(el).lineHeight, 10) * 4; // max 4 rows
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  // ======= Submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // user does not have subscription
    if (!userInfoQuery.data?.active_subscription?.plan.scopes.includes('ai:video_models')) {
      navigate(APP_KEYS.URL_HASH.pricing);
      return;
    }
    const formData = new FormData();
    formData.append(
      'ai_model_config',
      JSON.stringify({ prompt: values.prompt, size: values.size }),
    );
    formData.append('prompt', values.prompt);
    formData.append('ai_model_uuid', selectedModel.currentSelectedId ?? '');

    values.images_frame.forEach((img) => formData.append('images_frame', img));

    videoGenerationMutate.mutate({
      body: formData as unknown as any,
      params: { query: { chat_id: chatId ?? undefined } },
    });
  }

  const sizeEnum: string[] = (AiModel.data?.config_schema as any)?.properties?.size?.enum ?? [];

  const isPromptRequired = (AiModel.data?.config_schema as any)?.required?.includes?.('prompt');

  const isImageFrameRequired = (AiModel.data?.config_schema as any)?.required?.includes?.(
    'images_frame',
  );

  const modelHaveRequirements = useMemo(() => {
    const trimmedPrompt = promptValue.trim();
    const hasPrompt = trimmedPrompt ? trimmedPrompt.length > 5 : !isPromptRequired;
    const hasImages = !isImageFrameRequired || (imagesReferenceValue?.length ?? 0) > 0;
    const hasSizeSelected = sizeEnum.length === 0 || !!sizeValue;

    return hasPrompt && hasImages && hasSizeSelected;
  }, [
    imagesReferenceValue?.length,
    isImageFrameRequired,
    isPromptRequired,
    promptValue,
    sizeEnum.length,
    sizeValue,
  ]);

  const disabledSubmit = disableForm || !modelHaveRequirements;

  // ======= Error/Loading states
  if (AiModelList.isError || AiModelList.data?.data.length === 0) {
    return (
      <div className="mx-auto flex justify-center py-4 items-center w-full h-dvh">
        <ErrorSection onRetry={() => AiModelList.refetch()} />
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
        <ErrorSection onRetry={() => chatHistory.refetch()} />
      </div>
    );
  }

  if (chatHistory.isLoading || AiModel.isLoading || AiModelList.isLoading) {
    return (
      <div className="w-full flex-1 mx-auto flex justify-center py-4 items-center">
        <LoadingSection />
      </div>
    );
  }

  return (
    <div className="w-full min-h-full relative pb-64 p-4">
      {!chatMessages.length ? (
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <Paragraph>
            {t('pages.generation.video.requirementsSection.title', {
              modelName:
                selectedModel.list.find((i) => i.id === selectedModel.currentSelectedId)?.name ??
                '',
            })}
          </Paragraph>
          <ul className="m-0! p-0! flex flex-col gap-2">
            {isPromptRequired ? (
              <li>
                <Muted>{t('pages.generation.video.requirementsSection.required.prompt')}</Muted>
              </li>
            ) : null}
            {isImageFrameRequired ? (
              <li>
                <Muted>{t('pages.generation.video.requirementsSection.required.image')}</Muted>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        {chatMessages.map((item) => {
          return (
            <div
              key={item.uuid}
              className={cn('w-full max-w-[500px]', {
                'ml-auto': item.role === AiChatRoleEnum.USER,
                'mr-auto': item.role !== AiChatRoleEnum.USER,
              })}
            >
              <ChatBubble
                timestamp={item.updated_at ? new Date(item.updated_at) : undefined}
                status={item.task_status ?? undefined}
                avatar="P"
                sender={item.role === AiChatRoleEnum.USER ? 'user' : 'agent'}
                images={(item.files ?? [])
                  .filter((f) =>
                    item.role === AiChatRoleEnum.USER
                      ? f.type === UploadedFileTypeEnum.IMAGE_REFERENCE
                      : f.type === UploadedFileTypeEnum.IMAGE_GENERATED,
                  )
                  .map((f) => convertToStorageUrl(f.url))}
                videos={(item.files ?? [])
                  .filter(
                    (f) =>
                      item.role === AiChatRoleEnum.ASSISTANT &&
                      f.type === UploadedFileTypeEnum.VIDEO_GENERATED,
                  )
                  .map((f) => convertToStorageUrl(f.url))}
                message={item.message ?? undefined}
              />
            </div>
          );
        })}
      </div>

      {generationIsPending ? (
        <div className="w-full flex flex-col justify-center items-center py-8">
          <LoadingGeneration />
        </div>
      ) : null}

      {videoGenerationMutate.isError ? (
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
                render={({ field: { ref, ...field } }) => (
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
                          'pages.generation.video.promptBox.promptTextArea.placeholder',
                        )}
                        className="resize-none overflow-y-auto border-none outline-0 w-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <ButtonFullIcon type="submit" size="lg" disabled={disabledSubmit} className="mr-auto">
                {t('pages.generation.video.promptBox.generate')}
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
                        if (v && v !== field.value) {
                          field.onChange(v);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('common.selectSize')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizeEnum.map((item) => (
                          <SelectItem value={item} key={item}>
                            {simplifyAspect(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="include_audio"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center items-center gap-1">
                        <Checkbox
                          id="include_audio_checkbox"
                          {...field}
                          checked={value}
                          onCheckedChange={(val) => {
                            field.onChange(Boolean(val));
                          }}
                        />
                        <Label htmlFor="include_audio_checkbox">
                          {t('pages.generation.video.promptBox.includeAudio.label')}
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="images_frame"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiImageUploadInput
                        maxFiles={
                          (AiModel.data?.config_schema?.properties as any)?.images_frame?.maxItems
                        }
                        label={
                          imagesReferenceValue.length === 0
                            ? t('pages.generation.video.promptBox.referenceImages.first')
                            : t('pages.generation.video.promptBox.referenceImages.last')
                        }
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

export default GenerationVideoPage;
