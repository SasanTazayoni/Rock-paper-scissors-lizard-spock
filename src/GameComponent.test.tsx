import { describe, test, expect, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import GameComponent from "./GameComponent";
import * as gameLogic from "./utils/gameLogic.ts";
import * as scoreStorage from "./utils/scoreStorage";

vi.mock("./components/Footer", () => ({
  default: () => <footer>Footer Mock</footer>,
}));

const pressEscape = (dialog: HTMLElement) =>
  fireEvent(dialog, new Event("cancel", { cancelable: true }));

describe("GameComponent – initial render", () => {
  test("shows the Rules modal on first load, with focus on Play game", () => {
    const { getByTestId, getByRole } = render(<GameComponent />);

    expect(getByTestId("rules-modal")).toHaveAttribute("open");
    expect(getByRole("button", { name: /play game/i })).toHaveFocus();
  });

  test("renders navigation buttons (Reset, See Rules, Game Scores)", () => {
    const { getByLabelText } = render(<GameComponent />);

    expect(getByLabelText("Reset Button")).toBeInTheDocument();
    expect(getByLabelText("See Rules Button")).toBeInTheDocument();
    expect(getByLabelText("Game Scores Button")).toBeInTheDocument();
  });

  test("renders selection buttons (rock, paper, scissors, lizard, spock)", () => {
    const { getByLabelText } = render(<GameComponent />);

    expect(getByLabelText(/^Rock icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Paper icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Scissors icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Lizard icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Spock icon:/i)).toBeInTheDocument();

    expect(getByLabelText("Player label")).toBeInTheDocument();
    expect(getByLabelText("Player score")).toHaveTextContent("0");
    expect(getByLabelText("Computer label")).toBeInTheDocument();
    expect(getByLabelText("Computer score")).toHaveTextContent("0");
  });

  test("renders result columns showing player and computer scores", () => {
    const { getByText } = render(<GameComponent />);

    const playerLabel = getByText(/Player:/i);
    expect(playerLabel).toBeInTheDocument();

    const playerScore =
      playerLabel.nextElementSibling ||
      playerLabel.querySelector(".score") ||
      (playerLabel.parentNode as Element).querySelector(".score");
    expect(playerScore).toBeInTheDocument();
    expect((playerScore as Element).textContent).toBe("0");

    const computerLabel = getByText(/Computer:/i);
    expect(computerLabel).toBeInTheDocument();

    const computerScore =
      computerLabel.nextElementSibling ||
      computerLabel.querySelector(".score") ||
      (computerLabel.parentNode as Element).querySelector(".score");
    expect(computerScore).toBeInTheDocument();
    expect((computerScore as Element).textContent).toBe("0");
  });

  test("ScoresModal: should not be visible initially", () => {
    const { queryByTestId } = render(<GameComponent />);

    expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
  });
});

describe("Score updates on selection", () => {
  test("clicking a selection button increases player score on a win", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByRole, getByLabelText } = render(<GameComponent />);

    const playerScore = getByLabelText("Player score");
    expect(playerScore.textContent).toBe("0");

    fireEvent.click(getByRole("button", { name: /Rock icon/i }));

    expect(playerScore.textContent).toBe("1");
  });

  test("clicking a selection button increases computer score on a loss", async () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("LOSE");

    const { getByRole, getByLabelText } = render(<GameComponent />);

    const computerScore = getByLabelText("Computer score");
    expect(computerScore.textContent).toBe("0");

    fireEvent.click(getByRole("button", { name: /Rock icon/i }));

    await waitFor(() => {
      expect(computerScore.textContent).toBe("1");
    });
  });
});

