/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/auth`;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

/**
 * Authenticates user credentials against the backend API
 * @param payload - Object containing email and password
 */
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_BASE_URL}/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
};
