import { ReactFlowProvider } from "@xyflow/react";
import { HomeUIView } from "./HomeUI.view";
import { useHomeUIHook } from "./HomeUI.hook";

const HomeBoard = () => {
  const hook = useHomeUIHook();
  return <HomeUIView {...hook} />;
};

const HomeUI = () => {
  return (
    <ReactFlowProvider>
      <HomeBoard />
    </ReactFlowProvider>
  );
};

export default HomeUI;
