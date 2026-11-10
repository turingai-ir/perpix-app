import type { AiTaskMessageEvent } from "./types";

import { APP_ROUTES_KEY } from "@/app/router/routes";
import type { SchemaAiTaskResponse } from "@/shared/api";

export const getTaskUrl = (task: SchemaAiTaskResponse, messageUuid: string) => {
  if (task.task_type === "VIDEO") {
    return `${APP_ROUTES_KEY.generation.video.path}/${task.uuid}#${messageUuid}`;
  }

  return `${APP_ROUTES_KEY.generation.image.path}/${task.uuid}#${messageUuid}`;
};

export const PROCESSED_EVENT_TTL_MS = 5 * 60 * 1000;

const getEventKey = (payload: AiTaskMessageEvent) =>
  `${payload.task_uuid}:${payload.task_message_uuid}:${payload.task_status}`;

/** Remembers handled events for a while so a re-delivered event is ignored. */
export const createProcessedEventTracker = (
  ttlMs = PROCESSED_EVENT_TTL_MS,
  now: () => number = Date.now,
) => {
  const processedEventKeys = new Map<string, number>();

  return {
    /** Returns true when the event was already handled; otherwise records it. */
    hasProcessed(payload: AiTaskMessageEvent) {
      const currentTime = now();

      processedEventKeys.forEach((expiresAt, key) => {
        if (expiresAt <= currentTime) {
          processedEventKeys.delete(key);
        }
      });

      const eventKey = getEventKey(payload);

      if (processedEventKeys.has(eventKey)) {
        return true;
      }

      processedEventKeys.set(eventKey, currentTime + ttlMs);
      return false;
    },
    forget(payload: AiTaskMessageEvent) {
      processedEventKeys.delete(getEventKey(payload));
    },
  };
};
