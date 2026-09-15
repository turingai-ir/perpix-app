import {
  AdvancedPromptSettingsDialog,
  DynamicPromptConfigField,
} from "../dynamic-config";
import { ModelTokenPriceTooltip } from "../model-token-price-tooltip";
import { GenerationRulesDialog } from "./generation-rules-dialog";
import { PromptModelSelector } from "./model-selector";
import type { PromptActionsSectionProps } from "./prompt-actions-section";
import { PromptSubmitButton } from "./submit-button";
import { AspectRatioPicker } from "./aspect-ratio-picker";
import { ResolutionPicker } from "./resolution-picker";
import styles from "./image-prompt-actions.module.css";

import { useAppTranslate } from "@/hooks";

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
  hideModelSelector,
  modelSelectionContent,
  primaryActionLabel,
  promptRequired,
  upgradeLabel,
}: PromptActionsSectionProps) {
  const { t } = useAppTranslate();
  return (
    <div className={styles.actionBar}>
      <div className={styles.primarySettings}>
        {(modelSelectionContent || !hideModelSelector) && (
          <div
            className={styles.modelField}
            role="group"
            aria-label={t("pages.generation.image.studio.modelLabel")}
          >
            <span className={styles.modelLabel}>
              {t("pages.generation.image.studio.modelLabel")}
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
        {inlineFieldNames.map((fieldName) => (
          <div key={fieldName} className={styles.primaryField}>
            {fieldName === "aspect_ratio" ? (
              <AspectRatioPicker
                dynamicForm={dynamicForm}
                disabled={disabled}
              />
            ) : fieldName === "resolution" ? (
              <ResolutionPicker dynamicForm={dynamicForm} disabled={disabled} />
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
      </div>
      <div className={styles.tools}>
        <AdvancedPromptSettingsDialog
          label={advancedSettingsLabel}
          dynamicForm={dynamicForm}
          fieldNames={advancedFieldNames}
          disabled={disabled}
          modelName={
            model.modelState.data?.display_name ?? model.modelState.data?.name
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
