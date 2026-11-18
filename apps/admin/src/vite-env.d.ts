/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PERPIX_API_URL: string;
  readonly VITE_PERPIX_ADMIN_URL?: string;
  readonly VITE_PERPIX_APP_URL?: string;
  readonly VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT: string;
  readonly VITE_APP_FONT_BASE_URL?: string;
  readonly VITE_PERPIX_MAIN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_RELEASE__: string;
