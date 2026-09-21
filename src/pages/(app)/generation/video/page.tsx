import { Activity } from "react";
import { useLocation, useParams } from "react-router";

import { GenerationVideoChats, GenerationVideoPromptBox } from "./_components";
import { VideoAtmosphere } from "./_components/atmosphere";
import { VideoDirectorStage } from "./_components/director-stage";
import styles from "./studio.module.css";
import { GeneratedMediaField, useGenerationPage } from "../_hooks";
import { getGenerationDraftPrompt } from "../_state/generation-draft";

import LoadingSection from "@/components/custom/loading-section";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

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

  return (
    <main
      className={`${styles.page} ${!shouldShowIntro ? styles.conversation : ""}`}
    >
      <VideoAtmosphere subdued={!shouldShowIntro} />
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isTaskLoading ? "hidden" : "visible"}>
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <section
            aria-label={t("pages.generation.video.studio.timelineLabel")}
            className="w-full px-1 sm:px-3"
          >
            <GenerationVideoChats
              isRetrying={isBusy}
              messages={displayedMessages}
              onRetry={handleRetry}
              optimisticTurn={optimisticTurn}
            />
          </section>

          {shouldShowIntro ? <VideoDirectorStage /> : null}

          <div className={styles.composerDock} data-generation-composer>
            <GenerationVideoPromptBox
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
