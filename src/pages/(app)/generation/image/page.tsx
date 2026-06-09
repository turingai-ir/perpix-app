import { AiGenerationLoading } from "@/components/custom/ai-generation-loading";
import { GenerationImageChats, GenerationImagePromptBox } from "./_components";
import { useAiGenerate } from "./_hooks";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAppTranslate } from "@/hook";
import LoadingSection from "@/components/custom/loading-section";
import { APP_ROUTES_KEY } from "@/router";
import { appEventBus } from "@/lib/event-bus";
import type { SchemaAiTaskResponse } from "@/services/api";

const GenerationImagePage = () => {
  const params = useParams();
  const { t } = useAppTranslate();

  const [chatId, setChatId] = useState<string | undefined>(
    params?.chatId ?? undefined,
  );
  const typingAnimationWords = t(
    "pages.generation.image.typingAnimation.words",
    {
      returnObjects: true,
    },
  ) as string[];

  useEffect(() => {
    const paramsChatId = params?.chatId ?? undefined;

    setChatId(paramsChatId);
  }, [params]);

  const { aiGenerateState, aiTaskState } = useAiGenerate(chatId);
  const aiTaskMessages = (aiTaskState.data as SchemaAiTaskResponse | undefined)
    ?.messages;
  const aiTaskMessagesLength = aiTaskMessages?.length ?? 0;
  const lastMessageUuid = aiTaskMessages?.[aiTaskMessages.length - 1]?.uuid;

  useEffect(() => {
    if (!lastMessageUuid) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", undefined);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [aiTaskMessagesLength, lastMessageUuid]);

  const handleForm = async (data: any, ai_model_uuid: string) => {
    const res = await aiGenerateState.mutateAsync({
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
      APP_ROUTES_KEY.generation.image.history.path.replace(":chatId", res.uuid),
    );
    setChatId(res.uuid);
  };
  return (
    <div className="relative flex w-full min-w-0 flex-col overflow-x-hidden px-4 pt-4 pb-20">
      {aiTaskState.isLoading ? (
        <div className="flex min-h-64 w-full items-center justify-center">
          <LoadingSection />
        </div>
      ) : (
        <>
          <GenerationImageChats chatId={chatId} />

          {aiGenerateState.isPending ? (
            <div className="flex w-full justify-center p-4">
              <AiGenerationLoading />
            </div>
          ) : null}

          <div className="mx-auto flex w-full max-w-200 flex-col items-center gap-4 pt-12">
            {aiGenerateState.isPending || chatId ? null : (
              <TypingAnimation
                loop
                blinkCursor
                cursorStyle="block"
                words={typingAnimationWords}
              />
            )}

            <GenerationImagePromptBox
              chatId={chatId}
              isLoading={aiGenerateState.isPending || aiTaskState.isLoading}
              onSubmit={handleForm}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GenerationImagePage;
