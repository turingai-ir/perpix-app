import { Activity, startTransition, useState } from "react";
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
import { appEventBus } from "@/lib/event-bus";
import type { GenerationComposerIntent } from "../_types/conversation";

const GenerationImagePage = () => {
  const location = useLocation();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const initialPrompt = getGenerationDraftPrompt(location.state);
  const [composerIntent, setComposerIntent] =
    useState<GenerationComposerIntent>();
  const {
    displayedMessages,
    handleForm,
    handleRetry,
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

  return (
    <div
      className={`${styles.page} ${!shouldShowIntro ? styles.conversation : ""} relative flex w-full min-w-0 flex-col`}
    >
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isTaskLoading ? "hidden" : "visible"}>
        <>
          <section
            aria-label={t("pages.generation.image.chat.timelineLabel")}
            className="mx-auto w-full max-w-4xl px-3 sm:px-6"
          >
            <GenerationImageChats
              isRetrying={isBusy}
              messages={displayedMessages}
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
              onRegenerate={(message) => {
                if (!message.ai_model_uuid) return;
                void handleForm(message.ai_model_config, message.ai_model_uuid);
              }}
            />
          </section>

          <div
            className={`${styles.content} mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-end`}
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

            <div
              data-generation-composer
              className="from-background via-background/95 sticky bottom-0 z-20 w-full bg-gradient-to-t to-transparent pt-4 pb-2 sm:pt-6"
            >
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
                lastMessageStatus={
                  lastAssistantMessage?.task_status ??
                  lastTaskMessage?.task_status
                }
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

export default GenerationImagePage;
