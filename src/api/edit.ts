/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/admin/matches`;

export interface EditMatchPayload {
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

export interface EditMatchResponse {
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
    actualTeamAScore: number | null;
    actualTeamBScore: number | null;
    actualWinner: string | null;
    status: string;
  };
}

/**
 * Updates an existing match fixture on the backend database by its ID
 * @param matchId - The ID of the match to edit
 * @param payload - The updated match details
 */
export const editMatchAPI = async (matchId: string, payload: EditMatchPayload): Promise<EditMatchResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.put<EditMatchResponse>(
    `${API_BASE_URL}/${matchId}`,
    payload,
    {
      headers
    }
  );
  return response.data;
};
