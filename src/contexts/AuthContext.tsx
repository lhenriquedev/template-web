import { useProfile } from "@/features/profile/useProfile";
import { useForceRender } from "@/hooks/useForceRender";
import { AuthService } from "@/services/AuthService";
import { httpClient } from "@/services/httpClient";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/storage/keys";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { createContext, use, useCallback, useLayoutEffect } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

interface IAuthContextValue {
  signedIn: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: AuthProviderProps) {
  const { profile, loadProfile, isProfileLoading } = useProfile(false);

  const queryClient = useQueryClient();
  const forceRender = useForceRender();

  const setupAuth = useCallback(
    async (accessToken: string, refreshToken: string) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);

      await loadProfile();
    },
    [loadProfile]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { accessToken, refreshToken } = await AuthService.signIn({
        email,
        password,
      });

      await setupAuth(accessToken, refreshToken);
    },
    [setupAuth]
  );

  const signOut = useCallback(async () => {
    queryClient.clear();
    forceRender();
    await AuthService.signOut();
  }, [queryClient, forceRender]);

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);

      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return config;
    });

    return () => {
      httpClient.interceptors.request.eject(interceptorId);
    };
  }, []);

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (
          !isAxiosError(error) ||
          error.response?.status !== 401 ||
          !error.config ||
          error.config.url === "/refresh-token" ||
          !refreshToken
        ) {
          httpClient.defaults.headers.common.Authorization = null;
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          signOut();
          return Promise.reject(error);
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await AuthService.refreshToken(refreshToken);

        error.config.headers.set("Authorization", `Bearer ${accessToken}`);

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

        return httpClient(error.config);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, [setupAuth]);

  useLayoutEffect(() => {
    async function load() {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        return;
      }

      await setupAuth(accessToken, refreshToken);
    }

    load();
  }, [loadProfile, signOut]);

  const value: IAuthContextValue = {
    signedIn: !!profile,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return use(AuthContext);
}
