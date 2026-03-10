import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { user } = useAuth();

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render children (allows guest access if requireAuth is false)
  return children;
}