describe("Game Over Behavior", () => {
  test("game ends when PLAYER reaches 5 points, ScoresModal opens, wins updated", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByRole, getByLabelText, getByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    for (let i = 0; i < 5; i++) fireEvent.click(rockBtn);

    expect(getByLabelText("Player score").textContent).toBe("5");
    expect(getByTestId("game-scores-modal")).toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("1");
    expect(getByTestId("total-losses")).toHaveTextContent("0");
    expect(scoreStorage.loadTotals()).toEqual({ wins: 1, losses: 0 });
  });

  test("game ends when COMPUTER reaches 5 points, ScoresModal opens, losses updated", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("LOSE");

    const { getByRole, getByLabelText, getByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    for (let i = 0; i < 5; i++) fireEvent.click(rockBtn);

    expect(getByLabelText("Computer score").textContent).toBe("5");
    expect(getByTestId("game-scores-modal")).toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("0");
    expect(getByTestId("total-losses")).toHaveTextContent("1");
    expect(scoreStorage.loadTotals()).toEqual({ wins: 0, losses: 1 });
  });

  test("selections after game over are ignored and total wins update only once", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");
    const saveSpy = vi.spyOn(scoreStorage, "saveTotals");

    const { getByRole, getByLabelText, getByTestId, queryByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    for (let i = 0; i < 5; i++) fireEvent.click(rockBtn);
    expect(saveSpy).toHaveBeenCalledTimes(1);

    // The Scores modal is open, but the selection buttons are still reachable
    // by keyboard, so extra clicks must not count.
    fireEvent.click(rockBtn);
    fireEvent.click(rockBtn);

    expect(getByLabelText("Player score").textContent).toBe("5");
    expect(queryByTestId("player-result-5")).not.toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("1");
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  test("shows totals saved by a previous visit", () => {
    localStorage.setItem(
      "gameScores",
      JSON.stringify({ player: 3, computer: 2 }),
    );

    const { getByLabelText, getByTestId } = render(<GameComponent />);
    fireEvent.click(getByLabelText("Game Scores Button"));

    expect(getByTestId("total-wins")).toHaveTextContent("3");
    expect(getByTestId("total-losses")).toHaveTextContent("2");
  });
});

describe("when localStorage is blocked", () => {
  test("the game still renders, plays and counts totals", () => {
    const blocked = () => {
      throw new DOMException("Storage is disabled", "SecurityError");
    };
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByRole, getByLabelText, getByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    for (let i = 0; i < 5; i++) fireEvent.click(rockBtn);
    expect(getByTestId("total-wins")).toHaveTextContent("1");

    fireEvent.click(getByTestId("continue-button"));
    for (let i = 0; i < 5; i++) fireEvent.click(rockBtn);
    expect(getByTestId("total-wins")).toHaveTextContent("2");

    fireEvent.click(getByTestId("continue-button"));
    fireEvent.click(getByLabelText("Reset Button"));
    fireEvent.click(getByLabelText("Game Scores Button"));
    expect(getByTestId("total-wins")).toHaveTextContent("0");
  });
});

describe("Reset button", () => {
  test("clicking Reset zeroes scores and clears history", async () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByLabelText, getByRole, queryByTestId } = render(
      <GameComponent />,
    );

    fireEvent.click(getByRole("button", { name: /Rock icon/i }));

    await waitFor(() => {
      expect(getByLabelText("Player score").textContent).toBe("1");
    });

    fireEvent.click(getByLabelText("Reset Button"));

    await waitFor(() => {
      expect(getByLabelText("Player score").textContent).toBe("0");
      expect(getByLabelText("Computer score").textContent).toBe("0");
      expect(queryByTestId("player-latest-result")).toBeNull();
      expect(queryByTestId("computer-latest-result")).toBeNull();
    });
  });

  test("clicking Reset also clears saved totals", () => {
    localStorage.setItem(
      "gameScores",
      JSON.stringify({ player: 3, computer: 2 }),
    );

    const { getByLabelText, getByTestId } = render(<GameComponent />);

    fireEvent.click(getByLabelText("Reset Button"));
    fireEvent.click(getByLabelText("Game Scores Button"));

    expect(getByTestId("total-wins")).toHaveTextContent("0");
    expect(getByTestId("total-losses")).toHaveTextContent("0");
    expect(localStorage.getItem("gameScores")).toBeNull();
  });
});

