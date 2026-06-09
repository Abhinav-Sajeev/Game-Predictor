import React from "react";
import { Info } from "lucide-react";
import { cn } from "../../utils/helpers";
import Button from "./Button";

const EmptyState = ({
  title = "No data available",
  message = "Check back later or adjust your filters.",
  icon,
  actionLabel,
  onActionClick,
  className = ""
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 rounded-xl", className)}>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 dark:border-white/10 text-primary mb-4 shadow-sm animate-pulse">
        {icon || <Info className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold font-display text-white light:text-text-primary-light uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-text-secondary-dark mt-1 max-w-sm">
        {message}
      </p>
      {actionLabel && onActionClick && (
        <Button
          variant="primary"
          size="sm"
          className="mt-5"
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
