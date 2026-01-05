import { useForceRender } from "@/hooks/useForceRender";
import { AuthService } from "@/services/AuthService";
import { httpClient } from "@/services/httpClient";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/storage/keys";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  use,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";

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
  const [signedIn, setSignedIn] = useState(
    () => !!localStorage.getItem(ACCESS_TOKEN)
  );

  const queryClient = useQueryClient();
  const forceRender = useForceRender();

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
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (originalRequest.url === "/refresh-token") {
          setSignedIn(false);
          localStorage.clear();
          return Promise.reject(error);
        }

        if (error.response?.status !== 401 || !refreshToken) {
          return Promise.reject(error);
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await AuthService.refreshToken(refreshToken);

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

        return httpClient(originalRequest);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  useLayoutEffect(() => {
    async function load() {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        return;
      }

      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      setSignedIn(true);
    }

    load();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { accessToken, refreshToken } = await AuthService.signIn({
      email,
      password,
    });

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    setSignedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    queryClient.clear();
    forceRender();
    await AuthService.signOut();
    setSignedIn(false);
  }, [queryClient, forceRender]);

  const value: IAuthContextValue = {
    signedIn,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return use(AuthContext);
}
