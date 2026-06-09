// Helper functions for scoring, calculations, and general utilities

import { POINTS_CONFIG } from "./constants";

/**
 * Calculates prediction points based on predicted and actual scores
 */
export const calculatePoints = (predA, predB, actA, actB, perfectPoints = 10, winnerPoints = 5) => {
  if (actA === null || actB === null || predA === null || predB === null) return null;
  
  const pA = parseInt(predA, 10);
  const pB = parseInt(predB, 10);
  const aA = parseInt(actA, 10);
  const aB = parseInt(actB, 10);

  // 1. Perfect Match Score
  if (pA === aA && pB === aB) {
    return perfectPoints;
  }

  // 2. Correct Outcome (Winner or Draw)
  const predictedOutcome = Math.sign(pA - pB); // 1 = Team A win, -1 = Team B win, 0 = Draw
  const actualOutcome = Math.sign(aA - aB);

  if (predictedOutcome === actualOutcome) {
    return winnerPoints;
  }

  // 3. Incorrect Outcome
  return POINTS_CONFIG.INCORRECT;
};

/**
 * Combine multiple classNames conditionally (utility helper)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Safely parse JSON with fallback
 */
export const safeParse = (data, fallback = null) => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error("Error parsing JSON", error);
    return fallback;
  }
};

const flagPresets = {
  "Argentina": "🇦🇷",
  "France": "🇫🇷",
  "Brazil": "🇧🇷",
  "Germany": "🇩🇪",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Spain": "🇪🇸",
  "Portugal": "🇵🇹",
  "Italy": "🇮🇹",
  "Netherlands": "🇳🇱",
  "Belgium": "🇧🇪",
  "Uruguay": "🇺🇾",
  "Senegal": "🇸🇳",
  "Japan": "🇯🇵",
  "Croatia": "🇭🇷",
  "Morocco": "🇲🇦",
  "United States": "🇺🇸"
};

/**
 * Resolves a country/team name to a matching flag emoji
 */
export const getTeamFlag = (name) => {
  if (!name) return "⚽";
  const normalized = name.trim();
  const found = Object.keys(flagPresets).find(
    k => k.toLowerCase() === normalized.toLowerCase()
  );
  if (found) return flagPresets[found];
  
  const partial = Object.keys(flagPresets).find(
    k => normalized.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(normalized.toLowerCase())
  );
  return partial ? flagPresets[partial] : "⚽";
};
