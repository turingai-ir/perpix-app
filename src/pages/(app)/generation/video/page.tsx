import { Activity } from "react";
import { useLocation, useParams } from "react-router";

import { GenerationVideoChats, GenerationVideoPromptBox } from "./_components";
import { VideoBrandCinema } from "./_components/brand-cinema";
import styles from "./studio.module.css";
import {
  GenerationFocusState,
  type GenerationFocusPhase,
} from "../_components/generation-focus-state";
import { GeneratedMediaField, useGenerationPage } from "../_hooks";
import { getGenerationDraftPrompt } from "../_state/generation-draft";

import LoadingSection from "@/components/custom/loading-section";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

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
    <main
      className={`${styles.page} ${!shouldShowIntro ? styles.conversation : ""}`}
    >
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isTaskLoading ? "hidden" : "visible"}>
        <div className={styles.content}>
          <section
            aria-label={t("pages.generation.video.studio.timelineLabel")}
            className={styles.timeline}
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
            <div data-generation-intro className={styles.intro}>
              <VideoBrandCinema />
              <h1>{t("pages.generation.video.studio.heroTitle")}</h1>
              <p>{t("pages.generation.video.studio.heroDescription")}</p>
            </div>
          ) : null}
          <div className={styles.composerDock} data-generation-composer>
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
