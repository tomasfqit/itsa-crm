import { clearLocalStorage } from "@itsa-develop/itsa-fe-components";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiInstance } from "../api/config";
import { API_ROUTES } from "../api/routes";
import { APIS_VERSIONS, KEY_STORE } from "../constants";

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,

      setToken: (token: string) => {
        set({ token }, false, "setToken");
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem(KEY_STORE.REFRESH_TOKEN);
          if (!refreshToken) {
            clearLocalStorage();
            return;
          }
          const res = await apiInstance.post(`${APIS_VERSIONS.security}${API_ROUTES.logout}`, {
            refresh: refreshToken,
          });
          if (res.status === 200) {
            clearLocalStorage();
            window.location.reload();
            return;
          }
        } catch (error) {
          clearLocalStorage();
          console.error("error", error);
          window.location.reload();
          return;
        }
      },
    }),
    { name: "AuthStore" },
  ),
);
