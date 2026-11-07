import { Coins, WifiOff } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { GenerationRulesDialog } from "@/features/generation/components/prompt-box/generation-rules-dialog";
import { PromptSubmitButton } from "@/features/generation/components/prompt-box/submit-button";
import type { useGenerationPromptBox } from "@/features/generation/hooks";
import { getTierPriceUsdmicroRange } from "@/features/generation/model/model-pricing";
import { formatTokenAmount } from "@/shared/utils";

type Studio = ReturnType<typeof useGenerationPromptBox>;
export function VideoStudioFooter({
  studio,
  offline = false,
  isLoading,
  model,
}: {
  studio: Studio;
  model: Studio["model"];
  offline?: boolean;
  isLoading?: boolean;
}) {
  const { t } = useAppTranslate();
  const hasCurrentModelPrice =
    model.modelState.data?.uuid === model.currentModel &&
    !model.modelState.isPlaceholderData &&
    !model.modelState.isError;
  const range = hasCurrentModelPrice
    ? getTierPriceUsdmicroRange([
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
    <footer className="border-border bg-muted/40 grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 border-t px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] max-[600px]:px-3.5">
      {status && (
        <div
          role="status"
          className="text-primary col-span-full m-0 flex flex-wrap items-center gap-2 text-xs leading-relaxed"
        >
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
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-1.5 gap-y-1 text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Coins aria-hidden="true" size={16} />
          {t("pages.generation.video.studio.cost")}
        </span>
        <strong className="text-xs leading-relaxed font-semibold tabular-nums">
          {range
            ? t("pages.generation.modelTokenPrice.range", {
                min: formatTokenAmount(range.min),
                max: formatTokenAmount(range.max),
              })
            : t("pages.generation.modelTokenPrice.empty")}
        </strong>
        <p className="text-muted-foreground basis-full text-xs leading-normal">
          {t("pages.generation.video.studio.costHint")}
        </p>
      </div>
      <div className="flex flex-none items-center gap-1 [&>button:not([type=submit])]:min-h-11 [&>button:not([type=submit])]:min-w-11 [&>button[type=submit]]:min-h-12 [&>button[type=submit]]:min-w-32 [&>button[type=submit]]:rounded-[10px] [&>button[type=submit]]:px-2.5 [&>button[type=submit]]:text-[13px] max-[700px]:[&>button[type=submit]]:flex-1">
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
