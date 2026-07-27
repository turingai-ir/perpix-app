import type { FC } from "react";

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
  chooseModelLabel: string;
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  inlineFieldNames: readonly string[];
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  model: PromptBoxModel;
  promptRequired: boolean;
  upgradeLabel: string;
}> = ({
  advancedFieldNames,
  chooseModelLabel,
  disabled,
  dynamicForm,
  inlineFieldNames,
  isLoading,
  isSubmitDisabled,
  model,
  promptRequired,
  upgradeLabel,
}) => (
  <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
    <div>
      <PromptSubmitButton
        disabled={isSubmitDisabled}
        dynamicForm={dynamicForm}
        isLoading={isLoading}
        promptRequired={promptRequired}
      />
    </div>
    <div className="flex w-full flex-wrap gap-4">
      <PromptModelSelector
        chooseModelLabel={chooseModelLabel}
        disabled={disabled}
        model={model}
        upgradeLabel={upgradeLabel}
      />
      {inlineFieldNames.map((fieldName) => (
        <DynamicPromptConfigField
          key={fieldName}
          dynamicForm={dynamicForm}
          fieldName={fieldName}
          disabled={disabled}
          layout="stacked"
        />
      ))}
      <AdvancedPromptSettingsDialog
        dynamicForm={dynamicForm}
        fieldNames={advancedFieldNames}
        disabled={disabled}
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
