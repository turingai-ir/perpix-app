import { useEffect } from "react";
import { useLocation } from "react-router";

interface UseMessageHashScrollInput {
  isDisabled: boolean;
  isTaskLoading: boolean;
  messageCount: number;
}

/** Scrolls to the message named in the URL hash once the conversation loads. */
export function useMessageHashScroll({
  isDisabled,
  isTaskLoading,
  messageCount,
}: UseMessageHashScrollInput) {
  const location = useLocation();

  useEffect(() => {
    if (isDisabled || !location.hash || isTaskLoading || !messageCount) {
      return;
    }

    let messageUuid: string;
    try {
      messageUuid = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const messageElement = document.getElementById(messageUuid);

    messageElement?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  }, [messageCount, isDisabled, isTaskLoading, location.hash]);
}
