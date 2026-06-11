import React from "react";
import { Check } from "lucide-react";
import { formatShortDate } from "../../utils/formatDate";
import Card from "../common/Card";
import FlagDisplay from "../common/FlagDisplay";

const MatchResultCard = ({ match }) => {
  const isDraw = match.scoreA === match.scoreB;
  const teamAWon = match.scoreA > match.scoreB;
  const teamBWon = match.scoreB > match.scoreA;

  return (
    <Card className="p-4 border border-white/5 bg-card-dark text-white select-none">
      <div className="flex flex-col gap-2">
        {/* Match date */}
        <div className="text-[10px] font-semibold text-text-secondary-dark/60 uppercase tracking-widest text-left">
          {formatShortDate(match.dateTime)}
        </div>

        {/* Scoreboard row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <FlagDisplay emoji={match.teamAFlag} className="w-6 h-4 filter drop-shadow-md select-none" />
            <span className={`text-xs font-bold font-display truncate ${teamAWon ? "text-primary font-black" : "text-text-secondary-dark"}`}>
              {match.teamA}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 dark:border-white/10 rounded-xl font-display font-extrabold text-sm text-primary select-none">
            <span>{match.scoreA}</span>
            <span className="text-text-secondary-dark/40 font-bold">:</span>
            <span>{match.scoreB}</span>
          </div>

          <div className="flex items-center justify-end gap-3.5 flex-1 min-w-0 text-right">
            <span className={`text-xs font-bold font-display truncate ${teamBWon ? "text-primary font-black" : "text-text-secondary-dark"}`}>
              {match.teamB}
            </span>
            <FlagDisplay emoji={match.teamBFlag} className="w-6 h-4 filter drop-shadow-md select-none" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MatchResultCard;
