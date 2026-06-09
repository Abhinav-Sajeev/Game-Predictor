/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/admin/matches`;

export interface MatchFromAPI {
  _id: string;
  teamA: string;
  teamB: string;
  matchDateTime: string;
  predictionClosingTime: string;
  perfectScorePoint: number;
  winnerOnlyPoint: number;
  actualTeamAScore: number | null;
  actualTeamBScore: number | null;
  actualWinner: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface MatchesResponse {
  success: boolean;
  data: {
    total: number;
    matches: MatchFromAPI[];
  };
}

/**
 * Fetches all match fixtures from the backend API
 */
export const getMatchesAPI = async (): Promise<MatchesResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get<MatchesResponse>(
    API_BASE_URL,
    {
      headers
    }
  );
  return response.data;
};
