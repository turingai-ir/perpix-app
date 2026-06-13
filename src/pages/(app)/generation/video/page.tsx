import { GenerationVideoChats, GenerationVideoPromptBox } from "./_components";
import {
  useAiGenerate,
  useAiTaskResultPolling,
  useScrollToLatestMessage,
} from "../_hooks";
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
import { AiTaskRuleEnumMap } from "@/services/api";
import { LoadingGeneration } from "@/components/custom";
import { APP_I18_KEYS } from "@/services/i18";

const GenerationVideoPage = () => {
  const params = useParams();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const routeChatId = params?.chatId ?? undefined;
  const [isChatRoutePending, startChatRouteTransition] = useTransition();

  const [chatId, setChatId] = useState<string | undefined>(routeChatId);
  const typingAnimationWords = t(
    "pages.generation.video.typingAnimation.words",
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
  const assistantMessage = useMemo(
    () =>
      [...aiTaskMessages]
        .reverse()
        .find((message) => message.role === AiTaskRuleEnumMap.ASSISTANT),
    [aiTaskMessages],
  );
  const aiTaskResultState = useAiTaskResultPolling(
    taskData?.uuid,
    assistantMessage,
  );
  const displayedMessages = useMemo(() => {
    const resultMessage = aiTaskResultState.data;

    if (!resultMessage?.uuid) {
      return aiTaskMessages;
    }

    return aiTaskMessages.map((message) =>
      message.uuid === resultMessage.uuid ? resultMessage : message,
    );
  }, [aiTaskMessages, aiTaskResultState.data]);
  const lastMessage = displayedMessages[displayedMessages.length - 1];
  const isTaskLoading = aiTaskState.isLoading || isChatRoutePending;
  const isGenerating = aiGenerateState.isPending;
  const isBusy = isGenerating || isTaskLoading;
  const shouldShowIntro = !isGenerating && !chatId;

  useScrollToLatestMessage({
    isGenerating,
    isTaskLoading,
    lastMessageUuid: lastMessage?.uuid,
    messageCount: displayedMessages.length,
  });

  const handleForm = useCallback(
    async (data: any, ai_model_uuid: string) => {
      const res = await mutateAsync({
        body: {
          task_type: "VIDEO",
          ai_model_uuid: ai_model_uuid,
          ai_model_config: data,
          task_uuid: chatId ?? undefined,
        },
      });

      window.history.pushState(
        {},
        "",
        APP_ROUTES_KEY.generation.video.history.path.replace(
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
          <GenerationVideoChats messages={displayedMessages} />

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
