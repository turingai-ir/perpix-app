import { useCallback, useEffect, useRef } from "react";
import type { EventSourceMessage } from "@microsoft/fetch-event-source";

import type { AiTaskMessageEvent } from "./types";

import { useAuthorizedStream } from "@/features/auth";

const AI_TASK_EVENTS_PATH = "/api/v1/ai-task/events";
const AI_TASK_MESSAGE_EVENT = "ai_task_message";
const IDLE_TIMEOUT_MS = 20_000;
const FLUSH_INTERVAL_MS = 250;

interface UseAiTaskEventsInput {
  onTaskMessage: (payload: AiTaskMessageEvent) => void;
  /** Fired on every successful open; `isReconnect` means events may have been missed. */
  onConnected?: (isReconnect: boolean) => void;
  onConnectionStateChange?: (state: "connected" | "reconnecting") => void;
}

export function useAiTaskEvents({
  onConnected,
  onConnectionStateChange,
  onTaskMessage,
}: UseAiTaskEventsInput) {
  const onTaskMessageRef = useRef(onTaskMessage);
  const onConnectedRef = useRef(onConnected);
  const onConnectionStateChangeRef = useRef(onConnectionStateChange);
  const pendingMessagesRef = useRef<AiTaskMessageEvent[]>([]);

  useEffect(() => {
    onTaskMessageRef.current = onTaskMessage;
    onConnectedRef.current = onConnected;
    onConnectionStateChangeRef.current = onConnectionStateChange;
  }, [onConnected, onConnectionStateChange, onTaskMessage]);

  useEffect(() => {
    const flushTimer = setInterval(() => {
      if (!pendingMessagesRef.current.length) return;

      const messages = pendingMessagesRef.current;
      pendingMessagesRef.current = [];
      messages.forEach((message) => onTaskMessageRef.current(message));
    }, FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(flushTimer);
      pendingMessagesRef.current = [];
    };
  }, []);

  const handleEvent = useCallback((message: EventSourceMessage) => {
    if (message.event !== AI_TASK_MESSAGE_EVENT || !message.data) return;

    try {
      pendingMessagesRef.current.push(
        JSON.parse(message.data) as AiTaskMessageEvent,
      );
    } catch {
      // Ignore malformed frames; state is re-read from the GET endpoints.
    }
  }, []);

  const handleOpen = useCallback((isReconnect: boolean) => {
    onConnectionStateChangeRef.current?.("connected");
    onConnectedRef.current?.(isReconnect);
  }, []);

  const handleReconnecting = useCallback(() => {
    onConnectionStateChangeRef.current?.("reconnecting");
  }, []);

  useAuthorizedStream({
    path: AI_TASK_EVENTS_PATH,
    onEvent: handleEvent,
    onOpen: handleOpen,
    onReconnecting: handleReconnecting,
    idleTimeoutMs: IDLE_TIMEOUT_MS,
  });
}
