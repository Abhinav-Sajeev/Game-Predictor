import React from "react";
import { cn } from "../../utils/helpers";

const Loader = ({
  variant = "spinner", // "spinner" | "card" | "table" | "stats" | "line"
  count = 1,
  className = ""
}) => {
  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 gap-3", className)}>
        {/* Soccer ball rotation spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-dashed border-secondary/40 animate-spin [animation-direction:reverse] [animation-duration:3s]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/80 animate-pulse font-display">
          Loading Fixtures...
        </p>
      </div>
    );
  }

  // Shimmer Skeletons
  const renderSkeletons = () => {
    const items = [];
    
    for (let i = 0; i < count; i++) {
      if (variant === "card") {
        items.push(
          <div key={i} className="glass-panel border border-white/5 rounded-xl p-5 w-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 rounded shimmer" />
              <div className="w-16 h-4 rounded shimmer" />
            </div>
            <div className="flex items-center justify-between py-2 gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full shimmer" />
                <div className="w-16 h-3 rounded shimmer" />
              </div>
              <div className="w-8 h-8 rounded-full shimmer" />
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full shimmer" />
                <div className="w-16 h-3 rounded shimmer" />
              </div>
            </div>
            <div className="w-full h-10 rounded-lg shimmer mt-2" />
          </div>
        );
      } else if (variant === "table") {
        items.push(
          <div key={i} className="flex flex-col gap-3.5 py-4 px-6 border-b border-white/5">
            <div className="flex items-center justify-between gap-4">
              <div className="w-8 h-4 rounded shimmer" />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full shimmer" />
                <div className="w-28 h-4 rounded shimmer" />
              </div>
              <div className="w-16 h-4 rounded shimmer" />
              <div className="w-16 h-4 rounded shimmer" />
              <div className="w-12 h-4 rounded shimmer" />
            </div>
          </div>
        );
      } else if (variant === "stats") {
        items.push(
          <div key={i} className="glass-panel border border-white/5 rounded-xl p-5 flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="w-20 h-3 rounded shimmer" />
              <div className="w-14 h-8 rounded shimmer" />
            </div>
            <div className="w-10 h-10 rounded-lg shimmer" />
          </div>
        );
      } else {
        // "line"
        items.push(
          <div key={i} className={cn("w-full h-4 rounded shimmer", className)} />
        );
      }
    }
    
    return items;
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", variant === "table" ? "gap-0" : "")}>
      {renderSkeletons()}
    </div>
  );
};

export default Loader;
