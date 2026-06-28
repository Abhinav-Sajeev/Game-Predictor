/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/admin/matches`;

export interface ResultPayload {
  actualTeamAScore: number;
  actualTeamBScore: number;
  penaltyWinnerTeam?: string | null;
}

export interface ResultResponse {
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
    actualTeamAScore: number;
    actualTeamBScore: number;
    penaltyWinnerTeam?: string | null;
    actualWinner: string | null;
    status: string;
  };
}

/**
 * Publishes final match outcomes to the backend database by its ID
 * @param matchId - The ID of the match
 * @param payload - Object containing final scores
 */
export const submitResultAPI = async (matchId: string, payload: ResultPayload): Promise<ResultResponse> => {
  const token = localStorage.getItem("fifa_token") || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const response = await axios.post<ResultResponse>(
    `${API_BASE_URL}/${matchId}/result`,
    payload,
    {
      headers
    }
  );
  return response.data;
};
