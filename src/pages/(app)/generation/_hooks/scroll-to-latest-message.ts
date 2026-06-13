import { useEffect, useEffectEvent } from "react";

import { appEventBus } from "@/lib/event-bus";

type UseScrollToLatestMessageParams = {
  isGenerating: boolean;
  isTaskLoading: boolean;
  lastMessageUuid: string | undefined;
  messageCount: number;
};

export const useScrollToLatestMessage = ({
  isGenerating,
  isTaskLoading,
  lastMessageUuid,
  messageCount,
}: UseScrollToLatestMessageParams) => {
  const scrollToLatestMessage = useEffectEvent(() => {
    appEventBus.emit("SCROLL_APP_LAYOUT_UNTIL_END", undefined);
  });

  useEffect(() => {
    if (isTaskLoading || (!isGenerating && !lastMessageUuid)) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      scrollToLatestMessage();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isGenerating, isTaskLoading, lastMessageUuid, messageCount]);
};
