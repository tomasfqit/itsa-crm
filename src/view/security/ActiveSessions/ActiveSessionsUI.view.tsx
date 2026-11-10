import type React from "react";
import type { IActiveSessionsUIHook } from "./ActiveSessionsUI.hook";
import { ItemsSessionsUIView } from "./components/ItemsSessionsUI.view";
import { Button } from "@itsa-develop/itsa-fe-components";
import { CloseOutlined } from "@ant-design/icons";
import { EmptyState } from "../../../components/render/Common/EmptyState";

export const ActiveSessionsUIView: React.FC<IActiveSessionsUIHook> = ({
  activeSessions,
  handleCloseSession,
  handleCloseAllSessions,
  isClosingSession,
}) => {
  return (
    <div className="flex flex-col gap-2 w-[90dvw] md:w-[70dvw] border border-gray-200 bg-gray-250 rounded-md p-2">
      <div className="flex flex-row items-center justify-end gap-2">
        {activeSessions.length > 1 && (
          <Button
            type="primary"
            label={
              <div className="flex flex-row gap-2">
                <CloseOutlined />
                <span>Cerrar todas las sesiones</span>
              </div>
            }
            onClick={handleCloseAllSessions}
            loading={isClosingSession}
            disabled={isClosingSession}
          />
        )}
      </div>
      <div className="overflow-y-auto max-h-[60dvh] flex flex-col gap-2 bg-white border border-gray-200 rounded-md p-2">
        {activeSessions.map((session) => {
          return <ItemsSessionsUIView key={session.code} session={session} handleCloseSession={handleCloseSession} />;
        })}
        {activeSessions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <EmptyState message="No hay sesiones activas en este momento" />
          </div>
        )}
      </div>
    </div>
  );
};
