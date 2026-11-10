import { useNavigationStore } from "@itsa-develop/itsa-fe-components";
import { useNavigate } from "react-router-dom";

type Primitive = string | number | boolean | null | undefined;

type QueryValue = Primitive | Primitive[];

export type QueryParams = Record<string, QueryValue>;

function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const usp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null) return;
        usp.append(key, String(v));
      });
    } else {
      usp.set(key, String(value));
    }
  });

  const query = usp.toString();
  return query ? `?${query}` : "";
}

export interface NavigateWithQueryOptions {
  replace?: boolean;
}

function isNavigateOptionsLike(value?: QueryParams | NavigateWithQueryOptions): value is NavigateWithQueryOptions {
  if (!value || typeof value !== "object") return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => key === "replace");
}

function normalizeTargetRoute(targetRoute: string): string {
  return targetRoute.replace(/^\/+/, "");
}

function getPathnameWithoutQuery(route: string): string {
  return normalizeTargetRoute(route.split("?")[0] ?? "");
}

function getCurrentPathname(): string {
  if (typeof window === "undefined") return "";
  return normalizeTargetRoute(window.location.pathname);
}

export interface NavigateWithQueryHook {
  navigateWithQuery: (targetRoute: string, params?: QueryParams, options?: NavigateWithQueryOptions) => void;
  goBack: (fallbackRoute?: string, fallbackParams?: QueryParams, options?: NavigateWithQueryOptions) => void;
  printHistory: () => void;
}

export const useNavigateWithQuery = (): NavigateWithQueryHook => {
  const navigate = useNavigate();
  const history = useNavigationStore((state) => state.history);

  const navigateWithQuery = (targetRoute: string, params?: QueryParams, options?: NavigateWithQueryOptions) => {
    const route = normalizeTargetRoute(targetRoute);
    const resolvedOptions = options ?? (isNavigateOptionsLike(params) ? params : undefined);
    const resolvedParams = isNavigateOptionsLike(params) ? undefined : params;
    const qs = buildQuery(resolvedParams);

    void navigate(`/${route}${qs}`, resolvedOptions);
  };

  const goBack = (fallbackRoute?: string, fallbackParams?: QueryParams, options?: NavigateWithQueryOptions) => {
    const currentPathname = getCurrentPathname();
    const reversedHistory = [...history].reverse();
    const previousRoute = reversedHistory.find((route) => getPathnameWithoutQuery(route) !== currentPathname);

    if (previousRoute) {
      const replace = options?.replace ?? true;
      const targetRoute = `/${normalizeTargetRoute(previousRoute)}`;
      void navigate(targetRoute, { replace });
      return;
    }

    if (!fallbackRoute) {
      return;
    }
    const route = normalizeTargetRoute(fallbackRoute);
    const qs = buildQuery(fallbackParams);
    const replace = options?.replace ?? true;
    const targetRoute = `/${route}${qs}`;
    void navigate(targetRoute, { replace });
  };

  //amigo necesitamos una funcion para imprimir el historial de navegacion
  const printHistory = () => {
    console.log("history =>", history);
  };

  return { navigateWithQuery, goBack, printHistory };
};
