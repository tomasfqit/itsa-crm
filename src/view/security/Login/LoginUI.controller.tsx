import { LoginUIView } from "./LoginUI.view";
import { useLoginUI } from "./LoginUI.hook";
import { UIProvider } from "@itsa-develop/itsa-fe-components";
const LoginUI = () => {
  const hook = useLoginUI();

  return (
    <UIProvider>
      <LoginUIView {...hook} />
    </UIProvider>
  );
};

export default LoginUI;
