/* eslint-disable prefer-object-has-own */
import { useEffect, useRef, type FC } from 'react';
import { useImmerAtom } from 'jotai-immer';
import { selectAtom } from 'jotai/utils';
import { useAtom } from 'jotai';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import appLayoutAtom from '../../_layout/_state';

import { APP_LAYOUT_SIDEBAR_WIDTH, simplifyAspect } from '@/utils';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate, useViewportBreakpoint } from '@/hook';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';
import { APP_I18_KEYS } from '@/services/i18';
import { ButtonFullIcon } from '@/components/custom/button-full-icon';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { MultiImageUploadInput } from '@/components/form/mutil-image-upload-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Muted, Paragraph } from '@/components/ui/typography';
import { APP_ROUTES_KEY } from '@/router';
// import { ChatBubble } from '@/components/custom/chat-bubble';
// import { AiChatRole, UploadedFileTypeEnum } from '@/services/api';

const selectedModelAtom = selectAtom(appLayoutAtom, (val) => val.chooseModelSelect);

const GenerationImagePage: FC = () => {
  const [, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const { lg } = useViewportBreakpoint();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

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

  const promptInputWatch = form.watch('prompt');

  const reactQueryApi = useReactQueryApi();

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
        const chatId = data.id;
        if (chatId) {
          window.history.pushState(
            {},
            '',
            APP_ROUTES_KEY.generation.image.history.path.replace(':chatId', chatId),
          );
        }
      },
    },
  );

  useEffect(() => {
    const aiModelUUID = AiModesList.data?.data?.[0]?.uuid ?? null;
    if (!aiModelUUID) {
      return;
    }

    if (AiModesList.isSuccess && aiModelUUID) {
      setAppLayoutState((draft) => {
        draft.chooseModelSelect.currentSelectedId = aiModelUUID;
        draft.chooseModelSelect.list = AiModesList.data.data.map((item) => ({
          name: item.display_name ?? item.model_name,
          id: item.uuid,
        }));
      });
    }
  }, [AiModesList.data, AiModesList.isSuccess, setAppLayoutState]);

  // successLoad ai model
  useEffect(() => {
    if (AiModel.isSuccess && AiModel.data && AiModel.data.config_defaults?.size) {
      form.reset({
        ...form.getValues(),
        size: AiModel.data.config_defaults.size as string,
      });
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

  const modelHaveRequirements = () => {
    if (promptInputWatch.length > 5) {
      return true;
    }
    return false;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    imageGenerationMutate.mutate({
      body: {
        ai_model_id: selectedModel.currentSelectedId ?? '',
        ai_model_config: {
          prompt: values.prompt,
        },
      },
    });
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

  // loading or no data for loading

  if (AiModesList.isPending || AiModel.isPending || !AiModesList.data || !AiModel.data) {
    return (
      <div className="w-full flex-1 mx-auto flex justify-center py-4 items-center ">
        <LoadingSection />
      </div>
    );
  }
  return (
    <div className="w-full min-h-full relative pb-80 p-4">
      {!(
        imageGenerationMutate.isPending ||
        imageGenerationMutate.isSuccess ||
        imageGenerationMutate.isError
      ) ? (
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <Paragraph>
            {t('pages.generation.image.requirementsSection.title', {
              modelName:
                selectedModel.list.find((item) => item.id === selectedModel.currentSelectedId)
                  ?.name ?? '',
            })}
          </Paragraph>
          <ul className="!m-0 !p-0 flex flex-col gap-2">
            {(AiModel.data.config_schema as any)?.required.includes('prompt') ? (
              <li>
                <Muted>{t('pages.generation.image.requirementsSection.required.prompt')}</Muted>
              </li>
            ) : null}
            {(AiModel.data.config_schema as any)?.required.includes('image') ? (
              <li>
                <Muted>{t('pages.generation.image.requirementsSection.required.image')}</Muted>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {imageGenerationMutate.isSuccess ? (
        <div className="flex flex-col gap-8">
          {/* {(imageGenerationMutate.data?.messages ?? []).map((item) => {
            if (item.role === AiChatRole.USER) {
              return (
                <div className="w-full max-w-[500px] ml-auto" key={item.id}>
                  <ChatBubble
                    avatar="P"
                    images={(item.files_url ?? [])
                      .filter((obj) =>
                        Object.prototype.hasOwnProperty.call(
                          obj,
                          UploadedFileTypeEnum.IMAGE_REFRENCE,
                        ),
                      )
                      .map((obj) => obj[UploadedFileTypeEnum.IMAGE_GENERATED])}
                    sender="user"
                    message={item.message ?? undefined}
                  />
                </div>
              );
            }
            if (item.role === AiChatRole.ASSISTANT) {
              return (
                <div className="w-full max-w-[500px] ml-auto" key={item.id}>
                  <ChatBubble
                    avatar="P"
                    images={(item.files_url ?? [])
                      .filter((obj) =>
                        Object.prototype.hasOwnProperty.call(
                          obj,
                          UploadedFileTypeEnum.DOCUMENT_REFRENCE,
                        ),
                      )
                      .map((obj) => obj[UploadedFileTypeEnum.IMAGE_GENERATED])}
                    sender="user"
                    message={item.message ?? undefined}
                  />
                </div>
              );
            }

            return null;
          })} */}
        </div>
      ) : null}

      {imageGenerationMutate.isPending ? (
        <div className="w-full flex flex-col justify-center items-center">
          <LoadingSection />
          <Paragraph>{t('pages.generation.image.generationLoading.content')}</Paragraph>
        </div>
      ) : null}

      {imageGenerationMutate.isError ? (
        <div className="w-full flex flex-col justify-center items-center">
          <ErrorSection />
        </div>
      ) : null}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="fixed bottom-0 bg-background"
          style={{
            right: lg ? APP_LAYOUT_SIDEBAR_WIDTH : '0',
            width: lg ? `calc(100% - ${APP_LAYOUT_SIDEBAR_WIDTH})` : '100%',
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

              <ButtonFullIcon
                type="submit"
                size="lg"
                disabled={
                  AiModel.isPending ||
                  !modelHaveRequirements() ||
                  imageGenerationMutate.isPending ||
                  imageGenerationMutate.isSuccess
                }
                className="mr-auto"
              >
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
                        maxSizeMb={5}
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
