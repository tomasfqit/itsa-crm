import { UIProvider } from "@itsa-develop/itsa-fe-components";
import { ReactNode } from "react";

export const AppGuard = ({ children }: { children: ReactNode }) => {
  return <UIProvider>{children}</UIProvider>;
};
