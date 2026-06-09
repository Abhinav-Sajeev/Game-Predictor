import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  startIcon,
  endIcon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-primary text-bg-dark hover:bg-opacity-95 font-semibold focus:ring-primary shadow-[0_0_15px_rgba(0,200,150,0.3)] hover:shadow-[0_0_22px_rgba(0,200,150,0.55)]",
    secondary: "bg-secondary text-white hover:bg-opacity-95 font-semibold focus:ring-secondary shadow-[0_0_15px_rgba(26,115,232,0.3)] hover:shadow-[0_0_22px_rgba(26,115,232,0.55)]",
    accent: "bg-accent text-bg-dark hover:bg-opacity-95 font-semibold focus:ring-accent shadow-[0_0_15px_rgba(255,215,0,0.3)]",
    outline: "border border-text-secondary-dark/30 text-white hover:bg-white/5 focus:ring-white/20 backdrop-blur-sm",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
    ghost: "text-text-secondary-dark hover:text-white hover:bg-white/5 focus:ring-white/10"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && startIcon && <span className="mr-2">{startIcon}</span>}
      <span>{children}</span>
      {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
    </motion.button>
  );
};

export default Button;
