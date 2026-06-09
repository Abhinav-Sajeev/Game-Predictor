import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "../components/layout/DashboardLayout";

// Components
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";

// User Pages
import UserDashboard from "../pages/user/Dashboard";
import UserMatches from "../pages/user/Matches";
import UserPredictions from "../pages/user/MyPredictions";
import UserLeaderboard from "../pages/user/Leaderboard";
import UserProfile from "../pages/user/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminMatches from "../pages/admin/Matches";
import AdminCreateMatch from "../pages/admin/CreateMatch";
import AdminResults from "../pages/admin/Results";

const AppRoutes = () => {
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Portal Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout
              globalSearchQuery={globalSearchQuery}
              setGlobalSearchQuery={setGlobalSearchQuery}
            />
          </ProtectedRoute>
        }
      >
        {/* User Pages */}
        <Route index element={<UserDashboard />} />
        <Route path="matches" element={<UserMatches />} />
        <Route path="predictions" element={<UserPredictions />} />
        <Route path="leaderboard" element={<UserLeaderboard />} />
        <Route path="profile" element={<UserProfile />} />

        {/* Admin Protected Pages */}
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/matches"
          element={
            <ProtectedRoute adminOnly>
              <AdminMatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/create-match"
          element={
            <ProtectedRoute adminOnly>
              <AdminCreateMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/results"
          element={
            <ProtectedRoute adminOnly>
              <AdminResults />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
