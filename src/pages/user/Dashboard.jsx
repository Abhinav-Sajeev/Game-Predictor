import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Calendar, Trophy, Users, Shield, ArrowRight, TrendingUp } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMatches } from "../../hooks/useMatches";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { predictionService } from "../../services/predictionService";
import { fifaBanner, trophy as trophyImg, defaultAvatar } from "../../assets";
import { cn } from "../../utils/helpers";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatsCards from "../../components/admin/StatsCards";
import MatchCard from "../../components/match/MatchCard";
import MatchResultCard from "../../components/match/MatchResultCard";
import Modal from "../../components/common/Modal";
import PredictionForm from "../../components/match/PredictionForm";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const { user, triggerToast } = useAuth();
  const { matches, loading: matchesLoading, fetchMatches } = useMatches();
  const { leaderboard, userRank, loading: rankLoading, fetchLeaderboard, fetchUserRank } = useLeaderboard();
  
  const [predictions, setPredictions] = useState([]);
  const [loadingPreds, setLoadingPreds] = useState(true);
  
  // Predict Score Modal States
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      await fetchMatches();
      await fetchLeaderboard();
      if (user && user.role !== "admin") {
        await fetchUserRank(user.id);
        const preds = await predictionService.getPredictionsByUserId(user.id);
        setPredictions(preds);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoadingPreds(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  // Handle score submission
  const handlePredictionSubmit = async (scoreA, scoreB, penaltyWinner = null) => {
    if (!user || !selectedMatch) return;
    try {
      await predictionService.submitPrediction(user.id, selectedMatch.id, scoreA, scoreB, penaltyWinner);
      triggerToast("Prediction saved! Good luck! ⚽", "success");
      setIsPredictModalOpen(false);
      // Reload predictions state
      const updated = await predictionService.getPredictionsByUserId(user.id);
      setPredictions(updated);
    } catch (err) {
      triggerToast(err.message || "Failed to save prediction", "error");
    }
  };

  const openPredictModal = (match) => {
    setSelectedMatch(match);
    setIsPredictModalOpen(true);
  };

  // Filter lists
  const upcomingMatches = matches
    .filter(m => m.status === "upcoming")
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 3);

  const completedMatches = matches
    .filter(m => m.status === "completed")
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    .slice(0, 3);

  const topFive = leaderboard.slice(0, 5);

  const userStats = [
    {
      label: "Total Points",
      value: user?.role === "admin" ? "-" : `${user?.totalPoints || 0} PTS`,
      icon: <Award className="w-5 h-5 text-primary" />,
      subtext: user?.role !== "admin" ? "Recalculated live" : null,
      glow: true,
      glowColor: "primary"
    },
    {
      label: "Current Rank",
      value: user?.role === "admin" ? "-" : userRank ? `#${userRank.rank}` : "Loading",
      icon: <Trophy className="w-5 h-5 text-accent" />,
      subtext: user?.role !== "admin" && userRank ? `of ${userRank.totalPlayers} players` : null,
      glow: false
    },
    {
      label: "Predictions Submitted",
      value: user?.role === "admin" ? "-" : predictions.length,
      icon: <Calendar className="w-5 h-5 text-secondary" />,
      glow: false
    },
    // {
    //   label: "Accuracy Percentage",
    //   value: user?.role === "admin" ? "-" : `${user?.accuracy || 0}%`,
    //   icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    //   glow: false
    // }
  ];

  const pageLoading = matchesLoading || rankLoading || loadingPreds;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 w-full select-none"
    >
      {/* Hero Banner */}
      <div
        className="w-full h-56 md:h-64 rounded-3xl overflow-hidden bg-cover bg-center border border-white/10 dark:border-white/10 light:border-black/5 relative shadow-xl flex flex-col justify-end p-6 md:p-8"
        style={{ backgroundImage: `url(${fifaBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/45 to-transparent dark:from-bg-dark dark:via-bg-dark/45 light:from-black/60 light:via-black/30" />
        
        <div className="relative z-10 flex flex-col items-start text-left max-w-lg gap-2 text-white">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-lg text-primary font-display w-fit">
            Season 2026
          </span>
          <h1 className="text-xl md:text-3xl font-black font-display uppercase tracking-wider leading-tight text-white">
            FIFA Prediction Challenge
          </h1>
          <p className="text-xs md:text-sm text-text-secondary-dark leading-relaxed font-semibold">
            Cast your scores for matches, compete in regional pools, climb leaderboard ranks, and earn gold achievements.
          </p>
          <Link to="/matches" className="mt-2.5">
            <Button size="sm" variant="primary" className="text-xs font-bold uppercase tracking-wider" endIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Start Predicting
            </Button>
          </Link>
        </div>
      </div>

      {/* User Stats Card Deck */}
      {pageLoading ? (
        <Loader variant="stats" count={4} />
      ) : (
        <StatsCards stats={userStats} />
      )}

      {/* Main sections layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Match Fixtures */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Upcoming Matches */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-primary" />
                Upcoming Matches
              </h2>
              <Link to="/matches" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {pageLoading ? (
              <Loader variant="card" count={2} />
            ) : upcomingMatches.length === 0 ? (
              <div className="glass-panel border border-white/5 p-8 text-center text-xs text-text-secondary-dark rounded-2xl">
                No upcoming matches scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={predictions.find(p => p.matchId === match.id)}
                    onPredictClick={() => openPredictModal(match)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Latest Results Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-secondary" />
                Latest Completed Pools
              </h2>
            </div>

            {pageLoading ? (
              <Loader variant="stats" count={2} />
            ) : completedMatches.length === 0 ? (
              <div className="glass-panel border border-white/5 p-8 text-center text-xs text-text-secondary-dark rounded-2xl">
                No matches played yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {completedMatches.map(match => (
                  <MatchResultCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column: Mini Leaderboard */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h2 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-4.5 h-4.5 text-accent animate-bounce" />
              Leaderboard Standings
            </h2>
            <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Full Standings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Card className="flex flex-col gap-3.5 p-5 border border-white/5 bg-card-dark text-white flex-grow">
            <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest mb-1 pb-2 border-b border-white/5 text-left">
              Top 5 Rankings
            </div>

            {pageLoading ? (
              <div className="flex flex-col gap-3.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between items-center py-2.5">
                    <div className="w-16 h-3 rounded shimmer" />
                    <div className="w-10 h-3 rounded shimmer" />
                  </div>
                ))}
              </div>
            ) : topFive.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-secondary-dark">
                Leaderboard is empty.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {topFive.map((player) => {
                  const isMe = player.id === user?.id;
                  let rankColor = "text-text-secondary-dark/60";
                  if (player.rank === 1) rankColor = "text-amber-400 font-extrabold";
                  else if (player.rank === 2) rankColor = "text-slate-300 font-extrabold";
                  else if (player.rank === 3) rankColor = "text-amber-600 font-extrabold";

                  return (
                    <div
                      key={player.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs font-semibold",
                        isMe
                          ? "bg-primary/5 border-primary/20"
                          : "bg-transparent border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("w-5 text-left font-bold font-display text-sm", rankColor)}>
                          #{player.rank}
                        </span>
                        <img
                          src={player.avatar || defaultAvatar}
                          alt={player.name}
                          className="w-7.5 h-7.5 rounded-full object-cover border border-white/10"
                        />
                        <span className={cn("truncate max-w-[85px] md:max-w-[100px] text-left uppercase tracking-wide font-display text-xs", isMe ? "text-primary font-black" : "text-white light:text-bg-dark")}>
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-secondary-dark font-medium">{player.accuracy}% Acc</span>
                        <span className="font-extrabold text-primary font-display text-sm leading-none bg-primary/5 px-2 py-1 border border-primary/10 rounded-lg">
                          {player.totalPoints}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Predict Match Dialog Overlay */}
      {selectedMatch && (
        <Modal
          isOpen={isPredictModalOpen}
          onClose={() => setIsPredictModalOpen(false)}
          title="Predict Match Score"
          size="sm"
        >
          <div className="flex flex-col gap-4 text-center">
            <div className="flex items-center justify-between py-1 bg-white/2 border border-white/5 rounded-xl p-3 mb-2">
              <span className="text-xs font-semibold text-text-secondary-dark">{selectedMatch.teamAFlag} {selectedMatch.teamA}</span>
              <span className="text-xs font-bold text-text-secondary-dark/40 font-display px-2">VS</span>
              <span className="text-xs font-semibold text-text-secondary-dark">{selectedMatch.teamB} {selectedMatch.teamBFlag}</span>
            </div>
            
            <PredictionForm
              match={selectedMatch}
              initialPrediction={predictions.find(p => p.matchId === selectedMatch.id)}
              onSubmitSuccess={handlePredictionSubmit}
            />
          </div>
        </Modal>
      )}

    </motion.div>
  );
};

export default Dashboard;
