/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/admin/matches`;

export interface DeleteResponse {
  success: boolean;
  message?: string;
}

/**
 * Deletes a match fixture from the backend database by its ID
 * @param matchId - The ID of the match to delete
 */
export const deleteMatchAPI = async (matchId: string): Promise<DeleteResponse> => {
  const token = localStorage.getItem("fifa_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.delete<DeleteResponse>(
    `${API_BASE_URL}/${matchId}`,
    {
      headers
    }
  );
  return response.data;
};
