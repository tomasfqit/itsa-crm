import type React from "react";
import type { ILoginUIHook } from "./LoginUI.hook";
import { Login } from "@itsa-develop/itsa-fe-components";
export const LoginUIView: React.FC<ILoginUIHook> = ({ control, onSubmit, errorFormMessage, isLoading }) => {
  return (
    <Login
      control={control}
      onSubmit={control.handleSubmit(onSubmit ?? (() => {}), errorFormMessage)}
      loading={isLoading}
    />
  );
};
