import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
} from "../../../dynamic-config";
import { ModelTokenPriceTooltip } from "../model-token-price-tooltip";
import { GenerationRulesDialog } from "./generation-rules-dialog";
import { PromptModelSelector } from "./model-selector";
import type { PromptActionsSectionProps } from "./prompt-actions-section";
import { PromptSubmitButton } from "./submit-button";
import { AspectRatioPicker } from "./aspect-ratio-picker";
import { ResolutionPicker } from "./resolution-picker";

import { useAppTranslate } from "@/shared/hooks";

const FIELD_CONTROL_CLASS = [
  "[&_[data-slot=select-trigger]]:h-11 [&_[data-slot=select-trigger]]:w-full [&_[data-slot=select-trigger]]:min-w-0 [&_[data-slot=select-trigger]]:rounded-xl [&_[data-slot=select-trigger]]:border-border [&_[data-slot=select-trigger]]:bg-[color-mix(in_oklch,var(--muted)_35%,var(--card))] [&_[data-slot=select-trigger]]:text-[0.8125rem]",
  "[&_button[role=combobox]]:h-11 [&_button[role=combobox]]:w-full [&_button[role=combobox]]:min-w-0 [&_button[role=combobox]]:rounded-xl [&_button[role=combobox]]:border-border [&_button[role=combobox]]:bg-[color-mix(in_oklch,var(--muted)_35%,var(--card))] [&_button[role=combobox]]:text-[0.8125rem]",
  "[&_input]:h-11 [&_input]:w-full [&_input]:min-w-0 [&_input]:rounded-xl [&_input]:border-border [&_input]:bg-[color-mix(in_oklch,var(--muted)_35%,var(--card))] [&_input]:text-[0.8125rem]",
  "[&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate",
  "[&_[data-slot=scroll-area]_[class~=inline-flex]]:h-11 [&_[data-slot=scroll-area]_[class~=inline-flex]]:rounded-xl [&_[data-slot=scroll-area]_[class~=inline-flex]]:border-border [&_[data-slot=scroll-area]_button]:h-8.5",
  "max-[899px]:[&_[data-slot=select-trigger]]:rounded-2xl max-[899px]:[&_[data-slot=select-trigger]]:bg-foreground/3 max-[899px]:[&_button[role=combobox]]:rounded-2xl max-[899px]:[&_button[role=combobox]]:bg-foreground/3 max-[899px]:[&_input]:rounded-2xl max-[899px]:[&_input]:bg-foreground/3 max-[899px]:[&_[data-slot=scroll-area]_[class~=inline-flex]]:rounded-2xl max-[899px]:[&_[data-slot=scroll-area]_[class~=inline-flex]]:bg-foreground/3",
].join(" ");

const MODEL_FIELD_CLASS =
  "flex max-w-full min-w-0 flex-[1_1_12rem] flex-col gap-2 max-[899px]:flex-[0_0_100%] max-[899px]:gap-0 [&>button]:h-11 [&>button]:w-full [&>button]:min-w-0 [&>button]:rounded-xl [&>button]:border-border [&>button]:bg-[color-mix(in_oklch,var(--muted)_35%,var(--card))] [&>button]:text-[0.8125rem] max-[899px]:[&>button]:rounded-2xl max-[899px]:[&>button]:bg-foreground/3";

const TOOLS_CLASS =
  "ms-auto flex min-w-0 flex-wrap items-center gap-2 max-[899px]:col-span-full max-[899px]:ms-0 max-[899px]:w-full max-[899px]:flex-nowrap max-[899px]:justify-start [&>button]:min-h-11 [&>button]:min-w-11 [&>button]:rounded-xl max-[899px]:[&>button:not([aria-label])]:flex-1 max-[899px]:[&>button:not([aria-label])]:justify-center max-[899px]:[&>button[aria-label]]:flex-[0_0_2.75rem] max-[899px]:[&>button[aria-label]]:px-0";

export function ImagePromptActions({
  advancedFieldNames,
  advancedSettingsLabel,
  chooseModelLabel,
  disabled,
  dynamicForm,
  inlineFieldNames,
  isLoading,
  isSubmitDisabled,
  model,
  modelLabel,
  hideModelSelector,
  modelSelectionContent,
  primaryActionLabel,
  promptRequired,
  upgradeLabel,
}: PromptActionsSectionProps) {
  const { t } = useAppTranslate();
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 max-[899px]:items-stretch [&>button[type=submit]]:max-[899px]:min-h-12 [&>button[type=submit]]:max-[899px]:w-full [&>button[type=submit]]:max-[899px]:rounded-2xl">
      <div className="flex min-w-0 flex-[1_1_28rem] flex-nowrap items-center gap-2 max-[899px]:grid max-[899px]:w-full max-[899px]:flex-none max-[899px]:grid-cols-1 max-[899px]:flex-wrap max-[899px]:justify-start">
        {(modelSelectionContent || !hideModelSelector) && (
          <div
            className={MODEL_FIELD_CLASS}
            role="group"
            aria-label={
              modelLabel ?? t("pages.generation.image.studio.modelLabel")
            }
          >
            <span className="sr-only">
              {modelLabel ?? t("pages.generation.image.studio.modelLabel")}
            </span>
            {modelSelectionContent}
            {!hideModelSelector && (
              <PromptModelSelector
                chooseModelLabel={chooseModelLabel}
                disabled={disabled}
                model={model}
                upgradeLabel={upgradeLabel}
              />
            )}
          </div>
        )}
        <div className="flex min-w-0 flex-none flex-wrap items-center gap-2 max-[899px]:grid max-[899px]:w-full max-[899px]:grid-cols-2 max-[899px]:justify-start">
          {inlineFieldNames.map((fieldName) => (
            <div
              key={fieldName}
              className={`max-w-full min-w-0 flex-none max-[899px]:flex-initial [&_label]:sr-only ${FIELD_CONTROL_CLASS}`}
            >
              {fieldName === "aspect_ratio" ? (
                <AspectRatioPicker
                  dynamicForm={dynamicForm}
                  disabled={disabled}
                />
              ) : fieldName === "resolution" ? (
                <ResolutionPicker
                  dynamicForm={dynamicForm}
                  disabled={disabled}
                />
              ) : (
                <DynamicPromptConfigField
                  dynamicForm={dynamicForm}
                  fieldName={fieldName}
                  disabled={disabled}
                  layout="stacked"
                  simple
                  compact
                />
              )}
            </div>
          ))}
          <div className={TOOLS_CLASS}>
            <AdvancedPromptSettingsDialog
              label={advancedSettingsLabel}
              dynamicForm={dynamicForm}
              fieldNames={advancedFieldNames}
              disabled={disabled}
              modelName={
                model.modelState.data?.display_name ??
                model.modelState.data?.name
              }
              simple
            />
            <GenerationRulesDialog />
            <ModelTokenPriceTooltip
              isLoading={model.modelState.isLoading}
              pricingTiers={[
                { price_usdmicro: model.modelState.data?.min_cost },
                { price_usdmicro: model.modelState.data?.max_cost },
              ]}
            />
          </div>
        </div>
      </div>
      <PromptSubmitButton
        disabled={isSubmitDisabled}
        dynamicForm={dynamicForm}
        isLoading={isLoading}
        promptRequired={promptRequired}
        label={primaryActionLabel}
      />
    </div>
  );
}
