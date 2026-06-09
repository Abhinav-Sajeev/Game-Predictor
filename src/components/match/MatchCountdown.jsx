import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { formatCountdown } from "../../utils/formatDate";
import { cn } from "../../utils/helpers";

const MatchCountdown = ({ targetDate, onExpired, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(() => formatCountdown(targetDate));

  useEffect(() => {
    if (!targetDate) return;

    // Initial tick
    const tick = () => {
      const formatted = formatCountdown(targetDate);
      setTimeLeft(formatted);
      if (formatted?.expired && onExpired) {
        onExpired();
      }
    };
    
    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpired]);

  if (!timeLeft) return null;

  const isExpired = timeLeft.expired;
  
  // Decide badge colors
  let colorClass = "bg-primary/10 border-primary/20 text-primary";
  if (isExpired) {
    colorClass = "bg-white/5 border-white/10 dark:border-white/10 text-text-secondary-dark/60";
  } else if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 60) {
    // Less than an hour
    colorClass = "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse";
  } else if (timeLeft.days === 0 && timeLeft.hours < 4) {
    // Less than 4 hours
    colorClass = "bg-amber-500/10 border-amber-500/20 text-amber-400";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider font-display select-none",
        colorClass,
        className
      )}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{timeLeft.text}</span>
    </div>
  );
};

export default MatchCountdown;
