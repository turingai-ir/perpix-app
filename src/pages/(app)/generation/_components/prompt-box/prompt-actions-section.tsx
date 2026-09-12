import type { FC, ReactNode } from "react";

import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "../dynamic-config";
import { ModelTokenPriceTooltip } from "../model-token-price-tooltip";
import { GenerationRulesDialog } from "./generation-rules-dialog";
import { PromptModelSelector } from "./model-selector";
import { PromptSubmitButton } from "./submit-button";

import type { useModel } from "@/pages/(app)/generation/_hooks/model";

type PromptBoxModel = ReturnType<typeof useModel>;

export const PromptActionsSection: FC<{
  advancedFieldNames: readonly string[];
  advancedSettingsLabel?: string;
  chooseModelLabel: string;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  inlineFieldNames: readonly string[];
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  model: PromptBoxModel;
  hideModelSelector?: boolean;
  modelSelectionContent?: ReactNode;
  primaryActionLabel?: string;
  promptRequired: boolean;
  upgradeLabel: string;
}> = ({
  advancedFieldNames,
  advancedSettingsLabel,
  chooseModelLabel,
  disabled,
  dynamicForm,
  inlineFieldNames,
  isLoading,
  isSubmitDisabled,
  model,
  hideModelSelector,
  modelSelectionContent,
  primaryActionLabel,
  promptRequired,
  upgradeLabel,
}) => (
  <div
    className={
      primaryActionLabel
        ? "flex w-full flex-col-reverse justify-between gap-3 md:flex-row md:items-end"
        : "flex w-full flex-col justify-between gap-4 md:flex-row"
    }
  >
    <div
      className={primaryActionLabel ? "w-full shrink-0 md:w-auto" : undefined}
    >
      <PromptSubmitButton
        disabled={isSubmitDisabled}
        dynamicForm={dynamicForm}
        isLoading={isLoading}
        promptRequired={promptRequired}
        label={primaryActionLabel}
      />
    </div>
    <div className="flex w-full min-w-0 flex-wrap items-end gap-2">
      {modelSelectionContent}
      {!hideModelSelector && (
        <PromptModelSelector
          chooseModelLabel={chooseModelLabel}
          disabled={disabled}
          model={model}
          upgradeLabel={upgradeLabel}
        />
      )}
      {inlineFieldNames.map((fieldName) => (
        <div
          key={fieldName}
          className={
            primaryActionLabel
              ? "max-w-full min-w-28 flex-1 sm:min-w-32 sm:flex-none"
              : "contents"
          }
        >
          <DynamicPromptConfigField
            key={fieldName}
            dynamicForm={dynamicForm}
            fieldName={fieldName}
            disabled={disabled}
            layout="stacked"
            simple={Boolean(primaryActionLabel)}
          />
        </div>
      ))}
      <AdvancedPromptSettingsDialog
        label={advancedSettingsLabel}
        dynamicForm={dynamicForm}
        fieldNames={advancedFieldNames}
        disabled={disabled}
        simple={Boolean(primaryActionLabel)}
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
);
