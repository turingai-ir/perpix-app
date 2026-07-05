const API_BASE_URL = import.meta.env.VITE_PERPIX_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_PERPIX_API_URL is not defined");
}

export const APP_KEYS = {
  DB: {
    NAME: "per-pix-ai-app",
    STORAGES: {
      GLOBAL_STATE: "global-state",
    },
  },
  LOCAL_STORAGE: {
    GLOBAL_JOTAI_ATOM: "global-state",
    FILES_PREVIEW: "files-preview",
  },
  COOKIES: {
    ACCESS_TOKEN: "access_token",
  },
  INDEXED_DB: {
    REACT_QUERY: "REACT_QUERY_OFFLINE_CACHE",
  },
  API_BASE_URL,
} as const;
