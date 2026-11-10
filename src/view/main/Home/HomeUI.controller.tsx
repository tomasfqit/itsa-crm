import { HomeUIView } from "./HomeUI.view";
import { useHomeUIHook } from "./HomeUI.hook";

const HomeUI = () => {
  const hook = useHomeUIHook();
  return <HomeUIView {...hook} />;
};

export default HomeUI;
