import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { stadium, logo } from "../../assets";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative select-none"
      style={{ backgroundImage: `url(${stadium})` }}
    >
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-bg-dark/80 backdrop-blur-xs" />

      {/* Floating entry card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md glass-panel border border-white/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 z-10 text-white"
      >
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <img src={logo} alt="FIFA Predictor Logo" className="h-16 w-16 object-contain animate-bounce" />
          <h2 className="text-2xl font-black font-display uppercase tracking-widest bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
            FIFA Match Predictor
          </h2>
          <p className="text-xs text-text-secondary-dark font-medium uppercase tracking-wider">
            Predict scores, earn points, top the leaderboard
          </p>
        </div>

        <LoginForm onSuccess={(user) => navigate(user?.role === "admin" ? "/admin" : "/")} />

        <div className="mt-6 text-center text-xs text-text-secondary-dark font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-bold transition-all">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
