import { CHOICES, type Selection } from "./choices";

/** Rounds needed to win a game. */
export const WINNING_SCORE = 5;

/** The result of one round, from the player's point of view. */
export type RoundOutcome = "WIN" | "LOSE" | "DRAW";

/** The result of a finished game, from the player's point of view. */
export type GameOutcome = Exclude<RoundOutcome, "DRAW">;

export type Side = "player" | "computer";

/** One played round. `id` is stable, so React can key the history by it. */
export type Round = {
  id: number;
  player: Selection;
  computer: Selection;
  outcome: RoundOutcome;
};

/** Whether `side` won `round`. */
export const isRoundWinner = (round: Round, side: Side) =>
  round.outcome === (side === "player" ? "WIN" : "LOSE");

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
