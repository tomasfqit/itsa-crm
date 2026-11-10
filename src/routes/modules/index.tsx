import { Navigate, RouteObject } from "react-router-dom";
import HomeUI from "../../view/main/Home/HomeUI.controller";
import { Suspense } from "react";
export const ROUTE_TREE: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "home",
    element: (
      <Suspense fallback={null}>
        <HomeUI />
      </Suspense>
    ),
  },

];