import { Activity, startTransition, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Sparkles } from "lucide-react";
import StudioLogo from "./studio-logo";
import { NeuralNetworkBackground } from "./neural-network-background";
import styles from "./studio.module.css";

import { GenerationImageChats, GenerationImagePromptBox } from "./index.ts";
import {
  GenerationFocusState,
  type GenerationFocusPhase,
} from "../../components/generation-focus-state";
import { ImageComparison } from "./image-comparison";
import { GenerationHistoryError } from "../../components/generation-history-error";
import type { ImageComparisonItem } from "./image-comparison.types";
import { GeneratedMediaField, useGenerationPage } from "../../hooks";
import { getGenerationDraftPrompt } from "../../hooks/generation-draft";

import LoadingSection from "@/shared/components/loading-section";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { appEventBus } from "@/shared/lib/event-bus";
import type { GenerationComposerIntent } from "../../model/conversation";

function getFocusPhase(
  optimisticStatus: string | undefined,
  taskStatus: string | null | undefined,
): GenerationFocusPhase {
  if (optimisticStatus === "submitting") return "submitting";
  if (taskStatus === "IN_PROGRESS") return "processing";
  return "queued";
}

const GenerationImageSession = () => {
  const location = useLocation();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const initialPrompt = getGenerationDraftPrompt(location.state);
  const [composerIntent, setComposerIntent] =
    useState<GenerationComposerIntent>();
  const [comparisonItems, setComparisonItems] = useState<ImageComparisonItem[]>(
    [],
  );
  const {
    displayedMessages,
    handleForm,
    handleRetry,
    historyError,
    isRetryingHistory,
    retryHistory,
    isBusy,
    isTaskLoading,
    lastAssistantMessage,
    lastTaskMessage,
    optimisticTurn,
    successfulMessageClearKey,
    shouldShowIntro,
  } = useGenerationPage({
    generatedMediaField: GeneratedMediaField.IMAGE,
    historyPath: APP_ROUTES_KEY.generation.image.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.IMAGE,
  });
  const lastTaskStatus =
    lastAssistantMessage?.task_status ?? lastTaskMessage?.task_status;
  const focusPhase = getFocusPhase(optimisticTurn?.status, lastTaskStatus);

  const handleToggleComparison = (item: ImageComparisonItem) => {
    startTransition(() => {
      setComparisonItems((current) => {
        if (current.some(({ fileId }) => fileId === item.fileId)) {
          return current.filter(({ fileId }) => fileId !== item.fileId);
        }
        if (current.length >= 4) return current;
        return [...current, item];
      });
    });
  };

  return (
    <div
      className={`${styles.page} ${!shouldShowIntro ? styles.conversation : ""} relative flex w-full min-w-0 flex-col`}
    >
      {shouldShowIntro ? <StudioLogo /> : null}
      {!shouldShowIntro ? <NeuralNetworkBackground /> : null}
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      {historyError && (
        <GenerationHistoryError
          kind={historyError}
          isRetrying={isRetryingHistory}
          newConversationPath={APP_ROUTES_KEY.generation.image.path}
          onRetry={retryHistory}
        />
      )}
      <Activity mode={isTaskLoading || historyError ? "hidden" : "visible"}>
        <>
          <section
            aria-label={t("pages.generation.image.chat.timelineLabel")}
            className="mx-auto w-full max-w-4xl px-3 sm:px-6"
          >
            <GenerationImageChats
              isRetrying={isBusy}
              messages={displayedMessages}
              comparedImageIds={
                new Set(comparisonItems.map(({ fileId }) => fileId))
              }
              comparisonLimitReached={comparisonItems.length >= 4}
              onToggleComparison={handleToggleComparison}
              onRetry={handleRetry}
              optimisticTurn={optimisticTurn}
              onUseAsReference={(fileId) => {
                startTransition(() => {
                  setComposerIntent({
                    id: crypto.randomUUID(),
                    config: { reference_images: [fileId] },
                    mergeReferences: true,
                    requiredFields: ["reference_images"],
                  });
                });
                appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", {
                  force: true,
                });
              }}
              onEditRequest={(message) => {
                const modelUuid = message.ai_model_uuid;
                if (!modelUuid) return;
                startTransition(() => {
                  setComposerIntent({
                    id: crypto.randomUUID(),
                    config: message.ai_model_config,
                    modelUuid,
                  });
                });
                appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", {
                  force: true,
                });
              }}
              onRegenerate={handleRetry}
            />
          </section>

          <div
            className={`${styles.content} mx-auto flex w-full max-w-4xl flex-1 flex-col items-center`}
          >
            {shouldShowIntro ? (
              <div
                data-generation-intro
                className={`${styles.intro} relative flex w-full flex-1 flex-col items-center justify-center text-center`}
              >
                <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {t("pages.generation.image.studio.eyebrow")}
                </span>
                <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
                  {t("pages.generation.image.studio.headline")}
                </h1>
                <p className="text-muted-foreground max-w-lg text-sm leading-7 sm:text-base">
                  {t("pages.generation.image.studio.intro")}
                </p>
              </div>
            ) : null}

            <div
              data-generation-composer
              className={`${styles.composerDock} sticky bottom-0 z-20 w-full pt-4 pb-2 sm:pt-6 ${shouldShowIntro ? "" : "from-background via-background/95 bg-gradient-to-t to-transparent"}`}
            >
              <ImageComparison
                disabled={isBusy}
                items={comparisonItems}
                onClear={() => setComparisonItems([])}
                onRemove={(fileId) =>
                  setComparisonItems((current) =>
                    current.filter((item) => item.fileId !== fileId),
                  )
                }
              />
              {isBusy ? <GenerationFocusState phase={focusPhase} /> : null}
              <GenerationImagePromptBox
                composerIntent={composerIntent}
                initialPrompt={initialPrompt}
                isLoading={isBusy}
                lastMessageConfig={
                  lastTaskMessage?.ai_model_config ??
                  lastAssistantMessage?.ai_model_config
                }
                lastMessageModelUuid={
                  lastTaskMessage?.ai_model_uuid ??
                  lastAssistantMessage?.ai_model_uuid
                }
                lastMessageStatus={lastTaskStatus}
                onSubmit={handleForm}
                onComposerIntentApplied={(intentId) => {
                  setComposerIntent((current) =>
                    current?.id === intentId ? undefined : current,
                  );
                }}
                successfulMessageClearKey={successfulMessageClearKey}
              />
            </div>
          </div>
        </>
      </Activity>
    </div>
  );
};

const GenerationImagePage = () => {
  const { chatId } = useParams<{ chatId?: string }>();

  return <GenerationImageSession key={chatId ?? "new"} />;
};

export default GenerationImagePage;
