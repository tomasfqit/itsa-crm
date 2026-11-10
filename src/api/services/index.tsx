import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosErrorType } from "../../types/axios";
import humps from "humps";
import { get } from "../config";



export function useApiGetQuery<TParams = unknown, TResponse = unknown>(
  key: QueryKey,
  url: string,
  params?: TParams,
  options?: Omit<UseQueryOptions<TResponse, AxiosErrorType, TResponse, QueryKey>, "queryKey" | "queryFn"> & {
    onError?: (error: AxiosErrorType) => void;
    onSuccess?: (data: TResponse) => void;
    onSettled?: (data?: TResponse, error?: AxiosErrorType) => void;
  },
): UseQueryResult<TResponse, AxiosErrorType> {
  const dataResponse = async () => {
    const decamelizedParams = humps.decamelizeKeys(params);
    return await get<TParams, TResponse>(url, decamelizedParams as TParams);
  };
  return useQuery<TResponse, AxiosErrorType, TResponse, QueryKey>({
    queryKey: Array.isArray(key) ? [...key, params ?? {}] : [key, params ?? {}],
    queryFn: dataResponse,
    enabled: options?.enabled ?? true,
    ...options,
  });
}


