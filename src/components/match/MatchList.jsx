import React, { useState } from "react";
import { Search } from "lucide-react";
import MatchCard from "./MatchCard";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import { cn } from "../../utils/helpers";

const MatchList = ({
  matches = [],
  predictions = [],
  loading = false,
  onPredictClick,
  searchQuery = ""
}) => {
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "upcoming" | "completed"

  // 1. Filter matches by tab
  const tabFiltered = matches.filter(match => {
    if (activeFilter === "upcoming") return match.status === "upcoming";
    if (activeFilter === "completed") return match.status === "completed";
    return true;
  });

  // 2. Filter matches by search query (global or local input)
  const finalMatches = tabFiltered.filter(match => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      match.teamA.toLowerCase().includes(query) ||
      match.teamB.toLowerCase().includes(query)
    );
  });

  // Retrieve user prediction matching a specific match id
  const getMatchPrediction = (matchId) => {
    return predictions.find(p => p.matchId === matchId);
  };

  const tabs = [
    { id: "all", name: "All Matches" },
    { id: "upcoming", name: "Upcoming" },
    { id: "completed", name: "Completed" }
  ];

  if (loading) {
    return <Loader variant="card" count={3} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Filters Bar */}
      <div className="flex justify-between items-center border-b border-white/5 dark:border-white/5 light:border-black/5 pb-2">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold font-display select-none transition-all border border-transparent",
                activeFilter === tab.id
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
        {/* <div className="text-xs font-semibold text-text-secondary-dark">
          Showing <span className="text-white light:text-bg-dark">{finalMatches.length}</span> fixtures
        </div> */}
      </div>

      {/* Grid List */}
      {finalMatches.length === 0 ? (
        <EmptyState
          title="No fixtures found"
          message={searchQuery ? `No matches matched "${searchQuery}"` : `No ${activeFilter} matches at this moment.`}
          className="bg-card-dark/20 border border-white/5 py-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={getMatchPrediction(match.id)}
              onPredictClick={() => onPredictClick(match)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;
