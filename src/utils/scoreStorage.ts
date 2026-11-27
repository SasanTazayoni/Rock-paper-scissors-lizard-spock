// All access to the saved game totals goes through this module.
//
// Every localStorage call is wrapped in try/catch: browsers that block storage
// (privacy settings, some embedded views) throw on access, and an uncaught
// throw during render would blank the whole page.

export const STORAGE_KEY = "gameScores";

export type GameTotals = {
  wins: number;
  losses: number;
};

const emptyTotals = (): GameTotals => ({ wins: 0, losses: 0 });

const toCount = (value: unknown): number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : 0;

export function loadTotals(): GameTotals {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return emptyTotals();
  }

  if (raw === null) return emptyTotals();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    clearTotals();
    return emptyTotals();
  }

  if (typeof parsed !== "object" || parsed === null) {
    clearTotals();
    return emptyTotals();
  }

  // Stored as { player, computer } so totals saved by older versions still load.
  const { player, computer } = parsed as Record<string, unknown>;
  return { wins: toCount(player), losses: toCount(computer) };
}

export function saveTotals({ wins, losses }: GameTotals): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: wins, computer: losses }),
    );
  } catch {
    // Storage unavailable or full: totals still work for this session.
  }
}

export function clearTotals(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: nothing to clear.
  }
}
