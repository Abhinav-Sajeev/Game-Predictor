/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/matches/active`;

export interface ActiveMatch {
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
}

export interface ActiveMatchesResponse {
  success: boolean;
  data: {
    total: number;
    matches: ActiveMatch[];
  };
}

/**
 * Fetches all active match fixtures for standard players from the backend API
 */
export const getActiveMatchesAPI = async (): Promise<ActiveMatchesResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get<ActiveMatchesResponse>(
    API_BASE_URL,
    {
      headers
    }
  );
  return response.data;
};
