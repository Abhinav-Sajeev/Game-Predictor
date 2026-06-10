import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, ShieldCheck, Activity, CheckCircle2, TrendingUp, CheckCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getAdminDashboardStats } from "../../api/admindash";
import StatsCards from "../../components/admin/StatsCards";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

const AdminDashboard = () => {
  const { user, triggerToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminDashboardData = async () => {
    try {
      const response = await getAdminDashboardStats();
      if (response && response.success && response.data) {
        setStats(response.data);
      } else {
        triggerToast("Unexpected response from dashboard API", "error");
      }
    } catch (err) {
      triggerToast("Failed to load admin stats", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDashboardData();
  }, []);

  const statsList = stats
    ? [
        {
          label: "Total Players",
          value: stats.totalUsers,
          icon: <Users className="w-5 h-5 text-primary" />,
          subtext: `${stats.totalUsers} registered players`,
          glow: true,
          glowColor: "primary"
        },
        {
          label: "Total Matches",
          value: stats.totalMatches,
          icon: <Calendar className="w-5 h-5 text-secondary" />,
          subtext: `${stats.completedMatches} completed · ${stats.activeMatches} active`,
          glow: false
        },
        {
          label: "Prediction Entries",
          value: stats.totalPredictions,
          icon: <TrendingUp className="w-5 h-5 text-accent" />,
          subtext: `${stats.totalPredictions} prediction entries`,
          glow: false
        },
        {
          label: "Active Matches",
          value: stats.activeMatches,
          icon: <ShieldCheck className="w-5 h-5 text-primary" />,
          subtext: `${stats.activeMatches} open for predictions`,
          glow: false
        },
        {
          label: "Completed Matches",
          value: stats.completedMatches,
          icon: <CheckCheck className="w-5 h-5 text-emerald-400" />,
          subtext: `${stats.completedMatches} results finalised`,
          glow: false
        }
      ]
    : [];

  // Chart Coordinates configuration for SVG area path (Predictions Over Time / Matches)
  const chartPoints = "M 0 160 C 50 120, 100 140, 150 70 C 200 40, 250 110, 300 50 C 350 20, 400 60, 450 10 L 450 180 L 0 180 Z";
  const strokePath = "M 0 160 C 50 120, 100 140, 150 70 C 200 40, 250 110, 300 50 C 350 20, 400 60, 450 10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full text-left select-none"
    >
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">Administration</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-5.5 h-5.5 text-primary animate-pulse" />
            Admin Dashboard
          </h1>
        </div>
      </div>

      {loading ? (
        <Loader variant="stats" count={4} />
      ) : (
        <StatsCards stats={statsList} />
      )}

      {/* Analytics Chart & Activity Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Chart area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="pb-1">
            <h2 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-primary" />
              Prediction Submission Analytics
            </h2>
          </div>

          <Card className="p-6 border border-white/5 bg-card-dark text-white flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-wider leading-none">Activity metrics</span>
                <span className="text-xs font-bold text-white light:text-bg-dark mt-1">Prediction submissions per fixture</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                Live Data
              </span>
            </div>

            {/* Custom SVG Graph with framer motion path draw animations */}
            <div className="w-full relative mt-4">
              <svg viewBox="0 0 450 200" className="w-full h-48 overflow-visible">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C896" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#1A73E8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1="0" y1="180" x2="450" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="130" x2="450" y2="130" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="80" x2="450" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="30" x2="450" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                {/* Filled Gradient Area Path */}
                <motion.path
                  d={chartPoints}
                  fill="url(#chartGlow)"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  originY={1}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Stroke Line Path */}
                <motion.path
                  d={strokePath}
                  fill="none"
                  stroke="#00C896"
                  strokeWidth="3.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                {/* Coordinates Dots */}
                <circle cx="150" cy="70" r="5" fill="#FFD700" className="animate-ping" />
                <circle cx="150" cy="70" r="4" fill="#00C896" stroke="#fff" strokeWidth="1.5" />
                <circle cx="300" cy="50" r="4" fill="#1A73E8" stroke="#fff" strokeWidth="1.5" />
                <circle cx="450" cy="10" r="4" fill="#00C896" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Labels under graph */}
            <div className="flex justify-between text-[8px] md:text-[10px] text-text-secondary-dark/60 font-semibold uppercase tracking-wider px-1">
              <span>Match 1</span>
              <span>Match 3 (England)</span>
              <span>Match 5 (Belgium)</span>
              <span>Match 7 (Japan)</span>
            </div>
          </Card>
        </div>

        {/* Right column: Recent Activities */}
        <div className="flex flex-col gap-4">
          <div className="pb-1">
            <h2 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-secondary animate-pulse" />
              System Activities
            </h2>
          </div>

          <Card className="p-5 border border-white/5 bg-card-dark text-white flex-grow flex flex-col gap-3">
            <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest pb-2 border-b border-white/5 text-left mb-1">
              Admin audit log
            </div>

            {loading ? (
              <div className="w-full flex flex-col gap-4 py-4">
                <Loader variant="line" count={4} />
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-grow">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/3 border border-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {act.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white light:text-bg-dark leading-snug">{act.action}</span>
                      <span className="text-[10px] text-text-secondary-dark leading-snug mt-0.5">{act.details}</span>
                      <span className="text-[9px] text-text-secondary-dark/40 mt-1 font-semibold">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>

    </motion.div>
  );
};

export default AdminDashboard;
