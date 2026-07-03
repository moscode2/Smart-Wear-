import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { Loader } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader className="h-8 w-8 text-plum-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
