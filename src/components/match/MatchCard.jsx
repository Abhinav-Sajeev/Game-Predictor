import React, { useState, useEffect } from "react";
import { Award, Lock, CheckCircle, ChevronRight } from "lucide-react";
import { formatMatchDate } from "../../utils/formatDate";
import { cn } from "../../utils/helpers";
import Card from "../common/Card";
import Button from "../common/Button";
import MatchCountdown from "./MatchCountdown";

const MatchCard = ({ match, prediction, onPredictClick }) => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const checkClosing = () => {
      const now = new Date();
      const closing = new Date(match.closingTime);
      setIsClosed(now > closing || match.status === "completed");
    };
    checkClosing();
    const interval = setInterval(checkClosing, 10000);
    return () => clearInterval(interval);
  }, [match]);

  const hasPredicted = !!prediction;
  const isCompleted = match.status === "completed";

  // Determine badge for points earned
  const renderPointsBadge = () => {
    if (!isCompleted || !prediction) return null;
    const pts = prediction.pointsEarned;
    
    if (pts === 10) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider font-display shadow-[0_0_8px_rgba(0,200,150,0.1)]">
          <Award className="w-3 h-3 text-accent" />
          +{pts} pts (Perfect)
        </span>
      );
    } else if (pts === 5) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider font-display">
          <CheckCircle className="w-3 h-3" />
          +{pts} pts (Winner)
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 bg-white/5 border border-white/10 dark:border-white/10 text-text-secondary-dark/60 text-[10px] font-bold rounded-full uppercase tracking-wider font-display">
          0 pts (Missed)
        </span>
      );
    }
  };

  return (
    <Card
      hoverEffect
      glow={isCompleted && prediction?.pointsEarned === 10}
      glowColor="primary"
      className="flex flex-col h-full bg-card-dark text-white select-none border border-white/5"
    >
      {/* Header: Date and Countdown Status */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4 text-xs font-semibold text-text-secondary-dark">
        <span>{formatMatchDate(match.dateTime)}</span>
        
        {!isCompleted ? (
          <MatchCountdown targetDate={match.closingTime} onExpired={() => setIsClosed(true)} />
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-widest text-[9px] font-bold font-display">
            Completed
          </span>
        )}
      </div>

      {/* Match Body: Teams, Flags, Scores */}
      <div className="flex items-center justify-between py-4 relative">
        {/* Team A */}
        <div className="flex flex-col items-center gap-2.5 flex-1 min-w-0">
          <span className="text-3xl md:text-4xl shadow-sm filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse">
            {match.teamAFlag}
          </span>
          <span className="text-sm font-extrabold text-white light:text-bg-dark font-display text-center truncate w-full uppercase tracking-wide">
            {match.teamA}
          </span>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center justify-center gap-1 px-4">
          {isCompleted ? (
            <div className="flex items-center gap-3 bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 rounded-2xl p-2 px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
              <span className="text-2xl font-black font-display text-primary">{match.scoreA}</span>
              <span className="text-xs font-bold text-text-secondary-dark/60 font-display">-</span>
              <span className="text-2xl font-black font-display text-primary">{match.scoreB}</span>
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/3 border border-white/5 dark:border-white/5 select-none">
              <span className="text-sm font-black text-text-secondary-dark/40 font-display uppercase tracking-widest">VS</span>
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2.5 flex-1 min-w-0">
          <span className="text-3xl md:text-4xl shadow-sm filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse">
            {match.teamBFlag}
          </span>
          <span className="text-sm font-extrabold text-white light:text-bg-dark font-display text-center truncate w-full uppercase tracking-wide">
            {match.teamB}
          </span>
        </div>
      </div>

      {/* Footer / Predictions Panel */}
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
        {/* Prediction summary */}
        {hasPredicted ? (
          <div className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl p-3">
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold tracking-wider text-text-secondary-dark">Your Prediction</span>
              <span className="text-xs font-black font-display text-white light:text-bg-dark mt-0.5">
                {prediction.predictScoreA} - {prediction.predictScoreB}
              </span>
            </div>
            {isCompleted ? (
              renderPointsBadge()
            ) : (
              <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[9px] uppercase font-bold rounded-lg tracking-wider font-display">
                Locked
              </span>
            )}
          </div>
        ) : (
          isCompleted && (
            <div className="bg-white/3 border border-white/5 rounded-xl p-3 text-center text-xs text-text-secondary-dark font-semibold">
              No prediction submitted
            </div>
          )
        )}

        {/* Prediction Actions */}
        {!isCompleted && (
          <Button
            onClick={onPredictClick}
            disabled={isClosed}
            variant={hasPredicted ? "outline" : "primary"}
            size="sm"
            className="w-full py-2.5 font-bold uppercase tracking-wider text-xs"
            endIcon={isClosed ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          >
            {isClosed ? "Predictions Closed" : hasPredicted ? "Modify Score" : "Predict Score"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MatchCard;
