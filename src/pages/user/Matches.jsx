import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMatches } from "../../hooks/useMatches";
import { predictionService } from "../../services/predictionService";
import MatchList from "../../components/match/MatchList";
import Modal from "../../components/common/Modal";
import PredictionForm from "../../components/match/PredictionForm";

const Matches = () => {
  const { user, triggerToast } = useAuth();
  const { matches, loading, fetchMatches } = useMatches();
  
  // Predict Score Modal States
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);

  const loadMatchesData = async () => {
    try {
      await fetchMatches();
    } catch (err) {
      triggerToast("Failed to load match listings", "error");
    }
  };

  useEffect(() => {
    loadMatchesData();
  }, [user]);

  const handlePredictionSubmit = async (scoreA, scoreB) => {
    if (!user || !selectedMatch) return;
    try {
      await predictionService.submitPrediction(user.id, selectedMatch.id, scoreA, scoreB);
      triggerToast("Prediction updated successfully! ⚽", "success");
      setIsPredictModalOpen(false);
    } catch (err) {
      triggerToast(err.message || "Failed to submit prediction", "error");
    }
  };

  const openPredictModal = (match) => {
    setSelectedMatch(match);
    setIsPredictModalOpen(true);
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
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">Fixture Pools</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <Calendar className="w-5.5 h-5.5 text-primary" />
            Tournament Matches
          </h1>
        </div>
      </div>

      {/* Fixtures grid listing */}
      <MatchList
        matches={matches}
        predictions={[]}
        loading={loading}
        onPredictClick={openPredictModal}
      />

      {/* Predict Score Modal Trigger */}
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
              onSubmitSuccess={handlePredictionSubmit}
            />
          </div>
        </Modal>
      )}

    </motion.div>
  );
};

export default Matches;
