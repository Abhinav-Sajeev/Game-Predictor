// Initial Mock Data for the FIFA Match Prediction Platform - Clean Slate

export const initialUsers = [];
export const initialMatches = [];
export const initialPredictions = [];

// Helper to initialize data in localStorage
export const initializeDatabase = () => {
  // Force a database cleanup once to clear out any old cached browser mock data from previous runs
  if (!localStorage.getItem("fifa_db_cleaned_v2")) {
    localStorage.removeItem("fifa_users");
    localStorage.removeItem("fifa_matches");
    localStorage.removeItem("fifa_predictions");
    localStorage.removeItem("fifa_current_user");
    localStorage.setItem("fifa_db_cleaned_v2", "true");
  }

  if (!localStorage.getItem("fifa_users")) {
    localStorage.setItem("fifa_users", JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem("fifa_matches")) {
    localStorage.setItem("fifa_matches", JSON.stringify(initialMatches));
  }
  if (!localStorage.getItem("fifa_predictions")) {
    localStorage.setItem("fifa_predictions", JSON.stringify(initialPredictions));
  }
};
