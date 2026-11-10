import { QueryKey, UseMutationOptions, UseQueryOptions, useMutation } from "@tanstack/react-query";
import { AxiosErrorType } from "../../types/axios";
import { IPermissions, IUserInformation } from "@itsa-develop/itsa-fe-components";
import { useApiGetQuery } from "../../api/services";
import { securityKeys } from "./securityKeys";
import { APIS_VERSIONS, BASE_URL } from "../../constants";
import { API_ROUTES } from "../../api/routes";
import { ICheckSessionRequest, ICheckSessionResult, ICloseSessionRequest, IExchangeCodeRequest, IExchangeCodeResponseResult, ILoginRequest, IResponseGeneric } from "../../view/security/interfaces";
import axios from "axios";
import { AxiosError } from "axios";
import humps from "humps";


export const useGetPermissions = (
  options?: Omit<UseQueryOptions<IPermissions, AxiosErrorType, IPermissions, QueryKey>, "queryKey" | "queryFn">,
) =>
  useApiGetQuery<undefined, IPermissions>(
    securityKeys.getPermissions(),
    `${APIS_VERSIONS.security}${API_ROUTES.permissions}`,
    undefined,
    options,
  );



export const useCheckSession = (
  options?: UseMutationOptions<ICheckSessionResult[], AxiosErrorType, ICheckSessionRequest>,
) => {
  const mutationFn = async (payload: ICheckSessionRequest) => {
    const { data } = await axios.post(`${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.checkSession}`, payload);
    //! TOMAS
    return humps.camelizeKeys(data.result) as ICheckSessionResult[];
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useCloseSession = (options?: UseMutationOptions<IResponseGeneric, AxiosError, ICloseSessionRequest>) => {
  const mutationFn = async (payload: ICloseSessionRequest) => {
    const { data } = await axios.patch<IResponseGeneric>(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.closeSession}?session=${payload.session}`,
    );
    return data;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useLogin = (options?: UseMutationOptions<string, AxiosError, ILoginRequest>) => {
  const mutationFn = async (payload: ILoginRequest) => {
    const { data } = await axios.post(`${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.login}`, payload);
    return data.result;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useExchangeCode = (
  options?: UseMutationOptions<IExchangeCodeResponseResult, AxiosError, IExchangeCodeRequest>,
) => {
  const mutationFn = async (params: IExchangeCodeRequest) => {
    const { data } = await axios.get(
      `${BASE_URL}${APIS_VERSIONS.security}${API_ROUTES.exchangeCode}?claim_code=${params.claimCode}`,
    );
    return data.result;
  };

  return useMutation({
    mutationFn,
    ...options,
  });
};

export const useUserInformation = (
  options?: Omit<UseQueryOptions<IUserInformation, AxiosErrorType, IUserInformation, QueryKey>, "queryKey" | "queryFn">,
) =>
  useApiGetQuery<undefined, IUserInformation>(
    securityKeys.userInformation(),
    `${APIS_VERSIONS.security}${API_ROUTES.userInformation}`,
    undefined,
    options,
  );