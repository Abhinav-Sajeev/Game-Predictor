import React from "react";
import { Edit2, Trash2, Calendar, ShieldCheck, RefreshCw } from "lucide-react";
import { formatMatchDate } from "../../utils/formatDate";
import { cn } from "../../utils/helpers";
import Table from "../common/Table";
import Button from "../common/Button";
import FlagDisplay from "../common/FlagDisplay";

const MatchManagement = ({ matches = [], onEdit, onDelete, loading = false }) => {
  const columns = [
    {
      key: "id",
      header: "Match ID",
      className: "w-24 text-center text-text-secondary-dark text-xs font-mono"
    },
    {
      key: "teams",
      header: "Fixture pairing",
      className: "pl-4",
      render: (row) => (
        <div className="flex items-center gap-3">
          <FlagDisplay emoji={row.teamAFlag} className="w-6 h-4 filter drop-shadow-sm select-none" />
          <span className="font-bold text-sm text-white light:text-bg-dark">{row.teamA}</span>
          <span className="text-xs text-text-secondary-dark font-black font-display px-1.5 py-0.5 rounded bg-white/5 select-none">VS</span>
          <span className="font-bold text-sm text-white light:text-bg-dark">{row.teamB}</span>
          <FlagDisplay emoji={row.teamBFlag} className="w-6 h-4 filter drop-shadow-sm select-none" />
        </div>
      )
    },
    {
      key: "dateTime",
      header: "Kickoff Schedule",
      className: "font-semibold text-xs",
      render: (row) => (
        <div className="flex flex-col gap-0.5 text-text-secondary-dark">
          <span className="text-white light:text-bg-dark font-bold">{formatMatchDate(row.dateTime)}</span>
          <span className="text-[10px] leading-none">Lock: {formatMatchDate(row.closingTime)}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      className: "text-center",
      render: (row) => (
        <span className={cn(
          "px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border font-display select-none",
          row.status === "completed"
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : row.status === "live"
            ? "bg-primary/10 border-primary/20 text-primary animate-pulse"
            : "bg-secondary/10 border-secondary/20 text-secondary"
        )}>
          {row.status}
        </span>
      )
    },
    {
      key: "points",
      header: "Config",
      className: "text-center font-bold text-xs text-text-secondary-dark",
      render: (row) => (
        <span>{row.perfectPoints} / {row.winnerPoints} pts</span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-28 text-center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(row)}
            className="p-2 hover:bg-white/5 rounded-lg text-text-secondary-dark hover:text-white transition-colors"
            title="Edit Fixture"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.teamA} vs ${row.teamB}?`)) {
                onDelete(row.id);
              }
            }}
            className="p-2 hover:bg-red-500/10 rounded-lg text-text-secondary-dark hover:text-red-400 transition-colors"
            title="Delete Fixture"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderMobileCard = (match) => {
    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start border-b border-white/5 pb-3">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-wider leading-none">Schedule</span>
            <span className="text-xs font-bold text-white light:text-bg-dark mt-1 leading-none">{formatMatchDate(match.dateTime)}</span>
          </div>
          <span className={cn(
            "px-2.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-lg border",
            match.status === "completed" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-secondary/10 border-secondary/20 text-secondary"
          )}>
            {match.status}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 py-1 font-display font-extrabold text-sm">
          <FlagDisplay emoji={match.teamAFlag} className="w-5 h-3.5" />
          <span className="text-white light:text-bg-dark">{match.teamA}</span>
          <span className="text-text-secondary-dark/40 font-bold px-1 select-none">VS</span>
          <span className="text-white light:text-bg-dark">{match.teamB}</span>
          <FlagDisplay emoji={match.teamBFlag} className="w-5 h-3.5" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
          <span className="text-text-secondary-dark font-medium">Scoring: {match.perfectPoints}/{match.winnerPoints} pts</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(match)} className="p-1 px-2.5 text-[10px] font-bold uppercase tracking-wider">
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(match.id)} className="p-1 px-2.5 text-[10px] font-bold uppercase tracking-wider">
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table
        columns={columns}
        data={matches}
        renderMobileCard={renderMobileCard}
        loading={loading}
        emptyMessage="No match fixtures recorded"
        className="w-full"
      />
    </div>
  );
};

export default MatchManagement;
