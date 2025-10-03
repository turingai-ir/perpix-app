const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_APP_API_BASE_URL is not defined');
}

export const APP_KEYS = {
  DB: {
    NAME: 'per-pix-ai-app',
    STORGES: {
      globalState: 'global-storage',
    },
  },
  COOKIES: {
    ACCESS_TOKEN: 'chitoz',
  },
  API_BASE_URL,
} as const;
