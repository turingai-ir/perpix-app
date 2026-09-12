import { Activity } from "react";
import { useLocation } from "react-router";
import { Sparkles } from "lucide-react";
import StudioLogo from "./_components/studio-logo";
import styles from "./studio.module.css";

import { GenerationImageChats, GenerationImagePromptBox } from "./_components";
import { GeneratedMediaField, useGenerationPage } from "../_hooks";
import { getGenerationDraftPrompt } from "../_state/generation-draft";

import LoadingSection from "@/components/custom/loading-section";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

const GenerationImagePage = () => {
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
    successfulMessageClearKey,
    shouldShowIntro,
  } = useGenerationPage({
    generatedMediaField: GeneratedMediaField.IMAGE,
    historyPath: APP_ROUTES_KEY.generation.image.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.IMAGE,
  });

  return (
    <div className={`${styles.page} relative flex w-full min-w-0 flex-col`}>
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isTaskLoading ? "hidden" : "visible"}>
        <>
          <GenerationImageChats
            isRetrying={isBusy}
            messages={displayedMessages}
            onRetry={handleRetry}
          />

          <div
            className={`${styles.content} mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-end`}
          >
            {shouldShowIntro ? (
              <div
                className={`${styles.intro} relative flex w-full flex-1 flex-col items-center justify-center text-center`}
              >
                <StudioLogo />
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

            <GenerationImagePromptBox
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
              lastMessageStatus={
                lastAssistantMessage?.task_status ??
                lastTaskMessage?.task_status
              }
              onSubmit={handleForm}
              successfulMessageClearKey={successfulMessageClearKey}
            />
          </div>
        </>
      </Activity>
    </div>
  );
};

export default GenerationImagePage;
