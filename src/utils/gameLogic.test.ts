import { describe, expect, test } from "vitest";
import { getGameOutcome, playGameRound, WINNING_SCORE } from "./gameLogic";
import { SELECTIONS, type Selection } from "./choices";

// The ten winning matchups of Rock Paper Scissors Lizard Spock, written out
// independently of CHOICES so a wrong entry in the table fails these tests.
const WINS: ReadonlyArray<[Selection, Selection]> = [
  ["scissors", "paper"], // scissors cuts paper
  ["paper", "rock"], // paper covers rock
  ["rock", "lizard"], // rock crushes lizard
  ["lizard", "spock"], // lizard poisons Spock
  ["spock", "scissors"], // Spock smashes scissors
  ["scissors", "lizard"], // scissors decapitates lizard
  ["lizard", "paper"], // lizard eats paper
  ["paper", "spock"], // paper disproves Spock
  ["spock", "rock"], // Spock vaporizes rock
  ["rock", "scissors"], // rock crushes scissors
];

const expected = (player: Selection, computer: Selection) => {
  if (player === computer) return "DRAW";
  return WINS.some(([w, l]) => w === player && l === computer) ? "WIN" : "LOSE";
};

const allMatchups = SELECTIONS.flatMap((player) =>
  SELECTIONS.map((computer) => [player, computer] as const),
);

describe("playGameRound", () => {
  test("covers all 25 matchups", () => {
    expect(allMatchups).toHaveLength(25);
  });

  test.each(allMatchups)("%s vs %s", (player, computer) => {
    expect(playGameRound(player, computer)).toBe(expected(player, computer));
  });

  test("swapping sides flips WIN and LOSE", () => {
    for (const [a, b] of allMatchups) {
      const forward = playGameRound(a, b);
      const backward = playGameRound(b, a);
      if (forward === "DRAW") expect(backward).toBe("DRAW");
      else expect(backward).toBe(forward === "WIN" ? "LOSE" : "WIN");
    }
  });
});

describe("getGameOutcome", () => {
  test("is null until either side reaches the winning score", () => {
    expect(getGameOutcome(0, 0)).toBeNull();
    expect(getGameOutcome(WINNING_SCORE - 1, WINNING_SCORE - 1)).toBeNull();
  });

  test("is WIN when the player reaches the winning score", () => {
    expect(getGameOutcome(WINNING_SCORE, 3)).toBe("WIN");
  });

  test("is LOSE when the computer reaches the winning score", () => {
    expect(getGameOutcome(2, WINNING_SCORE)).toBe("LOSE");
  });
});
