// Global Constants for FIFA Match Prediction Platform

export const POINTS_CONFIG = {
  PERFECT_SCORE: 10,
  CORRECT_OUTCOME: 5, // Winner or draw correct, but score mismatch
  INCORRECT: 0
};

export const MATCH_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  COMPLETED: "completed"
};

export const PREDICTION_STATUS = {
  PENDING: "pending",
  CORRECT: "correct", // Perfect score
  OUTCOME: "outcome", // Winner only
  INCORRECT: "incorrect"
};

export const STORAGE_KEYS = {
  USERS: "fifa_users",
  MATCHES: "fifa_matches",
  PREDICTIONS: "fifa_predictions",
  THEME: "fifa_theme",
  CURRENT_USER: "fifa_current_user"
};
