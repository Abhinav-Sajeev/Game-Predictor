import React, { forwardRef } from "react";
import { cn } from "../../utils/helpers";

const Input = forwardRef(({
  label,
  type = "text",
  error,
  className = "",
  containerClassName = "",
  startIcon,
  endIcon,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3.5 text-text-secondary-dark pointer-events-none flex items-center justify-center">
            {startIcon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-card-dark/40 dark:bg-card-dark/40 border border-white/10 dark:border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder-text-secondary-dark/60 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/40 focus:bg-card-dark/70 backdrop-blur-md",
            startIcon ? "pl-11" : "",
            endIcon ? "pr-11" : "",
            error ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/40" : "",
            "light:bg-white/70 light:border-black/10 light:text-bg-dark light:focus:bg-white light:focus:border-secondary light:focus:ring-secondary/40",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3.5 text-text-secondary-dark flex items-center justify-center">
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5 font-medium select-none animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
