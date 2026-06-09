import { useState, useCallback } from "react";
import { leaderboardService } from "../services/leaderboardService";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaderboardService.getLeaderboard();
      setLeaderboard(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load leaderboard");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserRank = useCallback(async (userId) => {
    if (!userId) return null;
    setLoading(true);
    setError(null);
    try {
      const rankData = await leaderboardService.getUserRank(userId);
      setUserRank(rankData);
      return rankData;
    } catch (err) {
      setError(err.message || "Failed to load user rank");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    leaderboard,
    userRank,
    loading,
    error,
    fetchLeaderboard,
    fetchUserRank
  };
};
