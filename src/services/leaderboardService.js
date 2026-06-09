// Leaderboard Service — fully dynamic, no local storage data caching
import { getLeaderboardAPI } from "../api/leaderboard";

export const leaderboardService = {
  getLeaderboard: async () => {
    const response = await getLeaderboardAPI();
    if (!response || !response.success) return [];

    const backendUsers = response.data || response.leaderboard || [];

    const mapped = backendUsers.map((u, index) => ({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role || "user",
      totalPoints: u.totalPoints || 0,
      predictionsCount: u.predictionsCount || 0,
      // accuracy: u.accuracy || 0,
      avatar: u.avatar || null,
      rank: u.rank || (index + 1)
    }));

    // Exclude admins and sort by points → accuracy → predictions count
    const players = mapped.filter(u => u.role !== "admin");
    const sorted = players.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return b.predictionsCount - a.predictionsCount;
    });

    return sorted.map((player, index) => ({ ...player, rank: index + 1 }));
  },

  getUserRank: async (userId) => {
    const leaderboard = await leaderboardService.getLeaderboard();
    const index = leaderboard.findIndex(p => p.id === userId);
    if (index === -1) return null;
    return {
      rank: index + 1,
      totalPlayers: leaderboard.length,
      playerStats: leaderboard[index]
    };
  }
};
