import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, requireAuth = true, allowGuest = false }) {
  const { user, isGuest } = useAuth();

  // If authentication is required and user is not logged in (or guest not allowed), redirect to login
  if (requireAuth && !user && !(allowGuest && isGuest)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
