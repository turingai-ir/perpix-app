import createFetch, { type Middleware } from "openapi-fetch";

import { appEventBus } from "../../lib/event-bus";

import type { paths } from "./api";

import { createAuthorizedFetch } from "@/features/auth/session";
import { APP_KEYS, createCustomFetch } from "@/utils";

const customFetch = createCustomFetch(globalThis.fetch, {
  retryOnNetworkError: false,
  maxRetries: 0,
  maxRetryDelayMs: 0,
  retryDelayMs: 0,
});

export const apiClient = createFetch<paths>({
  fetch: createAuthorizedFetch(customFetch),
  baseUrl: APP_KEYS.API_BASE_URL,
  credentials: "include",
});

const errorMiddleware: Middleware = {
  onError: ({ error }) => {
    appEventBus.emit("API_ERROR_EVENT", error);
    throw error;
  },
};

apiClient.use(errorMiddleware);
