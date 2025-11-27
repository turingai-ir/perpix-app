import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { selectAtom } from 'jotai/utils';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import appLayoutAtom from '../../_layout/_state';

import { APP_LAYOUT_SIDEBAR_WIDTH, simplifyAspect, urlToFile } from '@/utils';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate, useViewportBreakpoint } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { APP_ROUTES_KEY } from '@/router';
import { AiChatRoleEnum, UploadedFileTypeEnum, type components } from '@/services/api';
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

// ======= Types
type ChatMessage = components['schemas']['GetModelsOpenAiImagesGenerationsResponseBodyMessage'];

// ======= Utils
const scrollUntilDown = () => {
  appEventBus.emit('SCROLL_APP_LAYOUT_UNTIL_END', undefined);
};

const formSchema = z.object({
  images: z.array(z.instanceof(File)).max(3),
  size: z.string(),
  prompt: z.string(),
});

const GenerationImagePage: FC = () => {
  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom);

  const reactQueryApi = useReactQueryApi();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { lg } = useViewportBreakpoint();
  const params = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatId, setChatId] = useState<string | undefined>(params?.chatId ?? undefined);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // ======= Form
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { images: [], size: '', prompt: '' },
  });

  const promptValue = form.watch('prompt');

  const resetForm = useCallback(() => {
    form.reset({
      images: [],
      prompt: '',
      size: form.getValues('size'),
    });
  }, [form]);

  // ======= Auto scroll when messages change
  useEffect(() => {
    if (!chatMessages.length) {
      return;
    }
    const id = setTimeout(scrollUntilDown, 400);
    return () => clearTimeout(id);
  }, [chatMessages]);

  // ======= Queries
  const AiModesList = reactQueryApi.useQuery('get', '/admin/ai-models/', {
    params: { query: { page: 0, page_size: 100 } },
  });

  const AiModel = reactQueryApi.useQuery(
    'get',
    '/admin/ai-model/{uuid}',
    { params: { path: { uuid: selectedModel.currentSelectedId || '' } } },
    { enabled: !!selectedModel.currentSelectedId },
  );

  const chatHistory = reactQueryApi.useMutation(
    'get',
    '/models/open-ai/images/generations/{chat_uuid}',
    {
      onSuccess: async (data) => {
        if (data?.messages) {
          setChatMessages([...data.messages]);
        }

        // آخرین تصویر جنریت‌شده را به‌عنوان رفرنس درون فرم قرار بده
        const reverseChats = Array.from(data?.messages ?? []).reverse();
        const referenceImage = reverseChats
          .find((m) => m.role === AiChatRoleEnum.ASSISTANT)
          ?.files?.find((f) => f.type === UploadedFileTypeEnum.IMAGE_GENERATED)?.url;

        if (referenceImage) {
          const file = await urlToFile(
            referenceImage,
            referenceImage.split('/').pop() ?? 'file.png',
          );
          form.setValue('images', [file], { shouldDirty: true, shouldTouch: true });
        }
      },
    },
  );

  // لود تاریخچه وقتی chatId عوض می‌شود
  useEffect(() => {
    if (!chatId) {
      return;
    }
    chatHistory.mutate({ params: { path: { chat_uuid: chatId } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // وقتی مسیر عوض شود: chatId + پاکسازی UI
  useEffect(() => {
    setChatId(params?.chatId);
    setChatMessages([]);
    resetForm();
  }, [params?.chatId, resetForm]);

  // تنظیم لیست مدل‌ها و currentSelectedId (فقط وقتی دیتا آماده شد)
  useEffect(() => {
    const aiModelFromChatHistory = chatHistory.data?.ai_model_id;
    const list = AiModesList.data?.data ?? [];
    if (!AiModesList.isSuccess || !list.length) {
      return;
    }

    setAppLayoutState((draft) => {
      draft.chooseModelSelect.list = list.map((item) => ({
        name: item.display_name ?? item.model_name,
        id: item.uuid,
      }));
      if (!draft.chooseModelSelect.currentSelectedId) {
        draft.chooseModelSelect.currentSelectedId =
          aiModelFromChatHistory || list[0]?.uuid || undefined;
      }
    });
  }, [AiModesList.isSuccess, AiModesList.data, chatHistory.data?.ai_model_id, setAppLayoutState]);

  // ست سایز پیش‌فرض از تنظیمات مدل
  useEffect(() => {
    const defaultSize = AiModel.data?.config_defaults?.size as string | undefined;
    if (AiModel.isSuccess && defaultSize) {
      form.setValue('size', defaultSize, { shouldDirty: false });
    }
  }, [AiModel.isSuccess, AiModel.data?.config_defaults?.size, form]);

  // ======= Mutations
  const imageGenerationMutate = reactQueryApi.useMutation(
    'post',
    '/models/open-ai/images/generations',
    {
      onSuccess: (data) => {
        const dataChatId = data.id;
        setChatMessages((prev) => [...prev, ...(data?.messages ?? [])]);
        resetForm();

        if (dataChatId && dataChatId !== chatId) {
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
      setChatMessages((prev) => [...prev, ...(data?.messages ?? [])]);
      resetForm();

      if (dataChatId && dataChatId !== chatId) {
        setChatId(dataChatId);
        window.history.pushState(
          {},
          '',
          APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', dataChatId),
        );
      }
    },
  });

  // ======= Derived states
  const generationIsPending = imageGenerationMutate.isPending || imageEditMutate.isPending;
  const disableForm = AiModel.isLoading || generationIsPending || chatHistory.isPending;

  const modelHaveRequirements = useMemo(() => promptValue.trim().length > 5, [promptValue]);
  const disabledSubmit = disableForm || !modelHaveRequirements;

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
    if (values.images.length > 0) {
      const formData = new FormData();
      formData.append(
        'ai_model_config',
        JSON.stringify({ prompt: values.prompt, size: values.size }),
      );
      formData.append('ai_model_id', selectedModel.currentSelectedId ?? '');
      values.images.forEach((img) => formData.append('images', img));

      imageEditMutate.mutate({
        body: formData as unknown as any, // (بدون تغییر در سیستم فعلی)
        params: { query: { chat_id: chatId ?? undefined } },
      });
      return;
    }

    // در غیر این صورت => Generate
    imageGenerationMutate.mutate({
      body: {
        ai_model_id: selectedModel.currentSelectedId ?? '',
        ai_model_config: { prompt: values.prompt, size: values.size },
      },
      params: { query: { chat_id: chatId ?? undefined } },
    });
  }

  // ======= Error/Loading states
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
          onRetry={() => chatHistory.mutate({ params: { path: { chat_uuid: chatId ?? '' } } })}
        />
      </div>
    );
  }

  if (chatHistory.isPending) {
    return (
      <div className="w-full flex-1 mx-auto flex justify-center py-4 items-center">
        <LoadingSection />
      </div>
    );
  }

  // ======= Render
  const sizeEnum: string[] = (AiModel.data?.config_schema as any)?.properties?.size?.enum ?? [];

  const isPromptRequired = (AiModel.data?.config_schema as any)?.required?.includes?.('prompt');

  const isImageRequired = (AiModel.data?.config_schema as any)?.required?.includes?.('image');

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
          <ul className="!m-0 !p-0 flex flex-col gap-2">
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
            key={item.id}
            className={cn('w-full max-w-[500px]', {
              'ml-auto': item.role === AiChatRoleEnum.USER,
              'mr-auto': item.role !== AiChatRoleEnum.USER,
            })}
          >
            <ChatBubble
              avatar="P"
              sender={item.role === AiChatRoleEnum.USER ? 'user' : 'agent'}
              images={(item.files ?? [])
                .filter((f) =>
                  item.role === AiChatRoleEnum.USER
                    ? f.type === UploadedFileTypeEnum.IMAGE_REFERENCE
                    : f.type === UploadedFileTypeEnum.IMAGE_GENERATED,
                )
                .map((f) => f.url)}
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
                          <SelectValue placeholder="Select size" />
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
