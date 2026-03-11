import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/storage/keys";

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export function clearSessionTokens() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}

export function hasSessionTokens() {
  return Boolean(getAccessToken() && getRefreshToken());
}

export function setSessionTokens({ accessToken, refreshToken }: SessionTokens) {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
}
