import React from "react";
import { Trophy, TrendingUp, Percent, Award } from "lucide-react";
import Card from "../common/Card";

const RankCard = ({ userRank }) => {
  if (!userRank) return null;

  const { rank, totalPlayers, playerStats } = userRank;

  const stats = [
    { label: "Points Score", value: playerStats.totalPoints, icon: <Award className="w-4 h-4 text-primary" /> },
    { label: "Predictions", value: playerStats.predictionsCount, icon: <TrendingUp className="w-4 h-4 text-secondary" /> },
    // { label: "Accuracy", value: `${playerStats.accuracy}%`, icon: <Percent className="w-4 h-4 text-accent" /> }
  ];

  return (
    <Card glow glowColor="primary" className="bg-card-dark text-white p-5 border border-white/5 relative overflow-hidden select-none">
      {/* Background graphic */}
      <div className="absolute right-0 bottom-0 text-[10rem] font-black font-display text-white/2 leading-none transform translate-y-6 translate-x-4">
        #{rank}
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-wider leading-none">Your Competition Standing</span>
            <h3 className="text-lg font-black font-display text-white light:text-bg-dark mt-1 leading-none">
              Rank #{rank} <span className="text-xs font-semibold text-text-secondary-dark">of {totalPlayers}</span>
            </h3>
          </div>
        </div>

        <div className="h-px bg-white/5 dark:bg-white/5 light:bg-black/5" />

        <div className="grid grid-cols-3 gap-2 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center p-2 rounded-xl bg-white/3 dark:bg-white/3 border border-white/5">
              <span className="mb-1">{s.icon}</span>
              <span className="text-sm font-black font-display text-white light:text-bg-dark leading-none">{s.value}</span>
              <span className="text-[9px] font-semibold text-text-secondary-dark mt-1 leading-none">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RankCard;
