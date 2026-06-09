import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";

const RegisterForm = ({ onSuccess }) => {
  const { register: authRegister } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const passwordVal = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      await authRegister(data.name, data.email, data.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(err.message || "Failed to create account. Please try again.");
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

      {/* Name Input */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your name"
        startIcon={<User className="w-4.5 h-4.5" />}
        error={errors.name?.message}
        {...register("name", {
          required: "Full name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters"
          }
        })}
      />

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
        placeholder="Create password"
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

      {/* Confirm Password Input */}
      <Input
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm your password"
        startIcon={<Lock className="w-4.5 h-4.5" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(v => !v)}
            className="text-text-secondary-dark hover:text-white transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (val) => val === passwordVal || "Passwords do not match"
        })}
      />

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full py-3.5 mt-2 text-sm font-bold uppercase tracking-wider"
        endIcon={<UserPlus className="w-4 h-4" />}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
