import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "resident" | "provider";
}

const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }

      if (requiredUserType && user.user_type !== requiredUserType) {
        navigate("/login");
        return;
      }
    }
  }, [user, loading, navigate, requiredUserType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (requiredUserType && user.user_type !== requiredUserType)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;