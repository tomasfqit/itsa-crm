import CryptoJS from "crypto-js";

export const APIS_VERSIONS = {
  security: "",
  core: import.meta.env.VITE_API_VERSION_CORE,
  sri: import.meta.env.VITE_SRI_RUC_API_URL,
  civilRegistry: import.meta.env.VITE_CIVIL_REGISTRY_API_URL,
  s3: import.meta.env.VITE_S3_API_URL,
};

export const BASE_URL = import.meta.env.VITE_API;
export const EXTERNAL_INTEGRATION_URL = `${import.meta.env.VITE_API}ie/api/v1/integrations/`; //import.meta.env.VITE_API_EXTERNAL_INTEGRATION;

// API INTEGRACIONES EXTERNAS - SRI
export const SRI_RUC_API_URL = import.meta.env.VITE_SRI_RUC_API_URL;
export const CIVIL_REGISTRY_API_URL = import.meta.env.VITE_VERSION_CIVIL_REGISTRY_API_URL;
export const S3_API_URL = import.meta.env.VITE_S3_API_URL;

export const KEY_HEX = import.meta.env.VITE_KEY_ENCRYPTER_AES;
export const KEY_ENCRYPT = CryptoJS.enc.Hex.parse(KEY_HEX);

export const configQuery = {
  staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos por 5 minutos
  gcTime: 10 * 60 * 500, // 5 minutos - tiempo que se mantienen en cache
  retry: 1, // Solo reintentar una vez
  refetchOnWindowFocus: false, // No refetch al enfocar la ventana
  refetchOnReconnect: true, // Refetch al reconectar
};

export const KEY_STORE = {
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  THEME: "theme",
  LAST_PATH: "lastPath",
  FORM_ACTIVE: "form-active",
};

export const errorsApi = {
  TOKEN_NOT_PROVIDED: "No se proporcionó token de autenticación.",
  TOKEN_NOT_VALID: "El token dado no es valido para ningun tipo de token",
};

export const basePath = "@/view";