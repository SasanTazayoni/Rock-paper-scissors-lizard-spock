import { render, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ScoresModal from "./ScoresModal";

describe("ScoresModal", () => {
  test("mid-game: shows the default heading and both totals", () => {
    const { getByRole, getByTestId } = render(
      <ScoresModal
        outcome={null}
        totalWins={1}
        totalLosses={2}
        closeGameScoresModal={() => {}}
      />,
    );

    expect(getByRole("dialog", { name: "Game Scores" })).toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("1");
    expect(getByTestId("total-losses")).toHaveTextContent("2");
  });

  test("shows 'Game Over! You won!' after a win", () => {
    const { getByRole } = render(
      <ScoresModal
        outcome="WIN"
        totalWins={4}
        totalLosses={2}
        closeGameScoresModal={() => {}}
      />,
    );

    expect(
      getByRole("dialog", { name: "Game Over! You won!" }),
    ).toBeInTheDocument();
  });

  test("shows 'Game Over! You lost!' after a loss", () => {
    const { getByRole } = render(
      <ScoresModal
        outcome="LOSE"
        totalWins={4}
        totalLosses={5}
        closeGameScoresModal={() => {}}
      />,
    );

    expect(
      getByRole("dialog", { name: "Game Over! You lost!" }),
    ).toBeInTheDocument();
  });

  test("calls closeGameScoresModal when 'Continue' is clicked", () => {
    const closeHandler = vi.fn();
    const { getByText } = render(
      <ScoresModal
        outcome={null}
        totalWins={1}
        totalLosses={0}
        closeGameScoresModal={closeHandler}
      />,
    );

    fireEvent.click(getByText("Continue"));
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });

  test("opens as a modal with focus on Continue", () => {
    const { getByTestId } = render(
      <ScoresModal
        outcome={null}
        totalWins={0}
        totalLosses={0}
        closeGameScoresModal={() => {}}
      />,
    );

    expect(getByTestId("game-scores-modal")).toHaveAttribute("open");
    expect(getByTestId("continue-button")).toHaveFocus();
  });
});
