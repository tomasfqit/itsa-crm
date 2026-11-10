import { IMainLayoutUIProps } from "./MainLayoutUI.hook";
import { AppLayout, UserProfileDrawer } from "@itsa-develop/itsa-fe-components";
import { EmptyState } from "../../../components/render/Common/EmptyState";

export const MainLayoutUIView = ({
  children,
  isLoading,
  isErrorResources,
  handleNavigate,
  handleCloseSession,
  userOptions,
  userProfileDrawerOpen,
  userInformation,
}: IMainLayoutUIProps) => {
  return (
    <>
      <AppLayout
        optionsCompany={[]}
        menuItemsNavigate={handleNavigate}
        loadingAppLayout={isLoading}
        onCloseSession={handleCloseSession}
        userActions={userOptions}
      >
        {isErrorResources ? <EmptyState message="No se pudo cargar la información del usuario" /> : children}
      </AppLayout>
      <UserProfileDrawer
        open={userProfileDrawerOpen}
        onClose={() => {}}
        userInformation={userInformation}
        isLoading={isLoading}
        currentModuleId={0}
      />
    </>
  );
};
