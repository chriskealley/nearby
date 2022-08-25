/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCATIONIQ_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
