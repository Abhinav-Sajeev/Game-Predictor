import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import Card from "../common/Card";

const StatsCards = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none w-full">
      {stats.map((s, idx) => (
        <Card
          key={idx}
          hoverEffect
          glow={s.glow}
          glowColor={s.glowColor || "primary"}
          className="bg-card-dark text-white border border-white/5 flex items-center justify-between p-5"
        >
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary-dark font-display leading-none">
              {s.label}
            </span>
            <span className="text-2xl font-black font-display text-white light:text-bg-dark leading-none">
              {s.value}
            </span>
            {s.subtext && (
              <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" />
                {s.subtext}
              </span>
            )}
          </div>
          
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border bg-white/3 dark:bg-white/3 text-primary ${
            s.glowColor === "secondary" ? "text-secondary border-secondary/20" : s.glowColor === "accent" ? "text-accent border-accent/20" : "text-primary border-primary/20"
          }`}>
            {s.icon}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
