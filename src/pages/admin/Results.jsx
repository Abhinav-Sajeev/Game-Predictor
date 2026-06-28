import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../../hooks/useAuth";
import { useMatches } from "../../hooks/useMatches";
import ResultEntryForm from "../../components/admin/ResultEntryForm";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

const AdminResults = () => {
  const { triggerToast } = useAuth();
  const { matches, loading, fetchMatches, submitResult } = useMatches();

  useEffect(() => {
    fetchMatches();
  }, []);

  const handlePublishSuccess = async (matchId, scoreA, scoreB, penaltyWinnerTeam = null) => {
    try {
      await submitResult(matchId, scoreA, scoreB, penaltyWinnerTeam);
      
      // Fire confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      triggerToast("Results published and player points recalculated! 🏆", "success");
      fetchMatches(); // Reload match states
    } catch (err) {
      triggerToast(err.message || "Failed to publish match results", "error");
    }
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
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">Administration</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <PenTool className="w-5.5 h-5.5 text-primary" />
            Publish Scores & Results
          </h1>
        </div>
      </div>

      <div className="max-w-3xl w-full">
        <Card className="bg-card-dark text-white border border-white/5 p-6 md:p-8">
          <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest border-b border-white/5 pb-3.5 mb-6">
            Choose active fixture
          </div>

          {loading ? (
            <Loader variant="spinner" />
          ) : (
            <ResultEntryForm matches={matches} onSubmitSuccess={handlePublishSuccess} />
          )}
        </Card>
      </div>

    </motion.div>
  );
};

export default AdminResults;
