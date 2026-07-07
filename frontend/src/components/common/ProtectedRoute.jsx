import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="loading-line">Checking your session…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && String(user.role || "").trim().toLowerCase() !== String(requiredRole).trim().toLowerCase()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
