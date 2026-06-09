import React from "react";
import { Trophy, User2 } from "lucide-react";
import { defaultAvatar } from "../../assets";
import { cn } from "../../utils/helpers";
import Table from "../common/Table";
import Loader from "../common/Loader";

const UserManagement = ({ users = [], loading = false }) => {
  const columns = [
    {
      key: "name",
      header: "Player",
      className: "pl-4",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <User2 className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm text-white light:text-bg-dark">
              {row.name}
            </span>
            <span className="text-[10px] text-text-secondary-dark font-medium leading-none mt-0.5">
              ID: {row.id?.slice(0, 12)}…
            </span>
          </div>
        </div>
      )
    },
    {
      key: "totalPoints",
      header: "Total Points",
      className: "text-center",
      render: (row) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-display border",
          row.totalPoints > 0
            ? "bg-primary/10 border-primary/20 text-primary"
            : "bg-white/5 border-white/10 text-text-secondary-dark/60"
        )}>
          <Trophy className="w-3 h-3" />
          {row.totalPoints} pts
        </span>
      )
    },
    {
      key: "rank",
      header: "Rank",
      className: "text-center",
      render: (_, idx) => (
        <span className={cn(
          "inline-block w-7 h-7 rounded-full text-xs font-black font-display flex items-center justify-center border",
          idx === 0
            ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
            : idx === 1
            ? "bg-slate-400/20 border-slate-400/30 text-slate-300"
            : idx === 2
            ? "bg-amber-700/20 border-amber-700/30 text-amber-600"
            : "bg-white/5 border-white/10 text-text-secondary-dark/60"
        )}>
          {idx + 1}
        </span>
      )
    }
  ];

  const renderMobileCard = (userItem, idx) => (
    <div className="glass-panel border border-white/5 rounded-2xl p-5 flex items-center gap-4">
      {/* Rank badge */}
      <span className={cn(
        "w-9 h-9 rounded-full text-sm font-black font-display flex items-center justify-center border flex-shrink-0",
        idx === 0
          ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
          : idx === 1
          ? "bg-slate-400/20 border-slate-400/30 text-slate-300"
          : idx === 2
          ? "bg-amber-700/20 border-amber-700/30 text-amber-600"
          : "bg-white/5 border-white/10 text-text-secondary-dark/60"
      )}>
        {idx + 1}
      </span>

      {/* Avatar placeholder */}
      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <User2 className="w-4.5 h-4.5 text-primary" />
      </div>

      {/* Name + ID */}
      <div className="flex flex-col flex-1 min-w-0 text-left">
        <span className="font-bold text-sm text-white truncate">{userItem.name}</span>
        <span className="text-[10px] text-text-secondary-dark">
          ID: {userItem.id?.slice(0, 10)}…
        </span>
      </div>

      {/* Points */}
      <span className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black font-display border",
        userItem.totalPoints > 0
          ? "bg-primary/10 border-primary/20 text-primary"
          : "bg-white/5 border-white/10 text-text-secondary-dark/60"
      )}>
        <Trophy className="w-3 h-3" />
        {userItem.totalPoints}
      </span>
    </div>
  );

  if (loading) return <Loader variant="table" count={4} />;

  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        columns={columns}
        data={users}
        renderMobileCard={renderMobileCard}
        emptyMessage="No players registered yet"
        emptyIcon={<User2 className="w-8 h-8" />}
        className="w-full"
      />
    </div>
  );
};

export default UserManagement;
