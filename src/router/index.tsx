import { Route, Routes } from "react-router";

import { lazy, Suspense } from "react";
import { AuthGuard } from "./AuthGuard";

const Home = lazy(() => import("@/pages/Home"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/Signup"));

export function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<AuthGuard isPrivate />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
