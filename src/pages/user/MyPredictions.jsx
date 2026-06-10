import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Award, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { predictionService } from "../../services/predictionService";
import { formatMatchDate } from "../../utils/formatDate";
import { cn } from "../../utils/helpers";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

const MyPredictions = () => {
  const { user, triggerToast } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!user) return;
      try {
        const data = await predictionService.getPredictionsByUserId(user.id);
        // Sort: newest matches first
        const sorted = data.sort((a, b) => {
          if (!a.match || !b.match) return 0;
          return new Date(b.match.dateTime) - new Date(a.match.dateTime);
        });
        setPredictions(sorted);
      } catch (err) {
        triggerToast("Failed to fetch prediction history", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, [user?.id]);

  const columns = [
    {
      key: "match",
      header: "Match Fixture",
      className: "pl-4",
      render: (row) => {
        if (!row.match) return <span className="text-text-secondary-dark italic">Deleted Match</span>;
        return (
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg select-none">{row.match.teamAFlag}</span>
              <span className="font-bold text-sm text-white light:text-bg-dark">{row.match.teamA}</span>
              <span className="text-[10px] font-black text-text-secondary-dark/60 font-display select-none">VS</span>
              <span className="font-bold text-sm text-white light:text-bg-dark">{row.match.teamB}</span>
              <span className="text-lg select-none">{row.match.teamBFlag}</span>
            </div>
            <span className="text-[10px] text-text-secondary-dark font-medium leading-none">
              Kickoff: {formatMatchDate(row.match.dateTime)}
            </span>
          </div>
        );
      }
    },
    {
      key: "prediction",
      header: "Your Score",
      className: "text-center font-extrabold text-sm",
      render: (row) => (
        <span className="font-display font-black text-white light:text-bg-dark">
          {row.predictScoreA} - {row.predictScoreB}
        </span>
      )
    },
    {
      key: "result",
      header: "Actual Score",
      className: "text-center",
      render: (row) => {
        if (!row.match) return "-";
        if (row.match.status !== "completed") {
          return (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full bg-white/5 border border-white/10 dark:border-white/10 text-text-secondary-dark/70 font-display">
              Upcoming
            </span>
          );
        }
        return (
          <span className="font-display font-black text-primary">
            {row.match.scoreA} - {row.match.scoreB}
          </span>
        );
      }
    },
    {
      key: "points",
      header: "Points Earned",
      className: "text-center font-bold text-sm",
      render: (row) => {
        if (row.pointsEarned === null) return <span className="text-text-secondary-dark/50">-</span>;
        return (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold font-display border",
            row.pointsEarned === 10
              ? "bg-primary/10 border-primary/20 text-primary"
              : row.pointsEarned === 5
              ? "bg-secondary/10 border-secondary/20 text-secondary"
              : "bg-white/5 border-white/10 text-text-secondary-dark/60"
          )}>
            +{row.pointsEarned} pts
          </span>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      className: "text-center",
      render: (row) => {
        const statusVal = (row.status || "pending").toLowerCase();
        let badgeColor = "bg-white/5 border-white/10 text-text-secondary-dark/60";
        let icon = null;
        let label = statusVal;

        if (statusVal === "completed") {
          badgeColor = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
          icon = <CheckCircle className="w-3 h-3" />;
          label = "Completed";
        } else if (statusVal === "open") {
          badgeColor = "bg-blue-500/15 border-blue-500/30 text-blue-400";
          icon = <Clock className="w-3 h-3" />;
          label = "Open";
        } else if (statusVal === "upcoming" || statusVal === "pending") {
          badgeColor = "bg-amber-500/10 border-amber-500/20 text-amber-400";
          icon = <Clock className="w-3 h-3" />;
          label = statusVal === "upcoming" ? "Upcoming" : "Pending";
        } else if (statusVal === "calculated") {
          badgeColor = "bg-primary/20 border-primary/30 text-primary";
          icon = <CheckCircle className="w-3 h-3" />;
          label = "Calculated";
        }

        return (
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider font-display border",
            badgeColor
          )}>
            {icon}
            {label}
          </span>
        );
      }
    }
  ];

  // Premium Mobile Card layout override
  const renderMobileCard = (pred) => {
    const match = pred.match;
    if (!match) return null;
    
    const statusVal = (pred.status || "pending").toLowerCase();
    const isCompleted = statusVal === "completed" || statusVal === "calculated";

    let verdictClass = "bg-amber-500/10 border-amber-500/20 text-amber-400";
    let verdictText = "Pending";

    if (statusVal === "open") {
      verdictClass = "bg-blue-500/15 border-blue-500/30 text-blue-400";
      verdictText = "Open";
    } else if (isCompleted) {
      if (pred.pointsEarned === 2 || pred.pointsEarned === 10) {
        verdictClass = "bg-primary/10 border-primary/20 text-primary";
        verdictText = `+${pred.pointsEarned} pts (Perfect Score)`;
      } else if (pred.pointsEarned === 1 || pred.pointsEarned === 5) {
        verdictClass = "bg-secondary/10 border-secondary/20 text-secondary";
        verdictText = `+${pred.pointsEarned} pts (Winner correct)`;
      } else {
        verdictClass = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
        verdictText = pred.pointsEarned ? `+${pred.pointsEarned} pts` : "Completed · 0 pts";
      }
    } else if (statusVal === "upcoming") {
      verdictText = "Upcoming";
    }

    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-[9px] uppercase tracking-widest text-text-secondary-dark font-semibold">
            {formatMatchDate(match.dateTime)}
          </span>
          <span className={cn("px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-lg border", verdictClass)}>
            {verdictText}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 font-display font-extrabold text-xs">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <span className="text-white light:text-bg-dark truncate">{match.teamAFlag} {match.teamA}</span>
            <span className="text-white light:text-bg-dark truncate">{match.teamBFlag} {match.teamB}</span>
          </div>

          <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-2 px-3.5 rounded-xl">
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-wider font-bold text-text-secondary-dark">Predict</span>
              <span className="text-sm font-black text-white light:text-bg-dark mt-0.5">{pred.predictScoreA}-{pred.predictScoreB}</span>
            </div>
            <div className="w-px h-6 bg-white/10 dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-wider font-bold text-text-secondary-dark">Actual</span>
              <span className="text-sm font-black text-primary mt-0.5">{isCompleted ? `${match.scoreA}-${match.scoreB}` : "TBD"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full text-left"
    >
      <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">History logs</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <History className="w-5.5 h-5.5 text-primary" />
            My Predictions
          </h1>
        </div>
      </div>

      {loading ? (
        <Loader variant="table" count={3} />
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden shadow-xl p-4 bg-card-dark text-white">
          <Table
            columns={columns}
            data={predictions}
            renderMobileCard={renderMobileCard}
            emptyMessage="You haven't submitted any predictions yet."
            emptyIcon={<History className="w-8 h-8" />}
          />
        </div>
      )}
    </motion.div>
  );
};

export default MyPredictions;
