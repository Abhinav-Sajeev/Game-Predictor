/// <reference types="vite/client" />
import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_FIFA_API_BASE_URL || "http://localhost:5000/api"}/auth`;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
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
 * Registers a new user on the backend API
 * @param payload - Object containing name, email, and password
 */
export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${API_BASE_URL}/register`,
    payload,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
};
