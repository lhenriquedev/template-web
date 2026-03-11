import { describe, expect, it } from "vitest";

import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  hasSessionTokens,
  setSessionTokens,
} from "./session";

describe("session storage", () => {
  it("stores and reads the access and refresh tokens", () => {
    setSessionTokens({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
    expect(hasSessionTokens()).toBe(true);
  });

  it("clears the stored session tokens", () => {
    setSessionTokens({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    clearSessionTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(hasSessionTokens()).toBe(false);
  });
});
