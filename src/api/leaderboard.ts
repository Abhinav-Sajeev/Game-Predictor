/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/leaderboard`;

export interface LeaderboardUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  totalPoints: number;
  predictionsCount: number;
  accuracy: number;
  avatar?: string | null;
  rank?: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data?: LeaderboardUser[];
  leaderboard?: LeaderboardUser[];
}

/**
 * Fetches the user rankings leaderboard from the backend API
 */
export const getLeaderboardAPI = async (): Promise<LeaderboardResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get<LeaderboardResponse>(
    API_BASE_URL,
    {
      headers
    }
  );
  return response.data;
};
