import { Activity } from "react";

import { GenerationImageChats, GenerationImagePromptBox } from "./_components";
import { GeneratedMediaField, useGenerationPage } from "../_hooks";

import LoadingSection from "@/components/custom/loading-section";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { AiRegistryModelSupportedTypesEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

const GenerationImagePage = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const typingAnimationWords = t(
    "pages.generation.image.typingAnimation.words",
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
    messageListClearKey,
    shouldShowIntro,
  } = useGenerationPage({
    generatedMediaField: GeneratedMediaField.IMAGE,
    historyPath: APP_ROUTES_KEY.generation.image.history.path,
    taskType: AiRegistryModelSupportedTypesEnumMap.IMAGE,
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
          <GenerationImageChats messages={displayedMessages} />

          <div className="mx-auto flex w-full max-w-200 flex-col items-center gap-4 pt-12">
            {shouldShowIntro ? (
              <TypingAnimation
                loop
                blinkCursor
                cursorStyle="block"
                words={typingAnimationWords}
              />
            ) : null}

            <GenerationImagePromptBox
              isLoading={isBusy}
              lastMessageConfig={lastMessage?.ai_model_config}
              lastMessageModelUuid={lastMessage?.ai_model_uuid}
              onSubmit={handleForm}
              promptClearKey={messageListClearKey}
            />
          </div>
        </>
      </Activity>
    </div>
  );
};

export default GenerationImagePage;
