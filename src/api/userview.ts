/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api";

export interface AdminUserItem {
  _id: string;
  id?: string;
  name: string;
  totalPoints: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data: AdminUserItem[];
}

/**
 * Fetches all registered users for the admin user management panel
 * GET /api/admin/users
 */
export const getAdminUsers = async (): Promise<AdminUsersResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get<AdminUsersResponse>(
    `${API_BASE_URL}/admin/users`,
    { headers }
  );
  return response.data;
};
