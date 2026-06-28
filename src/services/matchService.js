// Match Service — fully dynamic, no local storage data caching
import { safeParse, getTeamFlag } from "../utils/helpers";
import { STORAGE_KEYS } from "../utils/constants";
import { getMatchesAPI } from "../api/Matcheslist";
import { deleteMatchAPI } from "../api/delete";
import { editMatchAPI } from "../api/edit";
import { submitResultAPI } from "../api/resultandpoin";
import { getActiveMatchesAPI } from "../api/user/matchesview";

export const matchService = {
  getMatches: async () => {
    const currentUser = safeParse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER), null);
    const isAdmin = currentUser && currentUser.role === "admin";

    const response = isAdmin
      ? await getMatchesAPI()
      : await getActiveMatchesAPI();

    if (response && response.success) {
      const backendMatches = isAdmin
        ? (response.data && response.data.matches ? response.data.matches : [])
        : (response.data && response.data.matches ? response.data.matches : Array.isArray(response.data) ? response.data : []);

      return backendMatches.map(b => ({
        id: b._id,
        teamA: b.teamA,
        teamB: b.teamB,
        teamAFlag: getTeamFlag(b.teamA),
        teamBFlag: getTeamFlag(b.teamB),
        dateTime: b.matchDateTime,
        closingTime: b.predictionClosingTime || b.matchDateTime,
        scoreA: b.actualTeamAScore,
        scoreB: b.actualTeamBScore,
        status: b.status || "upcoming",
        perfectPoints: parseInt(b.perfectScorePoint || 10, 10),
        winnerPoints: parseInt(b.winnerOnlyPoint || 5, 10),
        predictedTeamAScore: b.predictedTeamAScore !== undefined ? b.predictedTeamAScore : null,
        predictedTeamBScore: b.predictedTeamBScore !== undefined ? b.predictedTeamBScore : null,
        predictedWinner: b.predictedWinner !== undefined ? b.predictedWinner : null
      }));
    }

    return [];
  },

  getMatchById: async (id) => {
    const matches = await matchService.getMatches();
    return matches.find(m => m.id === id) || null;
  },

  createMatch: async (matchData) => {
    return matchData;
  },

  updateMatch: async (matchId, updatedData) => {
    const matches = await matchService.getMatches();
    const existingMatch = matches.find(m => m.id === matchId);

    if (!existingMatch) throw new Error("Match not found");

    const formatAPIDate = (isoStr) => {
      if (!isoStr) return "";
      return isoStr.split(".")[0] + "Z";
    };

    const scoreA = updatedData.scoreA !== undefined ? updatedData.scoreA : existingMatch.scoreA;
    const scoreB = updatedData.scoreB !== undefined ? updatedData.scoreB : existingMatch.scoreB;

    let winner = null;
    if (scoreA !== null && scoreB !== null) {
      if (scoreA > scoreB) winner = updatedData.teamA || existingMatch.teamA;
      else if (scoreB > scoreA) winner = updatedData.teamB || existingMatch.teamB;
    }

    const payload = {
      teamA: updatedData.teamA || existingMatch.teamA,
      teamB: updatedData.teamB || existingMatch.teamB,
      matchDateTime: formatAPIDate(updatedData.dateTime || existingMatch.dateTime),
      predictionClosingTime: formatAPIDate(updatedData.closingTime || existingMatch.closingTime),
      perfectScorePoint: parseInt(updatedData.perfectPoints !== undefined ? updatedData.perfectPoints : existingMatch.perfectPoints, 10),
      winnerOnlyPoint: parseInt(updatedData.winnerPoints !== undefined ? updatedData.winnerPoints : existingMatch.winnerPoints, 10),
      actualTeamAScore: scoreA !== null ? parseInt(scoreA, 10) : null,
      actualTeamBScore: scoreB !== null ? parseInt(scoreB, 10) : null,
      actualWinner: winner,
      status: updatedData.status || existingMatch.status || "upcoming"
    };

    try {
      await editMatchAPI(matchId, payload);
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to edit match fixture on backend");
    }

    return { ...existingMatch, ...updatedData };
  },

  deleteMatch: async (matchId) => {
    try {
      await deleteMatchAPI(matchId);
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to delete match fixture on the backend");
    }
    return true;
  },

  submitResult: async (matchId, scoreA, scoreB, penaltyWinnerTeam = null) => {
    const parsedScoreA = parseInt(scoreA, 10);
    const parsedScoreB = parseInt(scoreB, 10);

    try {
      await submitResultAPI(matchId, {
        actualTeamAScore: parsedScoreA,
        actualTeamBScore: parsedScoreB,
        ...(parsedScoreA === parsedScoreB && penaltyWinnerTeam ? { penaltyWinnerTeam } : {})
      });
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit result on backend");
    }

    return { matchId, scoreA: parsedScoreA, scoreB: parsedScoreB, penaltyWinnerTeam, status: "completed" };
  }
};
