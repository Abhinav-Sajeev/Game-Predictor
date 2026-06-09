/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/predictions/my`;

export interface BackendMatchObj {
  _id: string;
  id?: string;
  teamA: string;
  teamB: string;
  matchDateTime: string;
  predictionClosingTime: string;
  perfectScorePoint?: number;
  winnerOnlyPoint?: number;
  actualTeamAScore?: number | null;
  actualTeamBScore?: number | null;
  status?: string;
}

export interface BackendPrediction {
  _id: string;
  id?: string;
  userId: string;
  matchId: string | BackendMatchObj;
  predictedTeamAScore: number;
  predictedTeamBScore: number;
  pointsEarned: number | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyPredictionsResponse {
  success: boolean;
  data?: BackendPrediction[];
  predictions?: BackendPrediction[];
}

/**
 * Fetches all predictions placed by the logged-in player from the backend API
 */
export const getMyPredictionsAPI = async (): Promise<MyPredictionsResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get<MyPredictionsResponse>(
    API_BASE_URL,
    {
      headers
    }
  );
  return response.data;
};
