import { useState } from "react";
import {
  clearTotals,
  loadTotals,
  saveTotals,
  type GameTotals,
} from "../utils/scoreStorage";
import type { GameOutcome } from "../utils/gameLogic";

export function useGameTotals() {
  // Lazy initialiser: read storage once on first render, no effect needed.
  const [totals, setTotals] = useState<GameTotals>(loadTotals);

  const recordGame = (outcome: GameOutcome) => {
    const next: GameTotals =
      outcome === "WIN"
        ? { ...totals, wins: totals.wins + 1 }
        : { ...totals, losses: totals.losses + 1 };
    saveTotals(next);
    setTotals(next);
  };

  const resetTotals = () => {
    clearTotals();
    setTotals({ wins: 0, losses: 0 });
  };

  return {
    totalWins: totals.wins,
    totalLosses: totals.losses,
    recordGame,
    resetTotals,
  };
}
