import { Navigate, Outlet } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { useAuth } from "./AuthContext";

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <PageLoader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
