// Prediction Service — fully dynamic, no local storage data caching
import { getTeamFlag } from "../utils/helpers";
import { submitPredictionAPI } from "../api/user/predictions";
import { getMyPredictionsAPI } from "../api/user/myprediction";

export const predictionService = {
  getPredictionsByUserId: async () => {
    const response = await getMyPredictionsAPI();
    if (!response || !response.success) return [];

    const backendPreds = response.data || response.predictions || [];

    return backendPreds.map(p => {
      const matchObj = typeof p.matchId === "object" && p.matchId !== null ? p.matchId : null;
      const matchIdStr = matchObj ? (matchObj._id || matchObj.id) : p.matchId;

      const matchDetails = matchObj
        ? {
            id: matchObj._id || matchObj.id,
            teamA: matchObj.teamA,
            teamB: matchObj.teamB,
            teamAFlag: getTeamFlag(matchObj.teamA),
            teamBFlag: getTeamFlag(matchObj.teamB),
            dateTime: matchObj.matchDateTime,
            closingTime: matchObj.predictionClosingTime || matchObj.matchDateTime,
            scoreA: matchObj.actualTeamAScore,
            scoreB: matchObj.actualTeamBScore,
            status: matchObj.status || "upcoming",
            perfectPoints: parseInt(matchObj.perfectScorePoint || 10, 10),
            winnerPoints: parseInt(matchObj.winnerOnlyPoint || 5, 10)
          }
        : null;

      return {
        id: p._id || p.id,
        userId: p.userId,
        matchId: matchIdStr,
        predictScoreA: p.predictedTeamAScore,
        predictScoreB: p.predictedTeamBScore,
        pointsEarned: p.pointsEarned !== undefined ? p.pointsEarned : null,
        status: (matchObj && matchObj.status) ? matchObj.status : (p.status || "pending"),
        match: matchDetails
      };
    });
  },

  getPredictionByMatchAndUser: async (matchId) => {
    // Re-fetch from API — no local cache
    const preds = await predictionService.getPredictionsByUserId();
    return preds.find(p => p.matchId === matchId) || null;
  },

  submitPrediction: async (userId, matchId, predictScoreA, predictScoreB) => {
    const scoreA = parseInt(predictScoreA, 10);
    const scoreB = parseInt(predictScoreB, 10);

    if (isNaN(scoreA) || isNaN(scoreB)) {
      throw new Error("Invalid score values");
    }

    let apiPrediction = {};
    try {
      const apiResponse = await submitPredictionAPI({
        matchId,
        predictedTeamAScore: scoreA,
        predictedTeamBScore: scoreB
      });
      apiPrediction = apiResponse.prediction || {};
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit prediction on the backend");
    }

    return {
      id: apiPrediction.id || apiPrediction._id || `pred-${Date.now()}`,
      userId,
      matchId,
      predictScoreA: scoreA,
      predictScoreB: scoreB,
      pointsEarned: apiPrediction.pointsEarned !== undefined ? apiPrediction.pointsEarned : null,
      status: apiPrediction.status || "pending"
    };
  }
};
