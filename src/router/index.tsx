import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import { SidebarComponent } from "@/components/AppSidebar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { appPaths } from "@/router/paths";

import { AuthGuard } from "./AuthGuard";

const SignInPage = lazy(() => import("@/features/auth/routes/SignInPage"));
const SignUpPage = lazy(() => import("@/features/auth/routes/SignUpPage"));
const DashboardPage = lazy(
  () => import("@/features/dashboard/routes/DashboardPage"),
);

export function Router() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AuthGuard isPrivate />}>
          <Route element={<SidebarComponent />}>
            <Route path={appPaths.dashboard} element={<DashboardPage />} />
          </Route>
        </Route>

        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path={appPaths.signIn} element={<SignInPage />} />
          <Route path={appPaths.signUp} element={<SignUpPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
