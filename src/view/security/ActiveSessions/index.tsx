// import { useCallback, useMemo, useState } from "react";
// import { ICheckSessionResponse } from "../interfaces";
// import { Button, List, useModalResponsive, useNotification } from "@itsa-develop/itsa-fe-components";
// import { useCloseSession } from "@/services/security/security.service";

// export interface IModalActiveSessionsProps {
//   activeSessions: ICheckSessionResponse[];
// }
// export const ActiveSessionsUIView = ({ activeSessions }: IModalActiveSessionsProps) => {
//   const { closeModal } = useModalResponsive();
//   const [sessionToClose, setSessionToClose] = useState<string[]>([]);
//   const { openNotificationWithIcon } = useNotification();

//   const { mutate: closeSession } = useCloseSession();

//   const parser = useCallback((res: string) => {
//     const validRes = res ?? "";
//     const browserName = validRes.split(" ")[0];
//     const browserVersion = validRes.split(" ")[1];
//     const osName = validRes.split(" ")[2];
//     const osVersion = validRes.split(" ")[3];
//     if (!browserName || !osName) {
//       return "Dispositivo: Desconocido";
//     } else {
//       const readableInfo = `Navegador: ${browserName} ${browserVersion} / Sistema: ${osName} ${osVersion}`;
//       return readableInfo;
//     }
//   }, []);

//   const onCloseSession = useCallback(
//     (session: ICheckSessionResponse) => {
//         const result = session.result;
//       closeSession({ session: result.code }, {
//         onSuccess: () => {
//           setSessionToClose((prev) => [...prev, result.code]);
//           openNotificationWithIcon({ type: "success", message: "Sesión cerrada correctamente" });
//         },
//       });
//     },
//     [closeSession, openNotificationWithIcon, setSessionToClose],
//   );

//   const currentSession = useMemo(() => {
//     if (sessionToClose.length > 0) {
//       return activeSessions.filter((session) => !sessionToClose.includes(session.code));
//     }
//     return activeSessions;
//   }, [sessionToClose, activeSessions]);

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
//         {activeSessions && activeSessions.length > 0 ? (
//           <List
//             itemLayout="horizontal"
//             dataSource={currentSession}
//             renderItem={(item: ICheckSessionResponse) => (
//               <List.Item
//                 key={item.code}
//                 actions={[
//                   <Button type="primary" size="small" label="Cerrar sesión" onClick={() => onCloseSession(item)} />,
//                 ]}
//               >
//                 <List.Item.Meta
//                   title={
//                     <div className="flex items-center gap-2">
//                       <span className="font-medium">{parser(item.userAgent)}</span>
//                       <span className="text-xs text-gray-500">{parser(item.ipAddress)}</span>
//                     </div>
//                   }
//                   description={
//                     <span className="text-xs text-gray-500">
//                       Inicio:{" "}
//                       {new Date(item.startHour).toLocaleDateString("es-EC", {
//                         weekday: "long",
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   }
//                 />
//               </List.Item>
//             )}
//           />
//         ) : (
//           <div className="py-6 text-center text-gray-500 text-sm">No hay sesiones activas</div>
//         )}
//       </div>
//       <div className="flex justify-end">
//         <Button type="primary" size="middle" label="Aceptar" onClick={() => closeModal()} />
//       </div>
//     </div>
//   );
// };
