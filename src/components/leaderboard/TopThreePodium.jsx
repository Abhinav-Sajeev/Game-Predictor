import React from "react";
import { motion } from "framer-motion";
import { trophy as trophyImg, defaultAvatar } from "../../assets";

const TopThreePodium = ({ topThree = [] }) => {
  if (topThree.length === 0) return null;

  // Podium indices: 2nd on left (index 1), 1st in center (index 0), 3rd on right (index 2)
  const podiumOrder = [
    { rank: 2, data: topThree[1], color: "text-slate-300", bg: "from-slate-500/10 to-slate-700/5 border-slate-500/30", height: "h-[220px] md:h-[240px]", scale: 0.95 },
    { rank: 1, data: topThree[0], color: "text-amber-400", bg: "from-amber-500/10 to-amber-700/5 border-amber-500/30 shadow-[0_0_30px_rgba(255,215,0,0.15)]", height: "h-[250px] md:h-[280px]", scale: 1.0 },
    { rank: 3, data: topThree[2], color: "text-amber-600", bg: "from-orange-500/10 to-orange-700/5 border-orange-500/30", height: "h-[200px] md:h-[220px]", scale: 0.9 }
  ];

  return (
    <div className="flex items-end justify-center gap-3.5 md:gap-6 py-6 max-w-2xl mx-auto w-full select-none">
      {podiumOrder.map((spot) => {
        const player = spot.data;
        if (!player) return <div key={spot.rank} className="flex-1 invisible" />; // Hidden placeholder if fewer than 3 users

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: spot.rank * 0.15 }}
            style={{ scale: spot.scale }}
            className={`flex-1 flex flex-col items-center justify-end group`}
          >
            {/* Player details above podium block */}
            <div className="flex flex-col items-center mb-3 text-center">
              <div className="relative">
                <img
                  src={player.avatar || defaultAvatar}
                  alt={player.name}
                  className={`w-14 h-14 md:w-18 md:h-18 rounded-full object-cover border-2 ${
                    spot.rank === 1
                      ? "border-amber-400 ring-4 ring-amber-400/20"
                      : spot.rank === 2
                      ? "border-slate-300"
                      : "border-amber-600"
                  }`}
                />
                <span
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-display shadow-md border ${
                    spot.rank === 1
                      ? "bg-amber-400 border-amber-500 text-bg-dark"
                      : spot.rank === 2
                      ? "bg-slate-300 border-slate-400 text-bg-dark"
                      : "bg-amber-600 border-amber-700 text-white"
                  }`}
                >
                  {spot.rank}
                </span>
              </div>
              <span className="text-xs font-black font-display text-white light:text-bg-dark mt-2.5 max-w-[85px] md:max-w-[120px] truncate block uppercase tracking-wide">
                {player.name}
              </span>
              {/* <span className="text-[10px] text-text-secondary-dark font-bold">
                {player.accuracy}% Acc
              </span> */}
            </div>

            {/* Podium Block base */}
            <div
              className={`w-full ${spot.height} bg-gradient-to-t ${spot.bg} border rounded-t-2xl flex flex-col items-center justify-center p-4 gap-2 border-b-0 relative overflow-hidden`}
            >
              {spot.rank === 1 && (
                <img
                  src={trophyImg}
                  alt="Championship Trophy"
                  className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-md animate-bounce"
                />
              )}
              <div className="flex flex-col items-center justify-center text-center mt-2">
                <span className={`text-xl md:text-2xl font-black font-display ${spot.color}`}>
                  {player.totalPoints}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-wider font-bold text-text-secondary-dark">
                  Points
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopThreePodium;
