/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/admin/matches`;

export interface MatchPayload {
  teamA: string;
  teamB: string;
  matchDateTime: string;
  predictionClosingTime: string;
  perfectScorePoint: number;
  winnerOnlyPoint: number;
}

export interface MatchResponse {
  success: boolean;
  message?: string;
  match?: {
    id: string;
    teamA: string;
    teamB: string;
    matchDateTime: string;
    predictionClosingTime: string;
    perfectScorePoint: number;
    winnerOnlyPoint: number;
    status: string;
  };
}

/**
 * Creates a new match fixture on the backend API
 * @param payload - Object containing match details
 */
export const createMatchAPI = async (payload: MatchPayload): Promise<MatchResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.post<MatchResponse>(
    API_BASE_URL,
    payload,
    {
      headers
    }
  );
  return response.data;
};
