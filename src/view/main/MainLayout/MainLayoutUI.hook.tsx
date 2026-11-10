import { ReactNode, useCallback, useMemo } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useGetPermissions, useUserInformation } from "../../../services/security/security.services";
import { CustomFooterModal, ELineBusinessClientCode, ELocalStorageKeys, IPermissions, IProgram, IUserInformation, useAppLayoutStore, useEncrypt, useModalResponsive } from "@itsa-develop/itsa-fe-components";
import { useNavigateWithQuery } from "../../../hooks/useNavigateWithQuery";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { MenuProps } from "antd";

const EMPTY_PERMISSIONS: IPermissions = { agencies: [] };

export interface IMainLayoutUIProps {
  children?: ReactNode;
  isLoading: boolean;
  isErrorResources: boolean;
  handleNavigate: (itemMenu: IProgram) => void;
  handleCloseSession: () => void;
  userOptions: MenuProps;
  userProfileDrawerOpen: boolean;
  userInformation?: IUserInformation;
}

export const useMainLayoutUI = (): IMainLayoutUIProps => {
  const { token, logout } = useAuthStore();
  const [userProfileDrawerOpen, setUserProfileDrawerOpen] = useState(false);
  const [isBootstrapReady, setIsBootstrapReady] = useState(false);
  const { navigateWithQuery } = useNavigateWithQuery();
  const { openModal, closeModal } = useModalResponsive();
  const { setEncryptedDataInStorage } = useEncrypt();
  const currentModule = useAppLayoutStore((state) => state.module);
  const currentModuleId = currentModule?.id;

  const setPermissions = useAppLayoutStore((state) => state.setPermissions);
  const setUserRole = useAppLayoutStore((state) => state.setUserRole);
  const setUserInformation = useAppLayoutStore((state) => state.setUserInformation);
  const setBusinessLineId = useAppLayoutStore((state) => state.setBusinessLineId);
  const setBusinessLineCode = useAppLayoutStore((state) => state.setBusinessLineCode);
  const { data: permissions, isError: isErrorPermissions, isLoading: isLoadingPermissions } = useGetPermissions({
    enabled: !!token,
  });
  const normalizedPermissions = permissions ?? EMPTY_PERMISSIONS;

  const {
    data: userInformation,
    isLoading: isLoadingUserInformation,
    isError: isErrorUserInformation,
  } = useUserInformation({
    enabled: !!token,
  });

  const userRoles = useMemo(() => {
    return userInformation?.roles ?? [];
  }, [userInformation?.roles]);

  const isResourcesLoading = isLoadingUserInformation || isLoadingPermissions;
  const isErrorResources = isErrorPermissions || isErrorUserInformation;
  const isLoading = isResourcesLoading || !isBootstrapReady;

  const userOptions = useMemo(() => {
    return {
      items: [
        {
          key: "profile",
          label: userInformation?.name || "Sin Nombre Usuario",
          icon: <UserOutlined />,
          onClick: () => setUserProfileDrawerOpen(true),
        },
      ],
    };
  }, [userInformation?.name]);

  useEffect(() => {
    if (!currentModuleId || !userInformation || isLoadingPermissions) return;

    const userModule = userRoles.find((role) => role.moduleId === currentModuleId);
    const userInformationData: IUserInformation = {
      identification: userInformation.identification || "",
      identificationType: userInformation.identificationType || "",
      businessLines: userInformation.businessLines ?? [],
      picture: userInformation.picture || "",
      email: userInformation.email || "",
      name: userInformation.name || "",
      roles: userRoles,
      userId: userInformation.userId || 0,
    };
    setUserInformation(userInformationData);
    if (userModule) {
      setUserRole(userModule);
      setEncryptedDataInStorage(ELocalStorageKeys.role, String(userModule.id));
    }
  }, [
    currentModuleId,
    isLoadingPermissions,
    setUserRole,
    userInformation,
    userRoles,
    setEncryptedDataInStorage,
    setUserInformation,
  ]);

  useEffect(() => {
    if (isResourcesLoading) return;

    if (!isErrorResources) {
      setPermissions(normalizedPermissions);

      if (userInformation) {
        setUserInformation(userInformation);
        const businessLine = userInformation.businessLines?.[0];
        if (businessLine?.id) {
          setBusinessLineId(businessLine.id);
        }
        if (businessLine?.code) {
          setBusinessLineCode(businessLine.code as ELineBusinessClientCode);
        }
      }
    }

    setIsBootstrapReady(true);
  }, [
    isResourcesLoading,
    isErrorResources,
    normalizedPermissions,
    userInformation,
    setPermissions,
    setUserInformation,
    setBusinessLineId,
    setBusinessLineCode,
  ]);

  const handleNavigate = useCallback(
    (itemMenu: IProgram) => {
      const path = itemMenu.path;
      if (path === "/home") {
        navigateWithQuery("home");
        return;
      }
      if (path) {
        navigateWithQuery(path);
      } else {
        openModal({
          title: "Error",
          content: "No se puede navegar a este modulo",
          footer: <CustomFooterModal onConfirm={closeModal} confirmLabel="Cerrar" />,
          height: "auto",
          width: "auto",
        });
      }
    },
    [navigateWithQuery, openModal, closeModal],
  );

  const handleCloseSession = () => {
    void logout();
  };

  return { isLoading, isErrorResources, handleNavigate, handleCloseSession, userOptions, userProfileDrawerOpen, userInformation };
};
