import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send, Edit3, ShieldAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

const PredictionForm = ({ match, initialPrediction, onSubmitSuccess }) => {
  const { user } = useAuth();
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      scoreA: "",
      scoreB: ""
    }
  });

  // Check closing time and load initial predictions if any
  useEffect(() => {
    if (match) {
      const now = new Date();
      const closing = new Date(match.closingTime);
      setIsClosed(now > closing || match.status === "completed");
    }

    if (initialPrediction) {
      setValue("scoreA", initialPrediction.predictScoreA);
      setValue("scoreB", initialPrediction.predictScoreB);
    }
  }, [match, initialPrediction, setValue]);

  const onSubmit = async (data) => {
    if (isClosed) return;
    setLoading(true);
    setServerError("");
    try {
      await onSubmitSuccess(data.scoreA, data.scoreB);
    } catch (err) {
      setServerError(err.message || "Failed to submit prediction.");
    } finally {
      setLoading(false);
    }
  };

  const hasPredicted = !!initialPrediction;

  return (
    <div className="w-full flex flex-col gap-4">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-medium">
          {serverError}
        </div>
      )}

      {isClosed && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-text-secondary-dark/80 select-none">
          <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Predictions are closed. You cannot modify scores anymore.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex items-center justify-center gap-6 py-2">
          {/* Team A Score Input */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest text-center max-w-[90px] truncate">
              {match.teamA}
            </span>
            <input
              type="number"
              disabled={isClosed}
              placeholder="0"
              min="0"
              max="99"
              className="w-14 h-14 bg-card-dark/60 border border-white/10 dark:border-white/10 text-white rounded-xl text-center text-xl font-bold font-display focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              {...register("scoreA", {
                required: "Score required",
                min: { value: 0, message: ">= 0" },
                max: { value: 99, message: "<= 99" }
              })}
            />
          </div>

          <div className="text-sm font-black text-text-secondary-dark/60 font-display select-none mt-5">
            VS
          </div>

          {/* Team B Score Input */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest text-center max-w-[90px] truncate">
              {match.teamB}
            </span>
            <input
              type="number"
              disabled={isClosed}
              placeholder="0"
              min="0"
              max="99"
              className="w-14 h-14 bg-card-dark/60 border border-white/10 dark:border-white/10 text-white rounded-xl text-center text-xl font-bold font-display focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              {...register("scoreB", {
                required: "Score required",
                min: { value: 0, message: ">= 0" },
                max: { value: 99, message: "<= 99" }
              })}
            />
          </div>
        </div>

        {/* Validation Errors */}
        {(errors.scoreA || errors.scoreB) && (
          <div className="text-center text-xs text-red-500 font-semibold leading-none animate-pulse">
            Enter valid scores for both squads.
          </div>
        )}

        {/* Submit Button */}
        {!isClosed && (
          <Button
            type="submit"
            variant={hasPredicted ? "outline" : "primary"}
            size="md"
            loading={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider mt-1"
            endIcon={hasPredicted ? <Edit3 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
          >
            {hasPredicted ? "Update Prediction" : "Submit Prediction"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default PredictionForm;
