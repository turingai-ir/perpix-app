const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_APP_API_BASE_URL is not defined')
}

export const APP_KEYS = {
  I18NEXT: {
    RESOURCES: {
      MAIN: 'MAIN',
    },
  },
  DB: {
    NAME: 'turing-ai-app',
    STORGES: {
      globalState: 'globalState',
    },
  },
  API_BASE_URL,
} as const
