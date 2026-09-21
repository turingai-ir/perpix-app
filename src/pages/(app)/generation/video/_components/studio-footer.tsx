import { Coins, WifiOff } from "lucide-react";

import styles from "../studio.module.css";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { GenerationRulesDialog } from "@/pages/(app)/generation/_components/prompt-box/generation-rules-dialog";
import { PromptSubmitButton } from "@/pages/(app)/generation/_components/prompt-box/submit-button";
import type { useGenerationPromptBox } from "@/pages/(app)/generation/_hooks";
import { getTierPriceTokenRange } from "@/pages/(app)/generation/_utils/model-pricing";
import { formatLocalizedNumber } from "@/utils";

type Studio = ReturnType<typeof useGenerationPromptBox>;
export function VideoStudioFooter({
  studio,
  offline,
  isLoading,
  model,
}: {
  studio: Studio;
  model: Studio["model"];
  offline: boolean;
  isLoading?: boolean;
}) {
  const { t } = useAppTranslate();
  const hasCurrentModelPrice =
    model.modelState.data?.uuid === model.currentModel &&
    !model.modelState.isPlaceholderData &&
    !model.modelState.isError;
  const range = hasCurrentModelPrice
    ? getTierPriceTokenRange([
        { price_usdmicro: model.modelState.data?.min_cost },
        { price_usdmicro: model.modelState.data?.max_cost },
      ])
    : undefined;
  let status = "";
  if (model.modelsListState.isLoading || model.modelState.isLoading)
    status = t("pages.generation.video.studio.loading");
  if (model.modelsListState.isSuccess && !model.modelsListState.data.length)
    status = t("pages.generation.video.studio.noModels");
  if (!model.isCurrentModelAllowed) status = t("common.upgradeRequired");
  if (studio.isUploadingMedia)
    status = t("pages.generation.video.studio.uploading");
  if (isLoading) status = t("pages.generation.video.generationLoading.content");
  const failed =
    model.modelState.isError ||
    model.modelsListState.isError ||
    model.activeSubscriptionState.isError;
  if (failed) status = t("pages.generation.video.studio.loadError");
  if (offline) status = t("pages.generation.video.studio.offline");
  return (
    <footer className={styles.footer}>
      {status && (
        <div role="status" className={styles.status}>
          {offline && <WifiOff aria-hidden="true" size={16} />}
          {status}
          {failed && !offline && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void model.modelsListState.refetch();
                void model.modelState.refetch();
                void model.activeSubscriptionState.refetch();
              }}
            >
              {t("pages.generation.video.generationError.action")}
            </Button>
          )}
        </div>
      )}
      <div className={styles.cost}>
        <span>
          <Coins aria-hidden="true" size={16} />
          {t("pages.generation.video.studio.cost")}
        </span>
        <strong>
          {range
            ? t("pages.generation.modelTokenPrice.range", {
                min: formatLocalizedNumber({ value: range.min }),
                max: formatLocalizedNumber({ value: range.max }),
              })
            : t("pages.generation.modelTokenPrice.empty")}
        </strong>
        <p>{t("pages.generation.video.studio.costHint")}</p>
      </div>
      <div className={styles.submit}>
        <GenerationRulesDialog />
        <PromptSubmitButton
          dynamicForm={studio.dynamicForm}
          isLoading={isLoading}
          disabled={studio.isSubmitDisabled || offline || failed}
          promptRequired={studio.isPromptFieldVisible}
          label={t("pages.generation.video.studio.generate")}
        />
      </div>
    </footer>
  );
}
