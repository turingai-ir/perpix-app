import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type ReactNode,
  type SubmitEventHandler,
} from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import { useModel } from "../_hooks/model";
import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
  getPromptConfigFieldNames,
} from "./dynamic-prompt-config-field";
import { ModelSelectItem } from "./model-select-item";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppTranslate } from "@/hook";
import {
  isJsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { showDynamicFormErrorsToast } from "@/pages/(app)/generation/_utils/dynamic-form-errors-toast";
import { getModelDynamicConfig } from "@/pages/(app)/generation/_utils/model-dynamic-config";
import {
  type AiRegistryModelSupportedTypesEnumValue,
  type SchemaAiTaskMessageResponse,
} from "@/services/api";

type DynamicConfigForm = ReturnType<typeof useDynamicConfigForm>;
type ConfigDefaultsResolver = (
  lastMessageConfig: SchemaAiTaskMessageResponse["ai_model_config"] | undefined,
) => Record<string, unknown> | undefined;

interface Props {
  advancedExcludedFieldNames: ReadonlySet<string>;
  configDefaultsResolver?: ConfigDefaultsResolver;
  extraContent?: (props: {
    dynamicForm: DynamicConfigForm;
    isFormBusy: boolean;
    isUploadingMedia: boolean;
    setIsUploadingMedia: (isUploading: boolean) => void;
  }) => ReactNode;
  isLoading?: boolean;
  lastMessageConfig?: SchemaAiTaskMessageResponse["ai_model_config"];
  lastMessageModelUuid?: SchemaAiTaskMessageResponse["ai_model_uuid"];
  onSubmit: (data: any, ai_model_uuid: string) => Promise<void> | void;
  promptClearKey?: string;
  promptBoxFieldNames: ReadonlySet<string>;
  promptPlaceholderKey: string;
  supportedOutputs: AiRegistryModelSupportedTypesEnumValue[];
}

const MIN_PROMPT_LENGTH = 3;

export const GenerationPromptBox: FC<Props> = ({
  advancedExcludedFieldNames,
  configDefaultsResolver,
  extraContent,
  isLoading,
  lastMessageConfig,
  lastMessageModelUuid,
  onSubmit,
  promptClearKey,
  promptBoxFieldNames: includedPromptBoxFieldNames,
  promptPlaceholderKey,
  supportedOutputs,
}) => {
  const {
    activeSubscriptionState,
    allowedModelNames,
    modelState,
    modelsListState,
    currentModel,
    setCurrentModel,
  } = useModel(supportedOutputs, lastMessageModelUuid);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastPromptClearKeyRef = useRef<string | undefined>(undefined);
  const { t } = useAppTranslate();
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isPromptTooShort, setIsPromptTooShort] = useState(true);
  const { configDefaults: modelConfigDefaults, configMeta: modelConfigMeta } =
    getModelDynamicConfig(modelState.data);

  const dynamicFormConfigDefaults = useMemo(() => {
    const lastMessageConfigDefaults = configDefaultsResolver
      ? configDefaultsResolver(lastMessageConfig)
      : lastMessageConfig
        ? ({ ...lastMessageConfig } as Record<string, unknown>)
        : undefined;

    return {
      ...(modelConfigDefaults ?? {}),
      ...(lastMessageConfigDefaults ?? {}),
    };
  }, [configDefaultsResolver, lastMessageConfig, modelConfigDefaults]);

  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults: dynamicFormConfigDefaults,
    configMeta: modelConfigMeta,
    configSchema: isJsonConfigSchema(modelState.data?.config_schema)
      ? modelState.data.config_schema
      : null,
    schemaKey: modelState.data?.uuid,
  });
  const promptBoxConfigFieldNames = getPromptConfigFieldNames({
    dynamicForm,
    includedFields: includedPromptBoxFieldNames,
  });
  const advancedFieldNames = getPromptConfigFieldNames({
    dynamicForm,
    excludedFields: advancedExcludedFieldNames,
  });

  const isFormBusy =
    isLoading ||
    !dynamicForm.isReady ||
    activeSubscriptionState.isLoading ||
    modelsListState.isLoading ||
    modelState.isLoading;
  const isSubmitDisabled = isFormBusy || isUploadingMedia || isPromptTooShort;

  const handleFormSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    const currentPrompt =
      textareaRef.current?.value ??
      String(dynamicForm.getValues("prompt") ?? "");
    const currentPromptTooShort =
      currentPrompt.trim().length < MIN_PROMPT_LENGTH;

    if (isFormBusy || isUploadingMedia || currentPromptTooShort) {
      event.preventDefault();
      return;
    }

    dynamicForm.setValue("prompt", currentPrompt, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });

    const submitForm = dynamicForm.handleSubmit(
      async (data) => {
        await onSubmit(data, currentModel ?? "");
      },
      (errors) =>
        showDynamicFormErrorsToast({
          errors,
          properties: dynamicForm.properties,
          title: t("common.error"),
        }),
    );

    await submitForm(event);
  };

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setIsPromptTooShort(event.target.value.trim().length < MIN_PROMPT_LENGTH);
  };

  useEffect(() => {
    if (!promptClearKey) return;
    if (lastPromptClearKeyRef.current === promptClearKey) return;

    lastPromptClearKeyRef.current = promptClearKey;
    dynamicForm.setValue("prompt", "", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setIsPromptTooShort(true);

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  }, [dynamicForm, promptClearKey]);

  return (
    <Card className="w-full min-w-0 overflow-hidden px-2">
      {extraContent?.({
        dynamicForm,
        isFormBusy,
        isUploadingMedia,
        setIsUploadingMedia,
      })}
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
                      placeholder={t(promptPlaceholderKey)}
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
            <div className="flex w-full flex-wrap gap-4">
              <Select
                value={currentModel ?? ""}
                onValueChange={setCurrentModel}
                disabled={isFormBusy}
              >
                <SelectTrigger className="w-full md:max-w-72">
                  <SelectValue placeholder={t("common.chooseModel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("common.chooseModel")}</SelectLabel>
                    {modelsListState.isSuccess &&
                      modelsListState.data.map((model) => (
                        <ModelSelectItem
                          key={model.uuid}
                          allowedModelNames={allowedModelNames}
                          model={model}
                          upgradeLabel={t("common.upgradeRequired")}
                        />
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {promptBoxConfigFieldNames.map((fieldName) => (
                <DynamicPromptConfigField
                  key={fieldName}
                  dynamicForm={dynamicForm}
                  fieldName={fieldName}
                  disabled={isFormBusy}
                />
              ))}
              <AdvancedPromptSettingsDialog
                dynamicForm={dynamicForm}
                fieldNames={advancedFieldNames}
                disabled={isFormBusy}
              />
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
};
