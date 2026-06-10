import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle, Calendar, Percent, ShieldCheck } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

const flagPresets = [
  { country: "Argentina", flag: "🇦🇷" },
  { country: "France", flag: "🇫🇷" },
  { country: "Brazil", flag: "🇧🇷" },
  { country: "Germany", flag: "🇩🇪" },
  { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { country: "Spain", flag: "🇪🇸" },
  { country: "Portugal", flag: "🇵🇹" },
  { country: "Italy", flag: "🇮🇹" },
  { country: "Netherlands", flag: "🇳🇱" },
  { country: "Belgium", flag: "🇧🇪" },
  { country: "Uruguay", flag: "🇺🇾" },
  { country: "Senegal", flag: "🇸🇳" },
  { country: "Japan", flag: "🇯🇵" },
  { country: "Croatia", flag: "🇭🇷" },
  { country: "Morocco", flag: "🇲🇦" },
  { country: "United States", flag: "🇺🇸" }
];

const CreateMatchForm = ({ onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      teamA: "",
      teamAFlag: "🇦🇷",
      teamB: "",
      teamBFlag: "🇫🇷",
      matchDateTime: "",
      predictionClosingTime: "",
      perfectScorePoint: 2,
      winnerOnlyPoint: 1
    }
  });

  const selectedTeamAFlag = watch("teamAFlag");
  const selectedTeamBFlag = watch("teamBFlag");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      // Auto fill predictionClosingTime if left blank
      if (!data.predictionClosingTime && data.matchDateTime) {
        // Default to 30 mins before kickoff
        const kickOff = new Date(data.matchDateTime);
        const closing = new Date(kickOff.getTime() - 30 * 60 * 1000);
        data.predictionClosingTime = closing.toISOString();
      } else if (data.predictionClosingTime) {
        data.predictionClosingTime = new Date(data.predictionClosingTime).toISOString();
      }
      
      if (data.matchDateTime) {
        data.matchDateTime = new Date(data.matchDateTime).toISOString();
      }
      
      await onSubmitSuccess(data);
      reset();
    } catch (err) {
      setServerError(err.message || "Failed to create match fixture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-left text-white light:text-bg-dark">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold leading-relaxed">
          {serverError}
        </div>
      )}

      {/* Team A Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Team A Name"
            placeholder="e.g. Argentina"
            error={errors.teamA?.message}
            {...register("teamA", { required: "Team A name is required" })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display">
            Team A Flag Emoji
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl p-2.5 bg-card-dark/60 border border-white/10 rounded-xl select-none">{selectedTeamAFlag}</span>
            <select
              className="flex-1 bg-card-dark border border-white/10 dark:border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              {...register("teamAFlag")}
            >
              {flagPresets.map((p, idx) => (
                <option key={idx} value={p.flag}>
                  {p.flag} {p.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Team B Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Team B Name"
            placeholder="e.g. France"
            error={errors.teamB?.message}
            {...register("teamB", { required: "Team B name is required" })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display">
            Team B Flag Emoji
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl p-2.5 bg-card-dark/60 border border-white/10 rounded-xl select-none">{selectedTeamBFlag}</span>
            <select
              className="flex-1 bg-card-dark border border-white/10 dark:border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              {...register("teamBFlag")}
            >
              {flagPresets.map((p, idx) => (
                <option key={idx} value={p.flag}>
                  {p.flag} {p.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kickoff & Closing Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Kickoff Date & Time"
            type="datetime-local"
            error={errors.matchDateTime?.message}
            startIcon={<Calendar className="w-4 h-4 text-text-secondary-dark" />}
            {...register("matchDateTime", { required: "Match kickoff time is required" })}
          />
        </div>
        <div>
          <Input
            label="Prediction Closing Time"
            type="datetime-local"
            startIcon={<Calendar className="w-4 h-4 text-text-secondary-dark" />}
            placeholder="Defaults to 30 mins before kickoff"
            {...register("predictionClosingTime")}
          />
          <span className="text-[10px] text-text-secondary-dark mt-1 block">
            Leave blank to auto-lock 30 minutes before kickoff.
          </span>
        </div>
      </div>

      {/* Points settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Perfect Score Points"
            type="number"
            error={errors.perfectScorePoint?.message}
            startIcon={<ShieldCheck className="w-4 h-4 text-text-secondary-dark" />}
            {...register("perfectScorePoint", {
              required: "Required",
              min: { value: 1, message: "Must be >= 1" }
            })}
          />
        </div>
        <div>
          <Input
            label="Winner Only Points"
            type="number"
            error={errors.winnerOnlyPoint?.message}
            startIcon={<Percent className="w-4 h-4 text-text-secondary-dark" />}
            {...register("winnerOnlyPoint", {
              required: "Required",
              min: { value: 1, message: "Must be >= 1" }
            })}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full py-3.5 uppercase tracking-wider font-bold text-sm mt-3"
        endIcon={<PlusCircle className="w-4 h-4" />}
      >
        Add Match Fixture
      </Button>
    </form>
  );
};

export default CreateMatchForm;
