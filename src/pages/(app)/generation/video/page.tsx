import { Activity } from "react";

import { GenerationVideoChats, GenerationVideoPromptBox } from "./_components";
import { GeneratedMediaField, useGenerationPage } from "../_hooks";

import LoadingSection from "@/components/custom/loading-section";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useAppTranslate } from "@/hook";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

const GenerationVideoPage = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const typingAnimationWords = t(
    "pages.generation.video.typingAnimation.words",
    {
      returnObjects: true,
    },
  ) as string[];
  const {
    displayedMessages,
    handleForm,
    isBusy,
    isTaskLoading,
    lastMessage,
    shouldShowIntro,
  } = useGenerationPage({
    generatedMediaField: GeneratedMediaField.VIDEO,
    historyPath: APP_ROUTES_KEY.generation.video.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.VIDEO,
  });

  return (
    <div className="relative flex w-full min-w-0 flex-col overflow-x-hidden px-4 pt-4 pb-20">
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isTaskLoading ? "hidden" : "visible"}>
        <>
          <GenerationVideoChats messages={displayedMessages} />

          <div className="mx-auto flex w-full max-w-200 flex-col items-center gap-4 pt-12">
            {shouldShowIntro ? (
              <TypingAnimation
                loop
                blinkCursor
                cursorStyle="block"
                words={typingAnimationWords}
              />
            ) : null}

            <GenerationVideoPromptBox
              isLoading={isBusy}
              lastMessageConfig={lastMessage?.ai_model_config}
              onSubmit={handleForm}
            />
          </div>
        </>
      </Activity>
    </div>
  );
};

export default GenerationVideoPage;
