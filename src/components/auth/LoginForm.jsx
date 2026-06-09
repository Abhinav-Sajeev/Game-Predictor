import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const loggedInUser = await login(data.email, data.password);
      if (onSuccess) onSuccess(loggedInUser);
    } catch (err) {
      setServerError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs font-semibold leading-relaxed">
          {serverError}
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        startIcon={<Mail className="w-4.5 h-4.5" />}
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
      />

      {/* Password Input */}
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        startIcon={<Lock className="w-4.5 h-4.5" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="text-text-secondary-dark hover:text-white transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
          }
        })}
      />

      {/* Tools row */}
      <div className="flex items-center justify-between text-xs font-medium">
        <label className="flex items-center gap-2 text-text-secondary-dark hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            className="rounded bg-card-dark/60 border-white/10 text-primary focus:ring-primary/40 focus:ring-offset-bg-dark h-4 w-4"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        {/* <button
          type="button"
          onClick={() => alert("Demo Password reset email sent! (Simulation)")}
          className="text-primary hover:text-primary/80 transition-colors font-semibold"
        >
          Forgot Password?
        </button> */}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full py-3.5 mt-2 text-sm font-bold uppercase tracking-wider"
        endIcon={<LogIn className="w-4 h-4" />}
      >
        Sign In
      </Button>


    </form>
  );
};

export default LoginForm;
