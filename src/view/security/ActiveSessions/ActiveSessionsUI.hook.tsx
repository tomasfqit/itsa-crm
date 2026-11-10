import type { ICheckSessionResult, ICloseSessionRequest } from "../../../view/security/interfaces";
import { useCloseSession } from "../../../services/security/security.services";
import { useExchangeCode } from "../../../services/security/security.services";
import { useLogin } from "../../../services/security/security.services";
import { useAuthStore } from "../../../store/auth.store";
import { KEY_STORE } from "../../../constants";
import { useMemo, useState } from "react";
import { IActiveSessionsUIProps } from "./ActiveSessionsUI.controller";
import { useNotification } from "@itsa-develop/itsa-fe-components";

export interface IActiveSessionsUIHook {
  activeSessions: ICheckSessionResult[];
  handleCloseSession: (codeSession: string) => void;
  isDisabledContinue: boolean;
  handleContinue: () => void;
  handleCloseAllSessions: () => Promise<void>;
  isClosingSession: boolean;
}

export const useActiveSessionsUI = ({
  activeSessions,
  username,
  password,
}: IActiveSessionsUIProps): IActiveSessionsUIHook => {
  const { openNotificationWithIcon } = useNotification();
  const [sessionsDeleted, setSessionsDeleted] = useState<string[]>([]);
  const { mutate: closeSession, mutateAsync: closeSessionAsync, isPending: isClosingSession } = useCloseSession();
  const { mutate: exchangeCode } = useExchangeCode();
  const { mutate: login } = useLogin();
  const { setToken } = useAuthStore();

  const handleCloseSession = (codeSession: string) => {
    const request: ICloseSessionRequest = {
      session: codeSession,
    };
    closeSession(request, {
      onSuccess: () => {
        setSessionsDeleted([...sessionsDeleted, codeSession]);
        openNotificationWithIcon({
          type: "success",
          message: "Sesión cerrada correctamente",
        });
      },
    });
  };

  const handleContinue = () => {
    login(
      {
        username,
        password,
      },
      {
        onSuccess: (data) => {
          exchangeCode(
            {
              claimCode: data,
            },
            {
              onSuccess: (data) => {
                setToken(data.access);
                localStorage.setItem(KEY_STORE.REFRESH_TOKEN, data.refresh);
                window.location.reload();
              },
            },
          );
        },
      },
    );
  };

  const filterActiveSessions = useMemo(() => {
    const filteredSessions = activeSessions.filter((session) => !sessionsDeleted.includes(session.code));
    return filteredSessions;
  }, [activeSessions, sessionsDeleted]);

  const handleCloseAllSessions = async () => {
    try {
      await Promise.all(
        activeSessions.map((session) => {
          return closeSessionAsync(
            { session: session.code },
            {
              onSuccess: () => {
                setSessionsDeleted([...sessionsDeleted, session.code]);
              },
              onError: (error) => {
                openNotificationWithIcon({
                  type: "error",
                  message: `Error al cerrar la sesión ${session.code}: ${error instanceof Error ? error.message : "Unknown error"}`,
                });
              },
            },
          );
        }),
      );
      openNotificationWithIcon({
        type: "success",
        message: "Sesiones cerradas correctamente",
      });
    } catch (error) {
      openNotificationWithIcon({
        type: "error",
        message: `Error al cerrar las sesiones: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  return {
    activeSessions: filterActiveSessions,
    handleCloseSession: handleCloseSession,
    isDisabledContinue: false,
    handleContinue,
    handleCloseAllSessions,
    isClosingSession,
  };
};
