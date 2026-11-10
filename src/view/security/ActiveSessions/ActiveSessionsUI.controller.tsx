import { ActiveSessionsUIView } from "./ActiveSessionsUI.view";
import { useActiveSessionsUI } from "./ActiveSessionsUI.hook";
import type { ICheckSessionResult } from "@/view/Security/interfaces";

export interface IActiveSessionsUIProps {
  activeSessions: ICheckSessionResult[];
  username: string;
  password: string;
}

export const ActiveSessionsUI: React.FC<IActiveSessionsUIProps> = ({ activeSessions, username, password }) => {
  const hook = useActiveSessionsUI({
    activeSessions,
    username,
    password,
  });

  return <ActiveSessionsUIView {...hook} />;
};
