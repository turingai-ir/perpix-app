import {
  useCallback,
  useRef,
  useState,
  type FC,
  type SubmitEventHandler,
} from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import { useAiGenerate, useModel } from "../_hooks";

import { Card } from "@/components/ui/card";
import {
  isJsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useAppTranslate } from "@/hook";
import { Button } from "@/components/ui/button";
import { useFileManager } from "@/feature/file-manager/hook";
import { HorizontalImageUploader } from "@/components/custom/horizontal-image-uploader";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { simplifyAspect } from "@/utils";

interface Props {
  onSubmit: (data: any, ai_model_uuid: string) => void;
  isLoading?: boolean;
  chatId?: string;
}

const MIN_PROMPT_LENGTH = 3;

export const GenerationImagePromptBox: FC<Props> = ({
  onSubmit,
  isLoading,
  chatId,
}) => {
  const { modelState, modelsListState, currentModel, setCurrentModel } =
    useModel();
  const resizeFrameRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useAppTranslate();
  const { filesPreview, requestUpload } = useFileManager("image_generation");
  const { aiTaskState } = useAiGenerate(chatId);

  console.log(
    "aiTaskState",
    aiTaskState.data?.messages && (aiTaskState.data?.messages ?? []).slice(-1),
  );

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const uploadVersionRef = useRef(0);

  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults: modelState.data?.config_defaults,
    configSchema: isJsonConfigSchema(modelState.data?.config_schema)
      ? modelState.data.config_schema
      : null,
    schemaKey: modelState.data?.uuid,
  });

  const promptWatch = dynamicForm.watch("prompt", "");
  const isPromptTooShort =
    String(promptWatch ?? "").trim().length < MIN_PROMPT_LENGTH;

  const selectedImageItems = selectedImages.map((imageId) => ({
    id: imageId,
    url: filesPreview.get(imageId),
    status: "success" as const,
  }));

  const isPromptInputDisabled =
    isLoading ||
    !dynamicForm.isReady ||
    modelsListState.isLoading ||
    modelState.isLoading;

  const isInteractionDisabled = isPromptInputDisabled || isPromptTooShort;

  const handleValidSubmit = (data: Record<string, unknown>) => {
    if (isInteractionDisabled) return;

    onSubmit(data, currentModel ?? "");
  };

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    if (isInteractionDisabled) {
      event.preventDefault();
      return;
    }

    uploadVersionRef.current += 1;
    void dynamicForm.handleSubmit(handleValidSubmit)(event);
  };

  const handleImageDelete = (imageId: string) => {
    if (isPromptInputDisabled) return;

    setSelectedImages((pre) => pre.filter((id) => id !== imageId));
  };

  const handleImageSelect = async (file: File) => {
    if (isPromptInputDisabled) return;

    const uploadVersion = uploadVersionRef.current;

    const uploadedImageId = await requestUpload(file);

    if (uploadedImageId && uploadVersion === uploadVersionRef.current) {
      setSelectedImages((pre) => [...pre, uploadedImageId]);
    }
  };

  const handleModelChange = (modelId: string) => {
    if (isInteractionDisabled) return;

    setCurrentModel(modelId);
  };

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }

    el.style.height = "auto";

    const nextHeight = el.scrollHeight;
    if (el.offsetHeight !== nextHeight) {
      el.style.height = `${nextHeight}px`;
    }
  }, []);

  const scheduleTextareaResize = useCallback(() => {
    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      resizeTextarea();
    });
  }, [resizeTextarea]);

  return (
    <Card className="w-full min-w-0 overflow-hidden px-2">
      <HorizontalImageUploader
        images={selectedImageItems}
        disabled={isPromptInputDisabled}
        onDeleteClick={handleImageDelete}
        onFileSelect={handleImageSelect}
        showPlaceholder
        label={t("common.addImage")}
        accept="image/jpeg, image/png"
      />
      <Form {...dynamicForm.form}>
        <form
          className="flex w-full min-w-0 flex-col gap-4"
          onSubmit={handleFormSubmit}
        >
          <FormField
            control={dynamicForm.control}
            name="prompt"
            render={({ field: { ref, value, ...field } }) => (
              <FormItem>
                <ScrollArea
                  className="h-20 w-full overflow-hidden"
                  viewportClassName="h-20"
                >
                  <FormControl>
                    <textarea
                      value={String(value ?? "")}
                      ref={(r) => {
                        textareaRef.current = r;
                        ref(r);
                      }}
                      onInput={scheduleTextareaResize}
                      rows={3}
                      wrap="soft"
                      disabled={isPromptInputDisabled}
                      className="block min-h-20 w-full resize-none overflow-hidden border-none wrap-anywhere break-all outline-none"
                      placeholder={t(
                        "pages.generation.image.promptBox.promptTextArea.placeholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                </ScrollArea>
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <div>
              <Button
                type="submit"
                variant="default"
                className="group flex h-8! w-8! cursor-pointer items-center justify-center rounded-full p-0!"
                disabled={isInteractionDisabled || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5! w-5! animate-spin" />
                ) : (
                  <ArrowUp className="h-5! w-5! transition-transform duration-100 ease-out group-hover:rotate-90" />
                )}
              </Button>
            </div>
            <div className="flex w-full flex-wrap gap-2">
              <Select
                value={currentModel}
                onValueChange={handleModelChange}
                disabled={isInteractionDisabled}
              >
                <SelectTrigger className="w-full max-w-72">
                  <SelectValue placeholder={t("common.chooseModel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("common.chooseModel")}</SelectLabel>
                    {modelsListState.isSuccess &&
                      modelsListState.data.map((model) => (
                        <SelectItem key={model.uuid} value={model.uuid}>
                          {model.display_name ?? model.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormField
                control={dynamicForm.control}
                name="size"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Select
                      name={field.name}
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      disabled={isInteractionDisabled}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder={t("common.selectSize")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("common.selectSize")}</SelectLabel>
                          {dynamicForm.isReady &&
                            (dynamicForm.properties?.size?.enum ?? []).map(
                              (size) => (
                                <SelectItem key={size} value={size}>
                                  {simplifyAspect(size)}
                                </SelectItem>
                              ),
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
};
