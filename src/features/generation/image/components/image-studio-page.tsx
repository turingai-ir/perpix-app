import { Activity, type FC } from "react";
import { useParams } from "react-router";
import { Sparkles } from "lucide-react";
import StudioLogo from "./studio-logo";
import { NeuralNetworkBackground } from "./neural-network-background";
import { cn } from "@/shared/lib/utils";
import {
  STUDIO_CONTENT_CLASS,
  STUDIO_DOCK_CLASS,
  STUDIO_INTRO_CLASS,
  STUDIO_PAGE_CLASS,
} from "./studio-styles";

import { GenerationImageChats, GenerationImagePromptBox } from "./index";
import { GenerationFocusState } from "../../components/generation-focus-state";
import { ImageComparison } from "./image-comparison";
import { GenerationHistoryError } from "../../components/generation-history-error";
import { useImageStudio } from "../hooks/use-image-studio";
import LoadingSection from "@/shared/components/loading-section";
import { APP_ROUTES_KEY } from "@/app/router/routes";

const GenerationImageSession: FC = () => {
  const {
    t,
    initialPrompt,
    composerIntent,
    setComposerIntent,
    comparisonItems,
    handleToggleComparison,
    handleRemoveComparison,
    handleClearComparison,
    handleUseAsReference,
    handleEditRequest,
    focusPhase,
    lastTaskStatus,
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
  } = useImageStudio();

  return (
    <div
      className={STUDIO_PAGE_CLASS}
      data-conversation={!shouldShowIntro || undefined}
    >
      {shouldShowIntro ? <StudioLogo /> : null}
      {!shouldShowIntro ? <NeuralNetworkBackground /> : null}
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      {historyError ? (
        <GenerationHistoryError
          kind={historyError}
          isRetrying={isRetryingHistory}
          newConversationPath={APP_ROUTES_KEY.generation.image.path}
          onRetry={retryHistory}
        />
      ) : null}

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
              onUseAsReference={handleUseAsReference}
              onEditRequest={handleEditRequest}
              onRegenerate={handleRetry}
            />
          </section>

          <div className={STUDIO_CONTENT_CLASS}>
            {shouldShowIntro ? (
              <div data-generation-intro className={STUDIO_INTRO_CLASS}>
                <span
                  data-slot="eyebrow"
                  className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                >
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
              className={cn(
                STUDIO_DOCK_CLASS,
                !shouldShowIntro &&
                  "from-background via-background/95 bg-linear-to-t to-transparent max-sm:bg-none",
              )}
            >
              <ImageComparison
                disabled={isBusy}
                items={comparisonItems}
                onClear={handleClearComparison}
                onRemove={handleRemoveComparison}
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

export const GenerationImagePage: FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();

  return <GenerationImageSession key={chatId ?? "new"} />;
};

export default GenerationImagePage;