describe("Rules Modal Close Behavior", () => {
  test("clicking Play game closes the Rules modal", () => {
    const { getByTestId, getByText, queryByTestId } = render(<GameComponent />);
    expect(getByTestId("rules-modal")).toBeInTheDocument();
    const playButton = getByText(/play game/i);
    fireEvent.click(playButton);
    expect(queryByTestId("rules-modal")).not.toBeInTheDocument();
  });

  test("pressing Escape closes the Rules modal", () => {
    const { getByTestId, queryByTestId } = render(<GameComponent />);

    pressEscape(getByTestId("rules-modal"));

    expect(queryByTestId("rules-modal")).not.toBeInTheDocument();
  });

  test("closing a reopened Rules modal returns focus to See rules", () => {
    const { getByLabelText, getByText } = render(<GameComponent />);
    fireEvent.click(getByText(/play game/i));

    const seeRules = getByLabelText("See Rules Button");
    seeRules.focus();
    fireEvent.click(seeRules);
    expect(getByText(/play game/i)).toHaveFocus();

    fireEvent.click(getByText(/play game/i));
    expect(seeRules).toHaveFocus();
  });
});

describe("ScoresModal close behavior", () => {
  test("clicking Continue closes ScoresModal and resets game on WIN", async () => {
    const { getByRole, queryByTestId, getByLabelText, getByTestId } = render(
      <GameComponent />,
    );
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const rockBtn = getByRole("button", { name: /Rock icon/i });
    for (let i = 0; i < 5; i++) {
      fireEvent.click(rockBtn);
    }

    await waitFor(() => {
      expect(queryByTestId("game-scores-modal")).toBeInTheDocument();
      expect(getByLabelText("Player score").textContent).toBe("5");
    });

    fireEvent.click(getByTestId("continue-button"));

    await waitFor(() => {
      expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
      expect(getByLabelText("Player score").textContent).toBe("0");
      expect(getByLabelText("Computer score").textContent).toBe("0");
    });
  });

  test("pressing Escape after game over also resets the game", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("LOSE");
    const { getByRole, getByLabelText, getByTestId, queryByTestId } = render(
      <GameComponent />,
    );

    const rockBtn = getByRole("button", { name: /Rock icon/i });
    for (let i = 0; i < 5; i++) fireEvent.click(rockBtn);
    expect(getByRole("dialog", { name: "Game Over! You lost!" })).toBeVisible();

    pressEscape(getByTestId("game-scores-modal"));

    expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
    expect(getByLabelText("Computer score").textContent).toBe("0");
  });

  test("opening scores mid-game and pressing Continue keeps the current game", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");
    const { getByRole, getByLabelText, getByTestId, queryByTestId } = render(
      <GameComponent />,
    );

    const rockBtn = getByRole("button", { name: /Rock icon/i });
    fireEvent.click(rockBtn);
    fireEvent.click(rockBtn);

    fireEvent.click(getByLabelText("Game Scores Button"));
    expect(getByRole("dialog", { name: "Game Scores" })).toBeVisible();

    fireEvent.click(getByTestId("continue-button"));

    expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
    expect(getByLabelText("Player score").textContent).toBe("2");
    expect(queryByTestId("player-result-1")).toBeInTheDocument();
  });
});

describe("RulesModal behavior", () => {
  test("clicking See rules button re‑opens the Rules modal (openRulesModal)", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(
      <GameComponent />,
    );

    fireEvent.click(getByText(/play game/i)); // closes Rules modal
    await waitFor(() =>
      expect(queryByTestId("rules-modal")).not.toBeInTheDocument(),
    );

    const seeRulesBtn = getByLabelText("See Rules Button");
    fireEvent.click(seeRulesBtn);

    await waitFor(() =>
      expect(queryByTestId("rules-modal")).toBeInTheDocument(),
    );
  });
});
