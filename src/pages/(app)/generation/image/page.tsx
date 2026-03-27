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
  urlToFile,
} from '@/utils';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate, useViewportBreakpoint } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { APP_ROUTES_KEY } from '@/router';
import {
  AiChatRoleEnum,
  AiModelSupportedTaskTypeEnum,
  UploadedFileTypeEnum,
  type SchemaAiChatSessionDetail,
  type SchemaAiModelPage,
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

// ======= Atoms
const selectedModelAtom = selectAtom(appLayoutAtom, (v) => v.chooseModelSelect);
const isSidebarOpenAtom = selectAtom(appLayoutAtom, (v) => v.isSidebarOpen);

// ======= Utils
const scrollUntilDown = () => {
  appEventBus.emit('SCROLL_APP_LAYOUT_UNTIL_END', undefined);
};

const formSchema = z.object({
  images_reference: z.array(z.instanceof(File)).max(16),
  size: z.string(),
  prompt: z.string(),
});

const normalizeList = <T,>(value: unknown): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

const GenerationImagePage: FC = () => {
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

  const userInfoQuery = reactQueryApi.useQuery('get', '/user/get-info', undefined, {
    enabled: false,
  });

  // ======= Form
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { images_reference: [], size: '', prompt: '' },
  });

  const promptValue = form.watch('prompt');
  const sizeValue = form.watch('size');
  const imagesReferenceValue = form.watch('images_reference');

  const resetForm = useCallback(() => {
    form.reset({
      images_reference: [],
      prompt: '',
      size: form.getValues('size'),
    });
  }, [form]);

  const updateFormConfig = useCallback(
    ({ images_reference, size }: { images_reference?: File[]; size?: string }) => {
      if (images_reference) {
        form.setValue('images_reference', images_reference, { shouldDirty: false });
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
      query: { page: 0, page_size: 100, supported_outputs: [AiModelSupportedTaskTypeEnum.IMAGE] },
    },
  });

  // select active id if we do not have chat id
  useEffect(() => {
    const models = normalizeList<SchemaAiModelPage['data'][number]>(AiModelList.data?.data);

    setAppLayoutState((pre) => {
      pre.chooseModelSelect.list = models.map((item) => ({
        name: item.display_name ?? '',
        id: item.uuid ?? '',
        description: '',
      }));
      const firstModel = models[0];

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
    const messages = normalizeList<NonNullable<SchemaAiChatSessionDetail['messages']>[number]>(
      chatHistory.data?.messages,
    );

    if (!messages.length) {
      return;
    }

    let isCanceled = false;

    setChatMessages(
      messages.map((i) => ({
        created_at: i.created_at,
        role: i.role,
        files: i.files,
        uuid: i.uuid,
        message: i.message,
        task_status: i.task_status,
        updated_at: i.updated_at,
      })),
    );

    const lastAssistantMsg = [...messages]
      .reverse()
      .find((m) => m.role === AiChatRoleEnum.ASSISTANT);

    // update selected model
    setAppLayoutState((pre) => {
      pre.chooseModelSelect.currentSelectedId = lastAssistantMsg?.ai_model_uuid ?? '';
    });

    const size = lastAssistantMsg?.ai_model_config?.size as string | undefined;

    updateFormConfig({ size });

    const imageUrl = normalizeList<
      NonNullable<SchemaGenerationResponseBodyMessage['files']>[number]
    >(lastAssistantMsg?.files).find((f) => f.type === UploadedFileTypeEnum.IMAGE_GENERATED)
      ?.url as string;

    if (imageUrl && typeof imageUrl === 'string' && imagesReferenceValue.length === 0) {
      urlToFile(convertToStorageUrl(imageUrl), 'generated-image.png').then((file) => {
        if (isCanceled) {
          return;
        }
        updateFormConfig({ images_reference: [file] });
      });
    }

    return () => {
      isCanceled = true;
    };
  }, [
    chatHistory?.data?.messages,
    form,
    imagesReferenceValue.length,
    setAppLayoutState,
    updateFormConfig,
  ]);

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

  // ======= Mutations
  const imageGenerationMutate = reactQueryApi.useMutation('post', '/ai/generate/image/generation', {
    onSuccess: (data) => {
      const dataChatId = data.uuid;
      const newMessages = normalizeList<SchemaGenerationResponseBodyMessage>(data?.messages);
      setChatMessages((prev) => [...prev, ...newMessages]);
      resetForm();

      // update chat id
      if (dataChatId && dataChatId !== chatId) {
        setChatId(dataChatId);
        window.history.pushState(
          {},
          '',
          APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', dataChatId),
        );
      }
    },
    onError(error: any) {
      if ((error as any).response.status === HttpStatus.FORBIDDEN) {
        navigate(APP_KEYS.URL_HASH.pricing);
      }
    },
  });

  // ======= Derived states
  const generationIsPending = imageGenerationMutate.isPending;
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
    const userScopes = normalizeList<string>(userInfoQuery.data?.active_subscription?.plan.scopes);
    if (!userScopes.includes('ai:image_models')) {
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

    values.images_reference.forEach((img) => formData.append('images_reference', img));

    imageGenerationMutate.mutate({
      body: formData as unknown as any,
      params: { query: { chat_id: chatId ?? undefined } },
    });
  }

  const modelOptions = normalizeList<SchemaAiModelPage['data'][number]>(AiModelList.data?.data);
  const requiredConfigFields = normalizeList<string>(
    (AiModel.data?.config_schema as any)?.required,
  );

  const sizeEnum: string[] = (AiModel.data?.config_schema as any)?.properties?.size?.enum ?? [];

  const isPromptRequired = requiredConfigFields.includes('prompt');

  const isImageRequired = requiredConfigFields.includes('images_reference');

  const modelHaveRequirements = useMemo(() => {
    const trimmedPrompt = promptValue.trim();
    const hasPrompt = trimmedPrompt ? trimmedPrompt.length > 5 : !isPromptRequired;
    const hasImages = !isImageRequired || (imagesReferenceValue?.length ?? 0) > 0;
    const hasSizeSelected = sizeEnum.length === 0 || !!sizeValue;

    return hasPrompt && hasImages && hasSizeSelected;
  }, [
    imagesReferenceValue?.length,
    isImageRequired,
    isPromptRequired,
    promptValue,
    sizeEnum.length,
    sizeValue,
  ]);

  const disabledSubmit = disableForm || !modelHaveRequirements;

  // ======= Error/Loading states
  if (AiModelList.isError || modelOptions.length === 0) {
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
            {t('pages.generation.image.requirementsSection.title', {
              modelName:
                selectedModel.list.find((i) => i.id === selectedModel.currentSelectedId)?.name ??
                '',
            })}
          </Paragraph>
          <ul className="m-0! p-0! flex flex-col gap-2">
            {isPromptRequired ? (
              <li>
                <Muted>{t('pages.generation.image.requirementsSection.required.prompt')}</Muted>
              </li>
            ) : null}
            {isImageRequired ? (
              <li>
                <Muted>{t('pages.generation.image.requirementsSection.required.image')}</Muted>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        {chatMessages.map((item) => (
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
              images={normalizeList<
                NonNullable<SchemaGenerationResponseBodyMessage['files']>[number]
              >(item.files)
                .filter((f) =>
                  item.role === AiChatRoleEnum.USER
                    ? f.type === UploadedFileTypeEnum.IMAGE_REFERENCE
                    : f.type === UploadedFileTypeEnum.IMAGE_GENERATED,
                )
                .map((f) => convertToStorageUrl(f.url))}
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
                          'pages.generation.image.promptBox.promptTextArea.placeholder',
                        )}
                        className="resize-none overflow-y-auto border-none outline-0 w-full"
                        {...field}
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

              <FormField
                control={form.control}
                name="images_reference"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiImageUploadInput
                        maxFiles={
                          (AiModel.data?.config_schema?.properties as any)?.images_reference
                            ?.maxItems
                        }
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
