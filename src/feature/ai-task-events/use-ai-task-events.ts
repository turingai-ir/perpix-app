import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useEffect, useRef } from "react";

import type { AiTaskMessageEvent } from "./types";

import { APP_KEYS } from "@/utils";

const AI_TASK_EVENTS_PATH = "/ai-task/events";
const AI_TASK_MESSAGE_EVENT = "ai_task_message";
const WATCHDOG_TIMEOUT_MS = 20_000;
const RECONNECT_DELAY_MS = 1_000;
const FLUSH_INTERVAL_MS = 250;

interface UseAiTaskEventsInput {
  accessToken: string | undefined;
  onTaskMessage: (payload: AiTaskMessageEvent) => void;
  onConnectionStateChange?: (state: "connected" | "reconnecting") => void;
}

export function useAiTaskEvents({
  accessToken,
  onConnectionStateChange,
  onTaskMessage,
}: UseAiTaskEventsInput) {
  const onTaskMessageRef = useRef(onTaskMessage);
  const onConnectionStateChangeRef = useRef(onConnectionStateChange);
  const pendingMessagesRef = useRef<AiTaskMessageEvent[]>([]);

  useEffect(() => {
    onTaskMessageRef.current = onTaskMessage;
  }, [onTaskMessage]);

  useEffect(() => {
    onConnectionStateChangeRef.current = onConnectionStateChange;
  }, [onConnectionStateChange]);

  useEffect(() => {
    if (!accessToken) return;

    let isDisposed = false;
    let activeController: AbortController | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let watchdogTimer: ReturnType<typeof setTimeout> | undefined;

    const flushTimer = setInterval(() => {
      if (!pendingMessagesRef.current.length) return;

      const messages = pendingMessagesRef.current;
      pendingMessagesRef.current = [];
      messages.forEach((message) => onTaskMessageRef.current(message));
    }, FLUSH_INTERVAL_MS);

    const clearWatchdog = () => {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = undefined;
      }
    };

    const scheduleReconnect = () => {
      if (isDisposed) return;

      onConnectionStateChangeRef.current?.("reconnecting");
      activeController?.abort();

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      reconnectTimer = setTimeout(() => {
        connect();
      }, RECONNECT_DELAY_MS);
    };

    const resetWatchdog = () => {
      clearWatchdog();
      watchdogTimer = setTimeout(scheduleReconnect, WATCHDOG_TIMEOUT_MS);
    };

    const connect = () => {
      if (isDisposed) return;

      activeController = new AbortController();
      resetWatchdog();

      void fetchEventSource(`${APP_KEYS.API_BASE_URL}${AI_TASK_EVENTS_PATH}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        openWhenHidden: true,
        signal: activeController.signal,
        onopen(response) {
          if (!response.ok) {
            throw new Error(`SSE connection failed: ${response.status}`);
          }

          onConnectionStateChangeRef.current?.("connected");
          resetWatchdog();

          return Promise.resolve();
        },
        onmessage(message) {
          resetWatchdog();

          if (message.event !== AI_TASK_MESSAGE_EVENT || !message.data) {
            return;
          }

          pendingMessagesRef.current.push(
            JSON.parse(message.data) as AiTaskMessageEvent,
          );
        },
        onerror() {
          scheduleReconnect();
        },
        onclose() {
          scheduleReconnect();
        },
      }).catch((error) => {
        if (!isDisposed && !activeController?.signal.aborted) {
          console.error(error);
          scheduleReconnect();
        }
      });
    };

    connect();

    return () => {
      isDisposed = true;
      clearInterval(flushTimer);
      clearWatchdog();

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      pendingMessagesRef.current = [];
      activeController?.abort();
    };
  }, [accessToken]);
}
