import type { ICheckSessionResult, ILoginRequest } from "../../../view/security/interfaces";
import { useState } from "react";
import { z } from "zod";
import { Control, FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KEY_STORE } from "../../../constants";
import { useModalResponsive, useNotification, useEncrypt } from "@itsa-develop/itsa-fe-components";
import { useCheckSession, useExchangeCode } from "../../../services/security/security.services";
import { useLogin } from "../../../services/security/security.services";
import { useAuthStore } from "../../../store/auth.store";
import { Button } from "@itsa-develop/itsa-fe-components";
import { AxiosErrorType } from "../../../types/axios";
import { useNavigate } from "react-router-dom";
import { ActiveSessionsUI } from "../ActiveSessions/ActiveSessionsUI.controller";
import { useErrorFormulario } from "../../../hooks/useErrorNotification";
import { PATHS } from "../../../routes/paths";

const schema = z.object({
  username: z.string().min(1, "Usuario es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
});

export interface ILoginUIHook {
  activeSessions: ICheckSessionResult[];
  setActiveSessions: (data: ICheckSessionResult[]) => void;
  control: Control<ILoginRequest>;
  register: UseFormRegister<ILoginRequest>;
  onSubmit?: (data: ILoginRequest) => void;
  errorFormMessage: (errors: FieldErrors) => void;
  isLoading: boolean;
}

export const useLoginUI = (): ILoginUIHook => {
  const { openNotificationWithIcon } = useNotification();
  const navigate = useNavigate();
  // const token = useAuthStore().token;
  const { encryptData } = useEncrypt();
  const { control, register } = useForm<ILoginRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [activeSessions, setActiveSessions] = useState<ICheckSessionResult[]>([]);
  const { errorFormMessage } = useErrorFormulario();
  const { openModal, closeModal } = useModalResponsive();
  const { mutate: checkSession, isPending: isPendingCheckSession } = useCheckSession();
  const { mutate: exchangeCode, isPending: isPendingExchangeCode } = useExchangeCode();
  const { mutate: login, isPending: isPendingLogin } = useLogin();

  const isLoading = isPendingCheckSession || isPendingExchangeCode || isPendingLogin;

  const { setToken } = useAuthStore();

  const handleOpenModal = (activeSessions: ICheckSessionResult[]) => {
    openModal({
      title: "Sesiones activas",
      height: "auto",
      width: "auto",
      content: (
        <ActiveSessionsUI
          activeSessions={activeSessions}
          username={control._getWatch("username")}
          password={control._getWatch("password")}
        />
      ),
      footer: (
        <div className="flex flex-row w-full justify-end gap-2">
          <Button
            size={"middle"}
            label={"Cerrar"}
            type="secondary"
            default={true}
            onClick={() => {
              closeModal();
            }}
          />
          <Button
            size={"middle"}
            label={"Continuar"}
            type="primary"
            onClick={() => {
              closeModal();
            }}
          />
        </div>
      ),
    });
  };

  const handleErrorMessage = (error: AxiosErrorType) => {
    openNotificationWithIcon({
      type: "error",
      message: error.response?.data?.message ?? "Error al verificar la sesión",
    });
  };

  const onSubmitLogin = (dataLogin: ILoginRequest) => {
    const password = dataLogin.password;
    const passwordEncrypted = encryptData(password);
    const newDataLogin = { ...dataLogin, password: passwordEncrypted };

    checkSession(newDataLogin, {
      onSuccess: (dataCheckSession) => {
        if (dataCheckSession.length > 0) {
          handleOpenModal(dataCheckSession);
        } else {
          login(newDataLogin, {
            onSuccess: (data) => {
              exchangeCode(
                {
                  claimCode: data,
                },
                {
                  onSuccess: (data) => {
                    setToken(data.access);
                    localStorage.setItem(KEY_STORE.REFRESH_TOKEN, data.refresh);
                    navigate(PATHS.home());
                  },
                  onError: (error) => {
                    handleErrorMessage(error);
                  },
                },
              );
            },
            onError: (error) => {
              handleErrorMessage(error);
            },
          });
        }
      },
      onError: (error) => {
        handleErrorMessage(error);
      },
    });
  };

  return {
    activeSessions,
    setActiveSessions,
    control,
    register,
    onSubmit: onSubmitLogin,
    errorFormMessage,
    isLoading,
  };
};
