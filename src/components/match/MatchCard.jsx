import React, { useState, useEffect } from "react";
import { Award, Lock, CheckCircle, ChevronRight } from "lucide-react";
import { formatMatchDate } from "../../utils/formatDate";
import { cn } from "../../utils/helpers";
import Card from "../common/Card";
import Button from "../common/Button";
import FlagDisplay from "../common/FlagDisplay";
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

  const hasPredicted = 
    (prediction !== undefined && prediction !== null) || (
      match.predictedTeamAScore !== null &&
      match.predictedTeamAScore !== undefined &&
      match.predictedTeamBScore !== null &&
      match.predictedTeamBScore !== undefined &&
      match.predictedWinner !== null &&
      match.predictedWinner !== undefined &&
      match.predictedWinner !== "null"
    );
  const isCompleted = match.status === "completed";

  return (
    <Card
      hoverEffect
      glow={isCompleted && (prediction?.pointsEarned === 10 || match.pointsEarned === 10)}
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
          <FlagDisplay emoji={match.teamAFlag} className="w-10 h-7 md:w-12 md:h-8 shadow-sm filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse" />
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
          <FlagDisplay emoji={match.teamBFlag} className="w-10 h-7 md:w-12 md:h-8 shadow-sm filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse" />
          <span className="text-sm font-extrabold text-white light:text-bg-dark font-display text-center truncate w-full uppercase tracking-wide">
            {match.teamB}
          </span>
        </div>
      </div>

      {/* Footer / Predictions Panel */}
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
        {/* Prediction summary */}
        {hasPredicted ? (
          <div className="flex items-center justify-center bg-white/3 border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-primary tracking-wide">
              {isCompleted ? "Prediction Submitted" : "Prediction submitted"}
            </span>
          </div>
        ) : (
          isCompleted && (
            <div className="bg-white/3 border border-white/5 rounded-xl p-3 text-center text-xs text-text-secondary-dark font-semibold">
              No Prediction Submitted
            </div>
          )
        )}

        {/* Prediction Actions */}
        {!isCompleted && !hasPredicted && (
          <Button
            onClick={onPredictClick}
            disabled={isClosed}
            variant="primary"
            size="sm"
            className="w-full py-2.5 font-bold uppercase tracking-wider text-xs"
            endIcon={isClosed ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          >
            {isClosed ? "Predictions Closed" : "Predict Score"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MatchCard;
