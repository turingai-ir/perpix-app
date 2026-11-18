const API_BASE_URL = import.meta.env.VITE_PERPIX_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_PERPIX_API_URL is not defined");
}

export const APP_KEYS = {
  DB: {
    NAME: "per-pix-admin-panel",
    STORAGES: {
      GLOBAL_STATE: "admin-global-state",
    },
  },
  LOCAL_STORAGE: {
    GLOBAL_JOTAI_ATOM: "admin-global-state",
    FILES_PREVIEW: "admin-files-preview",
  },
  INDEXED_DB: {
    REACT_QUERY: "REACT_QUERY_ADMIN_OFFLINE_CACHE",
  },
  API_BASE_URL,
} as const;
