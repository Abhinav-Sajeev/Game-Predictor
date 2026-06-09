import React, { useState } from "react";
import { Search, Trophy } from "lucide-react";
import { defaultAvatar } from "../../assets";
import { cn } from "../../utils/helpers";
import Table from "../common/Table";
import Input from "../common/Input";

const LeaderboardTable = ({ leaderboard = [], currentUser }) => {
  const [search, setSearch] = useState("");

  const filteredData = leaderboard.filter(player =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "rank",
      header: "Rank",
      className: "w-20 text-center font-bold font-display text-sm",
      render: (row) => {
        let rankColor = "text-text-secondary-dark";
        if (row.rank === 1) rankColor = "text-amber-400 font-extrabold";
        else if (row.rank === 2) rankColor = "text-slate-300 font-extrabold";
        else if (row.rank === 3) rankColor = "text-amber-600 font-extrabold";
        
        return <span className={rankColor}>#{row.rank}</span>;
      }
    },
    {
      key: "name",
      header: "Player",
      className: "pl-4",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || defaultAvatar}
            alt={row.name}
            className={cn(
              "w-8 h-8 rounded-full object-cover border",
              row.id === currentUser?.id ? "border-primary" : "border-white/10"
            )}
          />
          <div className="flex flex-col">
            <span className={cn(
              "font-bold font-display text-sm",
              row.id === currentUser?.id ? "text-primary font-black" : "text-white light:text-bg-dark"
            )}>
              {row.name}
              {row.id === currentUser?.id && (
                <span className="ml-1.5 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                  You
                </span>
              )}
            </span>
            <span className="text-[10px] text-text-secondary-dark font-semibold leading-none mt-0.5">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: "totalPoints",
      header: "Points",
      className: "text-center font-bold text-sm",
      render: (row) => (
        <span className={cn(row.id === currentUser?.id ? "text-primary font-black text-base" : "text-white light:text-bg-dark")}>
          {row.totalPoints}
        </span>
      )
    },
    {
      key: "predictionsCount",
      header: "Predictions",
      className: "text-center text-text-secondary-dark font-bold text-xs"
    },
    {
      key: "accuracy",
      header: "Accuracy",
      className: "text-center font-bold text-xs",
      render: (row) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-xs font-bold font-display border",
          row.accuracy >= 75
            ? "bg-primary/10 border-primary/20 text-primary"
            : row.accuracy >= 55
            ? "bg-secondary/10 border-secondary/20 text-secondary"
            : "bg-white/5 border-white/10 text-text-secondary-dark"
        )}>
          {row.accuracy}%
        </span>
      )
    }
  ];

  // Mobile custom card rendering to keep mobile UX premium
  const renderMobileCard = (player, idx) => {
    const isMe = player.id === currentUser?.id;
    let rankBadge = "bg-white/5 text-text-secondary-dark";
    if (player.rank === 1) rankBadge = "bg-amber-400 text-bg-dark border border-amber-500 shadow-md";
    else if (player.rank === 2) rankBadge = "bg-slate-300 text-bg-dark border border-slate-400";
    else if (player.rank === 3) rankBadge = "bg-amber-600 text-white border border-amber-700";

    return (
      <div
        className={cn(
          "glass-panel border rounded-2xl p-4 flex items-center justify-between gap-4 transition-all relative overflow-hidden",
          isMe
            ? "border-primary/40 shadow-[0_0_20px_rgba(0,200,150,0.15)] bg-primary/5"
            : "border-white/5"
        )}
      >
        <div className="flex items-center gap-3.5">
          {/* Rank Badge */}
          <span className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center font-black font-display text-sm",
            rankBadge
          )}>
            {player.rank}
          </span>

          {/* User profile */}
          <div className="flex items-center gap-2.5">
            <img
              src={player.avatar || defaultAvatar}
              alt={player.name}
              className="w-9 h-9 rounded-full object-cover border border-white/10"
            />
            <div className="flex flex-col text-left">
              <span className={cn(
                "text-xs font-extrabold uppercase tracking-wide font-display",
                isMe ? "text-primary" : "text-white light:text-bg-dark"
              )}>
                {player.name}
              </span>
              {/* <span className="text-[10px] text-text-secondary-dark">{player.accuracy}% Accuracy</span> */}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg font-black font-display text-primary leading-none">
            {player.totalPoints}
          </span>
          <span className="text-[9px] uppercase font-semibold text-text-secondary-dark leading-none">
            Points
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Table Search */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
        <h3 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-wider flex items-center gap-2 select-none">
          <Trophy className="w-4 h-4 text-accent animate-pulse" />
          Ranking Standings
        </h3>
        
        <Input
          placeholder="Search players by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="max-w-xs"
          className="py-2.5 pl-11 text-xs"
          startIcon={<Search className="w-4 h-4 text-text-secondary-dark" />}
        />
      </div>

      {/* Responsive Table */}
      <Table
        columns={columns}
        data={filteredData}
        renderMobileCard={renderMobileCard}
        emptyMessage="No players matched your search"
        className="w-full"
      />
    </div>
  );
};

export default LeaderboardTable;
