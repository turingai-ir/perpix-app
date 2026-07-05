/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_PERPIXAI_API_URL: string;
  readonly VITE_PERPIXAI_APP_URL: string;
  readonly VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT: string;
  readonly VITE_FONT_BASE_URL?: string;
  readonly VITE_PERPIXAI_TELEGRAM_SUPPORT?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_PERPIX_TAX_PERCENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Navigator {
  readonly standalone?: boolean;
}

declare const __APP_RELEASE__: string;
declare const __APP_VERSION__: string;
