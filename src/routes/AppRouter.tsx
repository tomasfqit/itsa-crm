import { ErrorPage } from "@itsa-develop/itsa-fe-components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppGuard } from "./AppGuard";
import { lazy, ReactNode, Suspense } from "react";
import { redirect } from "react-router-dom";
import { fetchAccessToken } from "../api/config";
import { ROUTE_TREE } from "./modules";

const MainLayoutUI = lazy(() => import("../view/main/MainLayout/MainLayoutUI.controller"));
const LoginUI = lazy(() => import("../view/security/Login/LoginUI.controller"));

const renderLazyElement = (element: ReactNode) => <Suspense fallback={null}>{element}</Suspense>;

export const requireAuthLoader = async () => {
  const token = await fetchAccessToken();
  return token !== null;
};

export const redirectIfAuthenticatedLoader = async () => {
  const token = await fetchAccessToken();
  if (token) return redirect("/home");
  return null;
};


const mainLayoutLoader = async () => {
  const responseRequireAuthLoader = await requireAuthLoader();
  if (responseRequireAuthLoader) {
    return null;
  } else {
    return redirect("/login");
  }
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    HydrateFallback: () => null,
    element: <AppGuard>{renderLazyElement(<MainLayoutUI />)}</AppGuard>,
    loader: mainLayoutLoader,
    shouldRevalidate: ({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname,
    children: ROUTE_TREE,
  },
  {
    path: "/login",
    HydrateFallback: () => null,
    element: <AppGuard>{renderLazyElement(<LoginUI />)}</AppGuard>,
    loader: redirectIfAuthenticatedLoader,
  },
  {
    path: "*",
    element: <ErrorPage handleClick={() => window.history.back()} />,
  },
]);

export const AppRouter = () => <RouterProvider router={appRouter} />;
