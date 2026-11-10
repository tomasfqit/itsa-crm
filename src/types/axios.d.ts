import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export type ErrorType = {
  code: number;
  message: string;
  result: unknown;
  details?: unknown;
};
export type AxiosErrorType = AxiosError<ErrorType>;
