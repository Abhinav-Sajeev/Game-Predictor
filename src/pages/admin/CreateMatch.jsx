import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMatches } from "../../hooks/useMatches";
import { createMatchAPI } from "../../api/matcmaking";
import CreateMatchForm from "../../components/admin/CreateMatchForm";
import Card from "../../components/common/Card";

const AdminCreateMatch = () => {
  const navigate = useNavigate();
  const { triggerToast } = useAuth();
  const { createMatch } = useMatches();

  const handleCreateSuccess = async (matchData) => {
    try {
      // Helper to strip milliseconds (.000) from ISO date strings to match the API payload format exactly
      const formatAPIDate = (isoStr) => {
        if (!isoStr) return "";
        return isoStr.split('.')[0] + 'Z';
      };

      const apiPayload = {
        teamA: matchData.teamA,
        teamB: matchData.teamB,
        matchDateTime: formatAPIDate(matchData.matchDateTime),
        predictionClosingTime: formatAPIDate(matchData.predictionClosingTime),
        perfectScorePoint: parseInt(matchData.perfectScorePoint, 10),
        winnerOnlyPoint: parseInt(matchData.winnerOnlyPoint, 10)
      };

      // 1. Send API request to the backend
      const apiResponse = await createMatchAPI(apiPayload);

      if (apiResponse && apiResponse.success === false) {
        throw new Error(apiResponse.message || "Failed to create match fixture");
      }

      // 2. Extract match details returned from the backend (with fallback)
      const backendMatch = apiResponse.match || {};
      const matchId = backendMatch.id || backendMatch._id || `match-${Date.now()}`;

      // 3. Save to local storage database for consistency across the application
      await createMatch({
        id: matchId,
        teamA: matchData.teamA,
        teamB: matchData.teamB,
        teamAFlag: matchData.teamAFlag,
        teamBFlag: matchData.teamBFlag,
        dateTime: matchData.matchDateTime,
        closingTime: matchData.predictionClosingTime || matchData.matchDateTime,
        perfectPoints: parseInt(matchData.perfectScorePoint, 10),
        winnerPoints: parseInt(matchData.winnerOnlyPoint, 10)
      });

      triggerToast("New match fixture created! ⚽", "success");
      navigate("/admin/matches");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create match fixture";
      triggerToast(errorMsg, "error");
      throw new Error(errorMsg);
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
            <PlusCircle className="w-5.5 h-5.5 text-primary" />
            Create Match Pool
          </h1>
        </div>
      </div>

      <div className="max-w-2xl w-full">
        <Card className="bg-card-dark text-white border border-white/5 p-6 md:p-8">
          <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest border-b border-white/5 pb-3.5 mb-6">
            Configure Fixture parameters
          </div>

          <CreateMatchForm onSubmitSuccess={handleCreateSuccess} />
        </Card>
      </div>

    </motion.div>
  );
};

export default AdminCreateMatch;
