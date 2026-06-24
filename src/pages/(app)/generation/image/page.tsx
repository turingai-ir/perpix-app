import { GenerationImageChats, GenerationImagePromptBox } from "./_components";
import {
  GeneratedMediaField,
  useAiGenerate,
  useAiTaskResultPolling,
  useScrollToLatestMessage,
} from "../_hooks";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useNavigate, useParams } from "react-router";
import { Activity, useCallback, useMemo } from "react";
import { useAppTranslate } from "@/hook";
import LoadingSection from "@/components/custom/loading-section";
import { APP_ROUTES_KEY } from "@/router/routes";
import type { SchemaAiTaskResponse } from "@/services/api";
import { AiTaskRuleEnumMap } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

const GenerationImagePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const chatId = params?.chatId ?? undefined;
  const typingAnimationWords = t(
    "pages.generation.image.typingAnimation.words",
    {
      returnObjects: true,
    },
  ) as string[];

  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const { mutateAsync } = aiGenerateState;
  const queriedTaskData = aiTaskState.data as SchemaAiTaskResponse | undefined;
  const taskData =
    chatId && queriedTaskData?.uuid === chatId ? queriedTaskData : undefined;
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
    GeneratedMediaField.IMAGE,
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
  const isTaskLoading = aiTaskState.isLoading;
  const isGenerating = aiGenerateState.isPending;
  const isBusy = isGenerating || isTaskLoading;
  const shouldShowIntro = !chatId;

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
          task_type: "IMAGE",
          ai_model_uuid: ai_model_uuid,
          ai_model_config: data,
          task_uuid: chatId ?? undefined,
        },
      });

      navigate(
        APP_ROUTES_KEY.generation.image.history.path.replace(
          ":chatId",
          res.uuid,
        ),
      );
    },
    [chatId, mutateAsync, navigate],
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
              onSubmit={handleForm}
            />
          </div>
        </>
      </Activity>
    </div>
  );
};

export default GenerationImagePage;
