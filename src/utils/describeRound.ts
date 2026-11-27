import { CHOICES } from "./choices";
import type { Round } from "./gameLogic";

const OUTCOME_TEXT: Record<Round["outcome"], string> = {
  WIN: "You win the round.",
  LOSE: "The computer wins the round.",
  DRAW: "It's a draw.",
};

/**
 * Screen-reader summary of a round. The round number keeps the text unique, so
 * a repeated result is still announced.
 */
export const describeRound = (
  round: Round,
  roundNumber: number,
  playerScore: number,
  computerScore: number,
) =>
  `Round ${roundNumber}: you chose ${CHOICES[round.player].label}, ` +
  `the computer chose ${CHOICES[round.computer].label}. ` +
  `${OUTCOME_TEXT[round.outcome]} ` +
  `Score: you ${playerScore}, computer ${computerScore}.`;
