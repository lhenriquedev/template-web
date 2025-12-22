import { Navigate, Outlet } from "react-router";

export function AuthGuard({ isPrivate }: { isPrivate: boolean }) {
  const signedIn = true;

  if (signedIn && !isPrivate) {
    return <Navigate to="/" replace />;
  }

  if (!signedIn && isPrivate) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
