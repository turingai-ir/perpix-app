import { useEffect } from "react";
import type { EventSourceMessage } from "@microsoft/fetch-event-source";

import { runAuthorizedStream } from "../services/authorized-stream";

import { useAuthSnapshot } from "./use-auth-status";

interface UseAuthorizedStreamInput {
  path: string;
  onEvent: (message: EventSourceMessage) => void;
  onOpen?: (isReconnect: boolean) => void;
  onReconnecting?: () => void;
  idleTimeoutMs?: number;
}

/**
 * Keeps a Bearer SSE connection open for the current auth cycle. Callbacks
 * must be stable (wrap with useCallback); the stream restarts when they change.
 */
export function useAuthorizedStream({
  path,
  onEvent,
  onOpen,
  onReconnecting,
  idleTimeoutMs,
}: UseAuthorizedStreamInput) {
  const { status, cycle } = useAuthSnapshot();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated) return;
    const controller = new AbortController();
    void runAuthorizedStream({
      path,
      signal: controller.signal,
      onEvent,
      onOpen,
      onReconnecting,
      idleTimeoutMs,
    });

    return () => controller.abort();
  }, [
    isAuthenticated,
    cycle,
    path,
    onEvent,
    onOpen,
    onReconnecting,
    idleTimeoutMs,
  ]);
}
