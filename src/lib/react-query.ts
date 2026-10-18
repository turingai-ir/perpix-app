import { APP_KEYS } from "@/utils";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { get, set, del } from "idb-keyval";
import { accessTokenCookieOptions, cookies } from "@/utils/cookies";

export const REACT_QUERY_CACHE_TIME = 1000 * 60 * 60 * 24 * 7;

if (typeof window !== "undefined") {
  onlineManager.setEventListener((setOnline) => {
    const updateOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: REACT_QUERY_CACHE_TIME,

      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,

      retry: 1,

      networkMode: "online",
    },
    mutations: {
      networkMode: "online",
    },
  },
});

const getAccessToken = (): string | undefined => {
  const token: unknown = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
  return typeof token === "string" ? token : undefined;
};

let cacheSessionToken = getAccessToken();

export const setAccessToken = (token: string) => {
  if (token !== cacheSessionToken) queryClient.clear();
  cookies().set(APP_KEYS.COOKIES.ACCESS_TOKEN, token, accessTokenCookieOptions);
  cacheSessionToken = token;
};

type SessionPersistedClient = PersistedClient & { session: string };

const getSessionFingerprint = async (token: string) => {
  if (!globalThis.crypto?.subtle) return undefined;
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

export const indexedDBPersister: Persister = {
  persistClient: async (client) => {
    const token = cacheSessionToken;
    if (!token || token !== getAccessToken()) return;
    const session = await getSessionFingerprint(token);
    if (!session || token !== getAccessToken()) return;
    await set(APP_KEYS.INDEXED_DB.REACT_QUERY, { ...client, session });
  },
  restoreClient: async () => {
    const token = getAccessToken();
    if (!token || token !== cacheSessionToken) return undefined;
    const [client, session] = await Promise.all([
      get<SessionPersistedClient>(APP_KEYS.INDEXED_DB.REACT_QUERY),
      getSessionFingerprint(token),
    ]);
    if (!session || token !== getAccessToken() || client?.session !== session) {
      return undefined;
    }
    return client;
  },
  removeClient: async () => {
    await del(APP_KEYS.INDEXED_DB.REACT_QUERY);
  },
};
