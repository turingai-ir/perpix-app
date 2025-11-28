const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export const APP_KEYS = {
  DB: {
    NAME: 'per-pix-ai-app',
    STORAGES: {
      GLOBAL_STATE: 'global-state',
    },
  },
  LOCAL_STORAGE: {
    GLOBAL_JOTAI_ATOM: 'global-state',
  },
  COOKIES: {
    ACCESS_TOKEN: 'chitoz',
  },
  URL_HASH: {
    pricing: '#pricing',
  },
  API_BASE_URL,
} as const;
