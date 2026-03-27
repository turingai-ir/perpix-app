/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_S3_ENDPOINT: string;
  readonly VITE_FONT_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
