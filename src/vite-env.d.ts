/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEY_ENCRYPTER_AES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
