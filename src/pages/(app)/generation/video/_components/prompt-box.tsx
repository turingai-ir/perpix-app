import {
  Activity,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type SubmitEventHandler,
} from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import { useModel } from "../../_hooks";
import { ImagesReferenceUploader } from "./images-reference-uploader";

import { Card } from "@/components/ui/card";
import {
  isJsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useAppTranslate } from "@/hook";
import { Button } from "@/components/ui/button";
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
import {
  AiRegistryModelSupportedTypesEnumMap,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";
import { showDynamicFormErrorsToast } from "@/pages/(app)/generation/_utils/dynamic-form-errors-toast";
import { getModelDynamicConfig } from "@/pages/(app)/generation/_utils/model-dynamic-config";

interface Props {
  onSubmit: (data: any, ai_model_uuid: string) => void;
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
}

const MIN_PROMPT_LENGTH = 3;

export const GenerationVideoPromptBox: FC<Props> = ({
  onSubmit,
  isLoading,
  lastMessageConfig,
}) => {
  const { modelState, modelsListState, currentModel, setCurrentModel } =
    useModel([AiRegistryModelSupportedTypesEnumMap.VIDEO]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isPromptTooShortRef = useRef(true);
  const { t } = useAppTranslate();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { configDefaults: modelConfigDefaults, configMeta: modelConfigMeta } =
    getModelDynamicConfig(modelState.data);

  const dynamicFormConfigDefaults = useMemo(() => {
    const lastMessageConfigDefaults = lastMessageConfig
      ? ({
          ...lastMessageConfig,
          images_frame: lastMessageConfig.images_frame,
        } as Record<string, unknown>)
      : undefined;

    return {
      ...(modelConfigDefaults ?? {}),
      ...(lastMessageConfigDefaults ?? {}),
      prompt: "",
    };
  }, [lastMessageConfig, modelConfigDefaults]);

  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults: dynamicFormConfigDefaults,
    configMeta: modelConfigMeta,
    configSchema: isJsonConfigSchema(modelState.data?.config_schema)
      ? modelState.data.config_schema
      : null,
    schemaKey: modelState.data?.uuid,
  });

  const sizeOptionLabels = dynamicForm.getFieldMeta("size")?.optionLabels ?? {};
  const durationProperty = dynamicForm.properties.duration;

  const [isPromptTooShort, setIsPromptTooShort] = useState(true);

  const isFormBusy =
    isLoading ||
    !dynamicForm.isReady ||
    modelsListState.isLoading ||
    modelState.isLoading;

  const isInteractionDisabled = isFormBusy;
  const isSubmitDisabled =
    isInteractionDisabled || isUploadingImage || isPromptTooShort;

  const submitForm = dynamicForm.handleSubmit(
    (data) => onSubmit(data, currentModel ?? ""),
    (errors) =>
      showDynamicFormErrorsToast({
        errors,
        properties: dynamicForm.properties,
        title: t("common.error"),
      }),
  );

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    const currentPrompt =
      textareaRef.current?.value ??
      String(dynamicForm.getValues("prompt") ?? "");
    const currentPromptTooShort =
      currentPrompt.trim().length < MIN_PROMPT_LENGTH;

    if (isInteractionDisabled || isUploadingImage || currentPromptTooShort) {
      event.preventDefault();
      return;
    }

    dynamicForm.setValue("prompt", currentPrompt, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
    void submitForm(event);
  };

  const handleModelChange = (modelId: string) => {
    if (isInteractionDisabled) return;

    setCurrentModel(modelId);
  };

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextIsPromptTooShort =
      event.target.value.trim().length < MIN_PROMPT_LENGTH;

    if (isPromptTooShortRef.current !== nextIsPromptTooShort) {
      isPromptTooShortRef.current = nextIsPromptTooShort;
      setIsPromptTooShort(nextIsPromptTooShort);
    }
  };

  useEffect(() => {
    const prompt = String(dynamicForm.defaultValues.prompt ?? "");
    const nextIsPromptTooShort = prompt.trim().length < MIN_PROMPT_LENGTH;

    isPromptTooShortRef.current = nextIsPromptTooShort;
    setIsPromptTooShort(nextIsPromptTooShort);

    if (textareaRef.current) {
      textareaRef.current.value = prompt;
    }
  }, [dynamicForm.defaultValues]);

  return (
    <Card className="w-full min-w-0 overflow-hidden px-2">
      <ImagesReferenceUploader
        dynamicForm={dynamicForm}
        disabled={isFormBusy}
        onUploadingChange={setIsUploadingImage}
      />
      <Form {...dynamicForm.form}>
        <form
          className="flex w-full min-w-0 flex-col gap-4"
          onSubmit={handleFormSubmit}
        >
          <FormField
            control={dynamicForm.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <ScrollArea
                  className="h-20 w-full overflow-hidden"
                  viewportClassName="h-20"
                >
                  <FormControl>
                    <textarea
                      name={field.name}
                      defaultValue={String(field.value ?? "")}
                      ref={(r) => {
                        textareaRef.current = r;
                        field.ref(r);
                      }}
                      onBlur={field.onBlur}
                      onChange={handlePromptChange}
                      rows={3}
                      wrap="soft"
                      disabled={isFormBusy}
                      className="block h-20 w-full resize-none overflow-y-auto border-none wrap-anywhere break-all outline-none"
                      placeholder={t(
                        "pages.generation.video.promptBox.promptTextArea.placeholder",
                      )}
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
                disabled={isSubmitDisabled}
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
                value={currentModel ?? ""}
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
                      value={field.value == null ? "" : String(field.value)}
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
                                <SelectItem key={size} value={String(size)}>
                                  {sizeOptionLabels[String(size)] ??
                                    String(size)}
                                </SelectItem>
                              ),
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Activity mode={durationProperty ? "visible" : "hidden"}>
                {durationProperty && (
                  <FormField
                    control={dynamicForm.control}
                    defaultValue={dynamicForm.defaultValues.duration}
                    name="duration"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <Select
                          name={field.name}
                          value={field.value == null ? "" : String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          disabled={isInteractionDisabled}
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue
                              placeholder={t("common.selectDuration")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>
                                {t("common.selectDuration")}
                              </SelectLabel>
                              {dynamicForm.isReady &&
                                (durationProperty.enum ?? []).map(
                                  (duration) => (
                                    <SelectItem
                                      key={duration}
                                      value={String(duration)}
                                    >
                                      {duration} {t("common.seconds")}
                                    </SelectItem>
                                  ),
                                )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
              </Activity>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
};
