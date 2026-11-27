import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ResultColumn from "./ResultColumn";
import type { Round } from "../utils/gameLogic";

// Latest first: the player won round 2 with paper, round 1 was a rock draw.
const rounds: Round[] = [
  { id: 2, player: "paper", computer: "rock", outcome: "WIN" },
  { id: 1, player: "rock", computer: "rock", outcome: "DRAW" },
];

describe("ResultColumn", () => {
  test("renders the side's label and score", () => {
    const { getByText, getByTestId } = render(
      <ResultColumn side="player" score={3} rounds={[]} />,
    );
    expect(getByText("Player:")).toBeInTheDocument();
    expect(getByTestId("player-score")).toHaveTextContent("3");
  });

  test("the score colour comes from the side, not the label text", () => {
    const { getByTestId: player } = render(
      <ResultColumn side="player" score={0} rounds={[]} />,
    );
    expect(player("player-score")).toHaveClass("player-game-score");

    const { getByTestId: computer } = render(
      <ResultColumn side="computer" score={0} rounds={[]} />,
    );
    expect(computer("computer-score")).toHaveClass("computer-game-score");
  });

  test("shows this side's move for each round, latest first", () => {
    const { getByTestId } = render(
      <ResultColumn side="player" score={1} rounds={rounds} />,
    );
    expect(getByTestId("player-latest-result")).toHaveTextContent("🖐");
    expect(getByTestId("player-result-1")).toHaveTextContent("✊");
  });

  test("marks only the rounds this side won", () => {
    const { getByTestId: player } = render(
      <ResultColumn side="player" score={1} rounds={rounds} />,
    );
    expect(player("player-latest-result")).toHaveClass("winner");
    expect(player("player-result-1")).not.toHaveClass("winner");

    const { getByTestId: computer } = render(
      <ResultColumn side="computer" score={0} rounds={rounds} />,
    );
    expect(computer("computer-latest-result")).not.toHaveClass("winner");
    expect(computer("computer-result-1")).not.toHaveClass("winner");
  });

  test("gives each move a spoken name instead of the emoji", () => {
    const { getAllByRole } = render(
      <ResultColumn side="player" score={1} rounds={rounds} />,
    );
    expect(getAllByRole("img").map((img) => img.getAttribute("aria-label")))
      .toEqual(["Paper, won the round", "Rock"]);
  });

  test("keeps each round's element when a new round is added", () => {
    const { getByTestId, rerender } = render(
      <ResultColumn side="player" score={1} rounds={rounds} />,
    );
    const paperElement = getByTestId("player-latest-result");

    rerender(
      <ResultColumn
        side="player"
        score={1}
        rounds={[
          { id: 3, player: "spock", computer: "spock", outcome: "DRAW" },
          ...rounds,
        ]}
      />,
    );

    // Keyed by round id, so React moves the existing element down
    // instead of rewriting every row.
    expect(getByTestId("player-result-1")).toBe(paperElement);
  });
});
