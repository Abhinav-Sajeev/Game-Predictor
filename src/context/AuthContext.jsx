import React, { createContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../utils/constants";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark"); // "dark" or "light"
  const [toast, setToast] = useState(null); // { message, type: "success" | "error" | "info" }

  // Check current session & theme on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Auth initialization error", err);
      } finally {
        setLoading(false);
      }
    };

    // Initialize Theme
    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    setTheme(storedTheme);
    if (storedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    initAuth();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    // Clear toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      triggerToast(`Welcome back, ${loggedUser.name}! ⚽`, "success");
      return loggedUser;
    } catch (error) {
      setLoading(false);
      triggerToast(error.message || "Failed to sign in.", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const registeredUser = await authService.register(name, email, password);
      setUser(registeredUser);
      triggerToast("Account registered successfully! Welcome! 🏆", "success");
      return registeredUser;
    } catch (error) {
      setLoading(false);
      triggerToast(error.message || "Failed to create account.", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      triggerToast("Logged out successfully.", "info");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    if (!user) throw new Error("No active user session");
    try {
      const updatedUser = await authService.updateProfile(user.id, updatedData);
      setUser(updatedUser);
      triggerToast("Profile updated successfully!", "success");
      return updatedUser;
    } catch (error) {
      triggerToast(error.message || "Failed to update profile.", "error");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    theme,
    toggleTheme,
    login,
    register,
    logout,
    updateProfile,
    triggerToast
  };

  // Toast theme styles
  const toastStyles = {
    success: "bg-primary border-primary/20 text-bg-dark shadow-[0_0_20px_rgba(0,200,150,0.3)]",
    error: "bg-red-500 border-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    info: "bg-secondary border-secondary/20 text-white shadow-[0_0_20px_rgba(26,115,232,0.3)]"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Toast Notification Mount */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-bold font-display select-none ${
              toastStyles[toast.type]
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === "error" && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}
            
            <span>{toast.message}</span>
            
            <button
              onClick={() => setToast(null)}
              className="ml-3 hover:bg-black/10 rounded-lg p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

