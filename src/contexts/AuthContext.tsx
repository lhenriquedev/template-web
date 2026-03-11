import { AuthService } from "@/services/AuthService";
import { httpClient } from "@/services/httpClient";
import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  hasSessionTokens,
  setSessionTokens,
} from "@/storage/session";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useLayoutEffect, useState } from "react";

import { AuthContext, type AuthContextValue } from "./auth-context";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [signedIn, setSignedIn] = useState(() => hasSessionTokens());

  const queryClient = useQueryClient();

  const clearSessionState = useCallback(() => {
    clearSessionTokens();
    queryClient.clear();
    setSignedIn(false);
  }, [queryClient]);

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.request.use((config) => {
      const accessToken = getAccessToken();

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
      async (error: AxiosError) => {
        const originalRequest = error.config;
        const refreshToken = getRefreshToken();
        const requestUrl = originalRequest?.url;

        if (requestUrl === "/refresh-token") {
          clearSessionState();
          return Promise.reject(error);
        }

        if (
          !originalRequest ||
          error.response?.status !== 401 ||
          !refreshToken
        ) {
          return Promise.reject(error);
        }

        try {
          const refreshedSession = await AuthService.refreshToken(refreshToken);

          setSessionTokens(refreshedSession);
          setSignedIn(true);

          return httpClient(originalRequest);
        } catch (refreshError) {
          clearSessionState();
          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, [clearSessionState]);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await AuthService.signIn({
      email,
      password,
    });

    setSessionTokens(session);
    setSignedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AuthService.signOut();
    } finally {
      clearSessionState();
    }
  }, [clearSessionState]);

  const value: AuthContextValue = {
    signedIn,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
