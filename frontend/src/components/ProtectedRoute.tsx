import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: ReactNode;
  requireRole?: boolean;
}

const ProtectedRoute = ({ children, requireRole = true }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireRole && !user.role) return <Navigate to="/select-role" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
