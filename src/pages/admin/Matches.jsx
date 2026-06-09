import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, PlusCircle, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useMatches } from "../../hooks/useMatches";
import MatchManagement from "../../components/admin/MatchManagement";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const AdminMatches = () => {
  const { triggerToast } = useAuth();
  const { matches, loading, fetchMatches, updateMatch, deleteMatch } = useMatches();
  const [search, setSearch] = useState("");

  // Edit Modal states
  const [editingMatch, setEditingMatch] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchMatches();
  }, []);

  const openEditModal = (match) => {
    setEditingMatch(match);
    setValue("teamA", match.teamA);
    setValue("teamB", match.teamB);
    // Format to datetime-local expected string 'YYYY-MM-DDThh:mm'
    const formatDateTime = (isoStr) => {
      if (!isoStr) return "";
      return isoStr.substring(0, 16);
    };
    setValue("dateTime", formatDateTime(match.dateTime));
    setValue("closingTime", formatDateTime(match.closingTime));
    setValue("perfectPoints", match.perfectPoints);
    setValue("winnerPoints", match.winnerPoints);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data) => {
    if (!editingMatch) return;
    setEditLoading(true);
    try {
      await updateMatch(editingMatch.id, {
        teamA: data.teamA,
        teamB: data.teamB,
        dateTime: new Date(data.dateTime).toISOString(),
        closingTime: new Date(data.closingTime).toISOString(),
        perfectPoints: parseInt(data.perfectPoints, 10),
        winnerPoints: parseInt(data.winnerPoints, 10)
      });
      triggerToast("Fixture updated successfully! ⚽", "success");
      setIsEditModalOpen(false);
      setEditingMatch(null);
    } catch (err) {
      triggerToast(err.message || "Failed to edit fixture", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (matchId) => {
    try {
      await deleteMatch(matchId);
      triggerToast("Fixture deleted successfully.", "success");
    } catch (err) {
      triggerToast(err.message || "Failed to delete fixture", "error");
    }
  };

  const filteredMatches = matches.filter(m =>
    m.teamA.toLowerCase().includes(search.toLowerCase()) ||
    m.teamB.toLowerCase().includes(search.toLowerCase())
  );

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
            <Calendar className="w-5.5 h-5.5 text-primary" />
            Match Fixtures
          </h1>
        </div>
        <Link to="/admin/create-match">
          <Button size="sm" variant="primary" className="text-xs uppercase tracking-wider font-bold" startIcon={<PlusCircle className="w-4 h-4" />}>
            Create Match
          </Button>
        </Link>
      </div>

      <div className="glass-panel border border-white/5 rounded-2xl p-6 shadow-xl bg-card-dark text-white flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
          <h3 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-wider select-none">
            Fixtures Directory ({filteredMatches.length})
          </h3>
          <input
            type="text"
            placeholder="Search matches by team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 dark:border-white/10 rounded-xl py-2 px-4 text-xs text-white placeholder-text-text-secondary-dark outline-none focus:border-primary max-w-xs w-full"
          />
        </div>

        <MatchManagement
          matches={filteredMatches}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* Edit Match details popup */}
      {editingMatch && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingMatch(null);
          }}
          title="Edit Match Details"
          size="md"
        >
          <form onSubmit={handleSubmit(handleEditSubmit)} className="flex flex-col gap-4 text-left text-white light:text-bg-dark">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Team A Name"
                error={errors.teamA?.message}
                {...register("teamA", { required: "Required" })}
              />
              <Input
                label="Team B Name"
                error={errors.teamB?.message}
                {...register("teamB", { required: "Required" })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Kickoff Date"
                type="datetime-local"
                error={errors.dateTime?.message}
                {...register("dateTime", { required: "Required" })}
              />
              <Input
                label="Closing Date"
                type="datetime-local"
                error={errors.closingTime?.message}
                {...register("closingTime", { required: "Required" })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Perfect Points"
                type="number"
                error={errors.perfectPoints?.message}
                {...register("perfectPoints", { required: "Required" })}
              />
              <Input
                label="Winner Points"
                type="number"
                error={errors.winnerPoints?.message}
                {...register("winnerPoints", { required: "Required" })}
              />
            </div>

            <div className="flex justify-end gap-3.5 border-t border-white/5 pt-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMatch(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={editLoading}
              >
                Save Fixture
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </motion.div>
  );
};

export default AdminMatches;
