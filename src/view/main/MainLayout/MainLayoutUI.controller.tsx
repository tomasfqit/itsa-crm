"use client";
import { MainLayoutUIView } from "./MainLayoutUI.view";
import { useMainLayoutUI } from "./MainLayoutUI.hook";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingApp } from "../../../components/render/Loadings/LoadingApp";

const MainLayoutUI = () => {
  const hook = useMainLayoutUI();
  return (
    <div>
      <MainLayoutUIView
        {...hook}
        children={
          <Suspense fallback={<LoadingApp />}>
            <Outlet />
          </Suspense>
        }
      />
    </div>
  );
};

export default MainLayoutUI;
