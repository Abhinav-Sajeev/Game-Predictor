/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/predictions`;

export interface PredictionPayload {
  matchId: string;
  predictedTeamAScore: number;
  predictedTeamBScore: number;
}

export interface PredictionResponse {
  success: boolean;
  message?: string;
  prediction?: {
    id?: string;
    _id?: string;
    userId: string;
    matchId: string;
    predictedTeamAScore: number;
    predictedTeamBScore: number;
    pointsEarned?: number | null;
    status?: string;
  };
}

/**
 * Submits or updates a player's match score prediction on the backend API
 * @param payload - The prediction score details
 */
export const submitPredictionAPI = async (payload: PredictionPayload): Promise<PredictionResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.post<PredictionResponse>(
    API_BASE_URL,
    payload,
    {
      headers
    }
  );
  return response.data;
};
