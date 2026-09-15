import type { FC, ReactNode } from "react";

import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
  type DynamicConfigForm,
} from "../dynamic-config";
import { ModelTokenPriceTooltip } from "../model-token-price-tooltip";
import { GenerationRulesDialog } from "./generation-rules-dialog";
import { ImagePromptActions } from "./image-prompt-actions";
import { PromptModelSelector } from "./model-selector";
import { PromptSubmitButton } from "./submit-button";

import type { useModel } from "@/pages/(app)/generation/_hooks/model";

type PromptBoxModel = ReturnType<typeof useModel>;

export type PromptActionsSectionProps = {
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
};

export const PromptActionsSection: FC<PromptActionsSectionProps> = (props) => {
  if (props.primaryActionLabel) return <ImagePromptActions {...props} />;

  const {
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
  } = props;
  return (
    <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
      <div>
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
          <div key={fieldName} className="contents">
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
};
