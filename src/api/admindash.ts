/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api";

export interface AdminDashboardStats {
  totalUsers: number;
  totalMatches: number;
  totalPredictions: number;
  completedMatches: number;
  activeMatches: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
}

/**
 * Fetches overall admin dashboard statistics from the backend
 * GET /api/admin/dashboard
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get<AdminDashboardResponse>(
    `${API_BASE_URL}/admin/dashboard`,
    { headers }
  );
  return response.data;
};
