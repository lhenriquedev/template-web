import { AuthService } from "@/services/AuthService";
import { httpClient } from "@/services/httpClient";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/storage/keys";
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
  const [signedIn, setSignedIn] = useState(() => {
    return !!localStorage.getItem(ACCESS_TOKEN);
  });

  const setupAuth = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }, []);

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

        setupAuth(accessToken, newRefreshToken);

        return httpClient(originalRequest);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, [setupAuth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { accessToken, refreshToken } = await AuthService.signIn({
        email,
        password,
      });

      setupAuth(accessToken, refreshToken);
      setSignedIn(true);
    },
    [setupAuth]
  );

  const signOut = useCallback(() => {
    localStorage.clear();
    setSignedIn(false);
  }, []);

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
