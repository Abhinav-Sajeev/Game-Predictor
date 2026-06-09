import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import TopThreePodium from "../../components/leaderboard/TopThreePodium";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import Loader from "../../components/common/Loader";

const Leaderboard = () => {
  const { user, triggerToast } = useAuth();
  const { leaderboard, fetchLeaderboard, loading } = useLeaderboard();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        await fetchLeaderboard();
      } catch (err) {
        triggerToast("Failed to load leaderboard standings", "error");
      }
    };
    loadLeaderboard();
  }, [fetchLeaderboard]);

  const topThree = leaderboard.slice(0, 3);
  // Rest of the players
  const restOfPlayers = leaderboard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full text-left"
    >
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">Global standings</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="w-5.5 h-5.5 text-accent animate-bounce" />
            Competition Leaderboard
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6 py-12">
          <Loader variant="spinner" />
          <Loader variant="table" count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Top 3 Podium Grid */}
          {topThree.length > 0 && (
            <div className="py-2.5">
              <TopThreePodium topThree={topThree} />
            </div>
          )}

          {/* Full Rankings list */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 shadow-xl bg-card-dark text-white">
            <LeaderboardTable leaderboard={restOfPlayers} currentUser={user} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard;
