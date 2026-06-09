import { useState, useCallback } from "react";
import { matchService } from "../services/matchService";

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchService.getMatches();
      setMatches(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch matches");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMatch = async (matchData) => {
    setLoading(true);
    setError(null);
    try {
      const newMatch = await matchService.createMatch(matchData);
      setMatches(prev => [...prev, newMatch]);
      return newMatch;
    } catch (err) {
      setError(err.message || "Failed to create match");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMatch = async (matchId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await matchService.updateMatch(matchId, updatedData);
      setMatches(prev => prev.map(m => m.id === matchId ? updated : m));
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update match");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (matchId) => {
    setLoading(true);
    setError(null);
    try {
      await matchService.deleteMatch(matchId);
      setMatches(prev => prev.filter(m => m.id !== matchId));
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete match");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitResult = async (matchId, scoreA, scoreB) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMatch = await matchService.submitResult(matchId, scoreA, scoreB);
      setMatches(prev => prev.map(m => m.id === matchId ? updatedMatch : m));
      return updatedMatch;
    } catch (err) {
      setError(err.message || "Failed to submit match result");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    error,
    fetchMatches,
    createMatch,
    updateMatch,
    deleteMatch,
    submitResult
  };
};
