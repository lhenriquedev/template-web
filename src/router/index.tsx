import { Route, Routes } from "react-router";

import { SidebarComponent } from "@/components/AppSidebar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { lazy, Suspense } from "react";
import { AuthGuard } from "./AuthGuard";

const SignIn = lazy(() => import("@/features/auth/SignIn"));
const SignUp = lazy(() => import("@/features/auth/Signup"));

const Home = lazy(() => import("@/pages/Home"));
const Categories = lazy(() => import("@/pages/Categories"));
const Companies = lazy(() => import("@/pages/Companies"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const Profile = lazy(() => import("@/features/profile"));
const BankAccounts = lazy(() => import("@/pages/BankAccounts"));

export function Router() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AuthGuard isPrivate />}>
          <Route element={<SidebarComponent />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bank-accounts" element={<BankAccounts />} />
          </Route>
        </Route>

        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
