import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../common/Loader";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader variant="spinner" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // Redirect standard user away from admin pages
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
