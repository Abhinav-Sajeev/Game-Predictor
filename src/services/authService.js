// Auth Service — session only, no user-list local storage caching
import { STORAGE_KEYS } from "../utils/constants";
import { safeParse } from "../utils/helpers";
import { registerUser } from "../api/Registration";
import { loginUser } from "../api/Login";

export const authService = {
  login: async (email, password) => {
    const response = await loginUser({ email, password });

    const apiUser = response.user || { name: "Player", email, role: "user" };

    const sessionUser = {
      id: apiUser.id || apiUser._id,
      name: apiUser.name || "Player",
      email: apiUser.email || email,
      role: apiUser.role || "user",
      totalPoints: apiUser.totalPoints || 0,
      predictionsCount: apiUser.predictionsCount || 0,
      accuracy: apiUser.accuracy || 0,
      avatar: apiUser.avatar || null
    };

    // Only store session user (for role checks, display name, etc.) and token
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    if (response.token) {
      localStorage.setItem("fifa_token", response.token);
    }

    return sessionUser;
  },

  register: async (name, email, password) => {
    const response = await registerUser({ name, email, password });

    const apiUser = response.user || { name, email, role: "user" };
    const sessionUser = {
      id: apiUser.id || apiUser._id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role || "user",
      totalPoints: 0,
      predictionsCount: 0,
      accuracy: 0,
      avatar: null
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem("fifa_token");
    return true;
  },

  getCurrentUser: () => {
    return safeParse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER), null);
  },

  updateProfile: async (userId, updatedData) => {
    // Update session user in place (no users list — profile update should hit a backend API)
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error("User not found in session");
  }
};
