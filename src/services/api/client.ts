import createFetch, { type Middleware } from "openapi-fetch";

import { appEventBus } from "../../lib/event-bus";

import type { paths } from "./api";

import { cookies } from "@/utils/cookies";
import { APP_KEYS, createCustomFetch } from "@/utils";

export const apiClient = createFetch<paths>({
  fetch: createCustomFetch(globalThis.fetch, {
    retryOnNetworkError: false,
    maxRetries: 0,
    maxRetryDelayMs: 0,
    retryDelayMs: 0,
  }),
  baseUrl: APP_KEYS.API_BASE_URL,
});

const errorMiddleware: Middleware = {
  onError: ({ error }) => {
    appEventBus.emit("API_ERROR_EVENT", error);
    throw error;
  },
};

const tokenMiddleware: Middleware = {
  onRequest: ({ request }) => {
    const cookie = cookies();
    const token = cookie.get(APP_KEYS.COOKIES.ACCESS_TOKEN);
    if (token && typeof token === "string") {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};

apiClient.use(tokenMiddleware);
apiClient.use(errorMiddleware);
