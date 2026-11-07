import { Activity } from "react";
import { useLocation, useParams } from "react-router";

import { GenerationVideoChats, GenerationVideoPromptBox } from "./index.ts";
import { VideoBrandCinema } from "./brand-cinema";
import { GenerationHistoryError } from "../../components/generation-history-error";
import {
  GenerationFocusState,
  type GenerationFocusPhase,
} from "../../components/generation-focus-state";
import { GeneratedMediaField, useGenerationPage } from "../../hooks";
import { getGenerationDraftPrompt } from "../../hooks/generation-draft";

import LoadingSection from "@/shared/components/loading-section";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";

function getFocusPhase(
  optimisticStatus: string | undefined,
  taskStatus: string | null | undefined,
): GenerationFocusPhase {
  if (optimisticStatus === "submitting") return "submitting";
  if (taskStatus === "IN_PROGRESS") return "processing";
  return "queued";
}

function GenerationVideoSession() {
  const location = useLocation();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const initialPrompt = getGenerationDraftPrompt(location.state);
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
    shouldShowIntro,
    successfulMessageClearKey,
  } = useGenerationPage({
    generatedMediaField: GeneratedMediaField.VIDEO,
    historyPath: APP_ROUTES_KEY.generation.video.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.VIDEO,
  });
  const lastTaskStatus =
    lastAssistantMessage?.task_status ?? lastTaskMessage?.task_status;
  const focusPhase = getFocusPhase(optimisticTurn?.status, lastTaskStatus);

  return (
    <main className="bg-background text-foreground relative isolate flex h-[calc(100dvh-72px)] min-h-140 w-full min-w-0 flex-col overflow-hidden overscroll-y-contain p-3 [-webkit-tap-highlight-color:transparent] max-[950px]:h-auto max-[950px]:min-h-[calc(100dvh-72px)] max-[950px]:overflow-visible max-[950px]:p-2.5">
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      {historyError && (
        <GenerationHistoryError
          kind={historyError}
          isRetrying={isRetryingHistory}
          newConversationPath={APP_ROUTES_KEY.generation.video.path}
          onRetry={retryHistory}
        />
      )}
      <Activity mode={isTaskLoading || historyError ? "hidden" : "visible"}>
        <div className="relative z-1 mx-auto grid min-h-0 w-full max-w-none grid-cols-[minmax(0,1fr)_minmax(360px,410px)] grid-rows-[minmax(0,1fr)] items-stretch gap-3 [direction:ltr] *:[direction:rtl] max-[950px]:flex max-[950px]:flex-col max-[950px]:[direction:rtl]">
          <section
            aria-label={t("pages.generation.video.studio.timelineLabel")}
            className="border-border bg-card col-start-1 row-start-1 min-h-0 w-full max-w-none [scrollbar-width:thin] overflow-y-auto rounded-[18px] border p-4 max-[950px]:order-1 max-[950px]:min-h-60 max-[950px]:overflow-visible max-[950px]:data-[empty=true]:hidden"
            data-empty={shouldShowIntro}
          >
            <GenerationVideoChats
              isRetrying={isBusy}
              messages={displayedMessages}
              onRetry={handleRetry}
              optimisticTurn={optimisticTurn}
            />
          </section>
          {shouldShowIntro ? (
            <div
              data-generation-intro
              className="animate-intro-enter pointer-events-none z-1 col-start-1 row-start-1 flex w-full max-w-250 flex-col items-center justify-center gap-2 self-center justify-self-center px-4 pt-3 pb-5 text-center motion-reduce:animate-none max-[950px]:order-[-2] max-[950px]:px-2"
            >
              <VideoBrandCinema />
              <h1 className="text-[clamp(23px,2vw,30px)] leading-tight font-bold tracking-tight">
                {t("pages.generation.video.studio.heroTitle")}
              </h1>
              <p className="text-muted-foreground max-w-147 text-[13px] leading-[1.8]">
                {t("pages.generation.video.studio.heroDescription")}
              </p>
            </div>
          ) : null}
          <div
            className="relative z-20 col-start-2 row-start-1 m-0 flex min-h-0 w-full flex-col overflow-hidden p-0 *:shrink-0 max-[950px]:order-[-1] max-[950px]:overflow-visible [&>[data-generation-composer-card]]:min-h-0 [&>[data-generation-composer-card]]:flex-1"
            data-generation-composer
          >
            {isBusy ? (
              <GenerationFocusState phase={focusPhase} media="video" />
            ) : null}
            <GenerationVideoPromptBox
              initialPrompt={initialPrompt}
              isLoading={isBusy}
              lastMessageConfig={
                lastAssistantMessage?.ai_model_config ??
                lastTaskMessage?.ai_model_config
              }
              lastMessageModelUuid={
                lastAssistantMessage?.ai_model_uuid ??
                lastTaskMessage?.ai_model_uuid
              }
              lastMessageStatus={lastTaskStatus}
              onSubmit={handleForm}
              successfulMessageClearKey={successfulMessageClearKey}
            />
          </div>
        </div>
      </Activity>
    </main>
  );
}

const GenerationVideoPage = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  return <GenerationVideoSession key={chatId ?? "new"} />;
};

export default GenerationVideoPage;
