import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";

import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";

import { AuthGuard } from "./AuthGuard";

type RenderAuthGuardOptions = {
  initialEntry: string;
  signedIn: boolean;
};

function renderAuthGuard({
  initialEntry,
  signedIn,
}: RenderAuthGuardOptions) {
  const authValue: AuthContextValue = {
    signedIn,
    signIn: async () => undefined,
    signOut: async () => undefined,
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<AuthGuard isPrivate />}>
            <Route path="/" element={<div>Dashboard page</div>} />
          </Route>
          <Route element={<AuthGuard isPrivate={false} />}>
            <Route path="/sign-in" element={<div>Sign in page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("AuthGuard", () => {
  it("redirects unauthenticated users to sign in", async () => {
    renderAuthGuard({
      initialEntry: "/",
      signedIn: false,
    });

    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
  });

  it("redirects authenticated users away from sign in", async () => {
    renderAuthGuard({
      initialEntry: "/sign-in",
      signedIn: true,
    });

    expect(await screen.findByText("Dashboard page")).toBeInTheDocument();
  });
});
