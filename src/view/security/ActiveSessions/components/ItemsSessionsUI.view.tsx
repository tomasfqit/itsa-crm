import { Button } from "@itsa-develop/itsa-fe-components";
import { ICheckSessionResult } from "../../interfaces";
import { CloseOutlined } from "@ant-design/icons";
import { useCallback } from "react";

export interface IItemsSessionsUIHook {
  session: ICheckSessionResult;
  handleCloseSession: (codeSession: string) => void;
}

export const ItemsSessionsUIView = (props: IItemsSessionsUIHook) => {
  const handleCloseSession = useCallback(() => {
    props.handleCloseSession(props.session.code);
  }, [props]);

  const parser = useCallback((res: string) => {
    const validRes = res ?? "";
    const browserName = validRes.split(" ")[0];
    const browserVersion = validRes.split(" ")[1];
    const osName = validRes.split(" ")[2];
    const osVersion = validRes.split(" ")[3];
    if (!browserName || !osName) {
      return "Dispositivo: Desconocido";
    } else {
      const readableInfo = `Navegador: ${browserName} ${browserVersion} / Sistema: ${osName} ${osVersion}`;
      return readableInfo;
    }
  }, []);

  return (
    <div className="flex flex-row items-center justify-between gap-2 border border-gray-200 rounded-md p-1">
      <div className="flex flex-col gap-0.5">
        <span>
          <strong>IP:</strong> {props.session.ipAddress}
        </span>
        <span>
          <strong>Navegador:</strong> {parser(props.session.userAgent)}
        </span>
        <span>
          {new Date(props.session.startHour).toLocaleDateString("es-EC", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="flex min-h-0 h-full items-start justify-start">
        <Button
          type="primary"
          size="small"
          label={
            <div className="flex flex-row gap-2">
              <CloseOutlined />
              <span>Cerrar sesión</span>
            </div>
          }
          onClick={handleCloseSession}
        />
      </div>
    </div>
  );
};
