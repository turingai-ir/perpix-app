import { GenerationImageChats, GenerationImagePromptBox } from "./_components";
import { useAiGenerate, useScrollToLatestMessage } from "../_hooks";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useParams } from "react-router";
import {
  Activity,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useAppTranslate } from "@/hook";
import LoadingSection from "@/components/custom/loading-section";
import { APP_ROUTES_KEY } from "@/router";
import type { SchemaAiTaskResponse } from "@/services/api";
import { LoadingGeneration } from "@/components/custom";
import { APP_I18_KEYS } from "@/services/i18";

const GenerationImagePage = () => {
  const params = useParams();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const routeChatId = params?.chatId ?? undefined;
  const [isChatRoutePending, startChatRouteTransition] = useTransition();

  const [chatId, setChatId] = useState<string | undefined>(routeChatId);
  const typingAnimationWords = t(
    "pages.generation.image.typingAnimation.words",
    {
      returnObjects: true,
    },
  ) as string[];

  useEffect(() => {
    setChatId(routeChatId);
  }, [routeChatId]);

  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const { mutateAsync } = aiGenerateState;
  const taskData = aiTaskState.data as SchemaAiTaskResponse | undefined;
  const aiTaskMessages = useMemo(() => taskData?.messages ?? [], [taskData]);
  const lastMessage = aiTaskMessages[aiTaskMessages.length - 1];
  const isTaskLoading = aiTaskState.isLoading || isChatRoutePending;
  const isGenerating = aiGenerateState.isPending;
  const isBusy = isGenerating || isTaskLoading;
  const shouldShowIntro = !isGenerating && !chatId;

  useScrollToLatestMessage({
    isGenerating,
    isTaskLoading,
    lastMessageUuid: lastMessage?.uuid,
    messageCount: aiTaskMessages.length,
  });

  const handleForm = useCallback(
    async (data: any, ai_model_uuid: string) => {
      const res = await mutateAsync({
        body: {
          task_type: "IMAGE",
          ai_model_uuid: ai_model_uuid,
          ai_model_config: data,
          task_uuid: chatId ?? undefined,
        },
      });

      window.history.pushState(
        {},
        "",
        APP_ROUTES_KEY.generation.image.history.path.replace(
          ":chatId",
          res.uuid,
        ),
      );
      startChatRouteTransition(() => {
        setChatId(res.uuid);
      });
    },
    [chatId, mutateAsync, startChatRouteTransition],
  );

  return (
    <div className="relative flex w-full min-w-0 flex-col overflow-x-hidden px-4 pt-4 pb-20">
      {isTaskLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : null}

      <Activity mode={isTaskLoading ? "hidden" : "visible"}>
        <>
          <GenerationImageChats messages={aiTaskMessages} />

          {isGenerating ? (
            <div className="flex w-full justify-center px-4 py-8">
              <LoadingGeneration />
            </div>
          ) : null}

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
              onSubmit={handleForm}
            />
          </div>
        </>
      </Activity>
    </div>
  );
};

export default GenerationImagePage;
