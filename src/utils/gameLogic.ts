import { CHOICES, type Selection } from "./choices";

/** Rounds needed to win a game. */
export const WINNING_SCORE = 5;

/** The result of one round, from the player's point of view. */
export type RoundOutcome = "WIN" | "LOSE" | "DRAW";

/** The result of a finished game, from the player's point of view. */
export type GameOutcome = Exclude<RoundOutcome, "DRAW">;

export const playGameRound = (
  player: Selection,
  computer: Selection,
): RoundOutcome => {
  if (player === computer) return "DRAW";
  return CHOICES[player].beats.includes(computer) ? "WIN" : "LOSE";
};

/** The game's result once either side reaches WINNING_SCORE, otherwise null. */
export const getGameOutcome = (
  playerScore: number,
  computerScore: number,
): GameOutcome | null => {
  if (playerScore >= WINNING_SCORE) return "WIN";
  if (computerScore >= WINNING_SCORE) return "LOSE";
  return null;
};
