import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, Filter, CalendarDays, CheckCheck, Clock } from "lucide-react";
import { cn } from "../../utils/helpers";
import { formatMatchDate } from "../../utils/formatDate";
import Button from "../common/Button";
import FlagDisplay from "../common/FlagDisplay";

const STATUS_FILTERS = [
  { label: "All",       value: "all" },
  { label: "Open",      value: "open" },
  { label: "Completed", value: "completed" }
];

const ResultEntryForm = ({ matches = [], onSubmitSuccess }) => {
  const [loading, setLoading]           = useState(false);
  const [serverError, setServerError]   = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [statusFilter, setStatusFilter] = useState("open");

  // Sort newest first, then apply status filter
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );
  const filteredMatches = statusFilter === "all"
    ? sortedMatches
    : sortedMatches.filter(m => (m.status || "").toLowerCase() === statusFilter);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: { scoreA: "", scoreB: "" } });

  // Pre-fill scores when a match is selected
  useEffect(() => {
    if (selectedMatch) {
      setValue("scoreA", selectedMatch.scoreA !== null ? selectedMatch.scoreA : "");
      setValue("scoreB", selectedMatch.scoreB !== null ? selectedMatch.scoreB : "");
    } else {
      setValue("scoreA", "");
      setValue("scoreB", "");
    }
  }, [selectedMatch, setValue]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedMatch(null);
  }, [statusFilter]);

  const onSubmit = async (data) => {
    if (!selectedMatch) return;
    setLoading(true);
    setServerError("");
    try {
      await onSubmitSuccess(selectedMatch.id, data.scoreA, data.scoreB);
      reset();
      setSelectedMatch(null);
    } catch (err) {
      setServerError(err.message || "Failed to publish match scores");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
          <CheckCheck className="w-2.5 h-2.5" /> Completed
        </span>
      );
    if (s === "open")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-blue-400">
          <Clock className="w-2.5 h-2.5" /> Open
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400">
        <Clock className="w-2.5 h-2.5" /> {s || "upcoming"}
      </span>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-left text-white light:text-bg-dark">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold leading-relaxed">
          {serverError}
        </div>
      )}

      {/* ── Status Filter Tabs ── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filter by Status
        </label>
        <div className="flex items-center gap-2 p-1 bg-white/3 border border-white/8 rounded-xl">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider font-display transition-all",
                statusFilter === f.value
                  ? f.value === "open"
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : f.value === "completed"
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-primary/15 border border-primary/25 text-primary"
                  : "text-text-secondary-dark/60 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 text-[9px] opacity-70">
                  ({matches.filter(m => (m.status || "").toLowerCase() === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Match Cards ── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          Select Fixture
          <span className="text-text-secondary-dark/40 normal-case font-normal">— newest first</span>
        </label>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-8 text-text-secondary-dark/50 text-xs font-semibold uppercase tracking-wider border border-white/5 rounded-xl bg-white/2">
            No matches for this filter
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {filteredMatches.map(m => {
              const isSelected = selectedMatch?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMatch(isSelected ? null : m)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3",
                    isSelected
                      ? "bg-primary/10 border-primary/30 shadow-[0_0_12px_rgba(0,200,150,0.08)]"
                      : "bg-white/2 border-white/8 hover:bg-white/5 hover:border-white/15"
                  )}
                >
                  {/* Teams */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Selection indicator */}
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-white/20 bg-transparent"
                    )}>
                      {isSelected && (
                        <svg viewBox="0 0 16 16" fill="none" className="w-full h-full p-0.5">
                          <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 font-bold text-sm text-white font-display truncate">
                        <FlagDisplay emoji={m.teamAFlag} className="w-5 h-3.5" />
                        <span>{m.teamA}</span>
                        <span className="text-text-secondary-dark/50 text-[10px] font-black">VS</span>
                        <span>{m.teamB}</span>
                        <FlagDisplay emoji={m.teamBFlag} className="w-5 h-3.5" />
                      </div>
                      <span className="text-[10px] text-text-secondary-dark font-medium">
                        {formatMatchDate(m.dateTime)}
                      </span>
                    </div>
                  </div>

                  {/* Right side: status + existing score if any */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {statusBadge(m.status)}
                    {m.scoreA !== null && m.scoreB !== null && (
                      <span className="text-[10px] font-black font-display text-primary">
                        {m.scoreA} – {m.scoreB}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Score Entry (shows only when a match is selected) ── */}
      {selectedMatch && (
        <div className="glass-panel bg-white/2 border border-white/5 p-5 rounded-xl flex flex-col gap-5">
          <div className="text-center text-xs font-bold text-text-secondary-dark uppercase tracking-widest border-b border-white/5 pb-2.5">
            Record Final Scoreboard
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* Team A */}
            <div className="flex flex-col items-center gap-2">
              <FlagDisplay emoji={selectedMatch.teamAFlag} className="w-10 h-7 md:w-12 md:h-8 filter drop-shadow-md select-none" />
              <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-wider text-center max-w-[90px] truncate">
                {selectedMatch.teamA}
              </span>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="99"
                className="w-14 h-14 bg-card-dark/60 border border-white/10 text-white rounded-xl text-center text-xl font-bold font-display focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                {...register("scoreA", {
                  required: "Required",
                  min: { value: 0, message: ">= 0" },
                  max: { value: 99, message: "<= 99" }
                })}
              />
            </div>

            <div className="text-sm font-black text-text-secondary-dark/60 font-display select-none mt-7">VS</div>

            {/* Team B */}
            <div className="flex flex-col items-center gap-2">
              <FlagDisplay emoji={selectedMatch.teamBFlag} className="w-10 h-7 md:w-12 md:h-8 filter drop-shadow-md select-none" />
              <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-wider text-center max-w-[90px] truncate">
                {selectedMatch.teamB}
              </span>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="99"
                className="w-14 h-14 bg-card-dark/60 border border-white/10 text-white rounded-xl text-center text-xl font-bold font-display focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                {...register("scoreB", {
                  required: "Required",
                  min: { value: 0, message: ">= 0" },
                  max: { value: 99, message: "<= 99" }
                })}
              />
            </div>
          </div>

          {(errors.scoreA || errors.scoreB) && (
            <div className="text-center text-xs text-red-500 font-semibold leading-none animate-pulse">
              Please enter valid scores for both squads.
            </div>
          )}

          <Button
            type="submit"
            variant="secondary"
            loading={loading}
            className="w-full py-3.5 uppercase tracking-wider font-bold text-xs mt-2"
            endIcon={<CheckCircle className="w-4 h-4" />}
          >
            Publish Results &amp; Recalculate Points
          </Button>
        </div>
      )}
    </form>
  );
};

export default ResultEntryForm;
