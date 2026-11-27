import { describe, test, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GameComponent from "./GameComponent";
import * as gameLogic from "./utils/gameLogic.ts";
import * as scoreStorage from "./utils/scoreStorage";
import * as computerChoice from "./utils/computerChoice";
import { CHOICES } from "./utils/choices";
import { STORAGE_KEY } from "./utils/scoreStorage";
import { MENU, clickTimes } from "./test/helpers";

const pressEscape = (dialog: HTMLElement) =>
  fireEvent(dialog, new Event("cancel", { cancelable: true }));

describe("GameComponent – initial render", () => {
  test("shows the Rules modal on first load, with focus on it", () => {
    const { getByTestId } = render(<GameComponent />);

    expect(getByTestId("rules-modal")).toHaveAttribute("open");
    expect(getByTestId("rules-modal")).toHaveFocus();
  });

  test("renders navigation buttons (Reset, See rules, Wins & losses)", () => {
    render(<GameComponent />);

    expect(screen.getByRole("button", { name: MENU.reset })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: MENU.rules })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: MENU.scores })).toBeInTheDocument();
  });

  test("renders selection buttons (rock, paper, scissors, lizard, spock)", () => {
    const { getByLabelText } = render(<GameComponent />);

    expect(getByLabelText(/^Rock icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Paper icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Scissors icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Lizard icon:/i)).toBeInTheDocument();
    expect(getByLabelText(/^Spock icon:/i)).toBeInTheDocument();
  });

  test("shows both sides' labels with scores of 0", () => {
    render(<GameComponent />);

    expect(screen.getByText("Player:")).toBeInTheDocument();
    expect(screen.getByTestId("player-score")).toHaveTextContent("0");
    expect(screen.getByText("Computer:")).toBeInTheDocument();
    expect(screen.getByTestId("computer-score")).toHaveTextContent("0");
  });

  test("the round announcement starts empty", () => {
    render(<GameComponent />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  test("ScoresModal: should not be visible initially", () => {
    const { queryByTestId } = render(<GameComponent />);

    expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
  });
});

describe("Score updates on selection", () => {
  test("clicking a selection button increases player score on a win", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByRole } = render(<GameComponent />);

    const playerScore = screen.getByTestId("player-score");
    expect(playerScore.textContent).toBe("0");

    fireEvent.click(getByRole("button", { name: /Rock icon/i }));

    expect(playerScore.textContent).toBe("1");
  });

  test("clicking a selection button increases computer score on a loss", async () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("LOSE");

    const { getByRole } = render(<GameComponent />);

    const computerScore = screen.getByTestId("computer-score");
    expect(computerScore.textContent).toBe("0");

    fireEvent.click(getByRole("button", { name: /Rock icon/i }));

    await waitFor(() => {
      expect(computerScore.textContent).toBe("1");
    });
  });

  test("a draw adds a round to both columns but changes neither score", () => {
    vi.spyOn(computerChoice, "getComputerChoice").mockReturnValue(CHOICES.rock);
    render(<GameComponent />);

    fireEvent.click(screen.getByRole("button", { name: /Rock icon/i }));

    expect(screen.getByTestId("player-score")).toHaveTextContent("0");
    expect(screen.getByTestId("computer-score")).toHaveTextContent("0");
    expect(screen.getByTestId("player-latest-result")).not.toHaveClass("winner");
    expect(screen.getByTestId("computer-latest-result")).not.toHaveClass(
      "winner",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Round 1: you chose Rock, the computer chose Rock. It's a draw. Score: you 0, computer 0.",
    );
  });

  test("each round is announced to screen readers", () => {
    vi.spyOn(computerChoice, "getComputerChoice").mockReturnValue(
      CHOICES.scissors,
    );
    render(<GameComponent />);

    fireEvent.click(screen.getByRole("button", { name: /Rock icon/i }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Round 1: you chose Rock, the computer chose Scissors. You win the round. Score: you 1, computer 0.",
    );

    fireEvent.click(screen.getByRole("button", { name: /Paper icon/i }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Round 2: you chose Paper, the computer chose Scissors. The computer wins the round. Score: you 1, computer 1.",
    );
  });
});

describe("Game Over Behavior", () => {
  test("game ends when PLAYER reaches 5 points, ScoresModal opens, wins updated", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByRole, getByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    clickTimes(rockBtn);

    expect(screen.getByTestId("player-score").textContent).toBe("5");
    expect(getByTestId("game-scores-modal")).toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("1");
    expect(getByTestId("total-losses")).toHaveTextContent("0");
    expect(scoreStorage.loadTotals()).toEqual({ wins: 1, losses: 0 });
  });

  test("game ends when COMPUTER reaches 5 points, ScoresModal opens, losses updated", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("LOSE");

    const { getByRole, getByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    clickTimes(rockBtn);

    expect(screen.getByTestId("computer-score").textContent).toBe("5");
    expect(getByTestId("game-scores-modal")).toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("0");
    expect(getByTestId("total-losses")).toHaveTextContent("1");
    expect(scoreStorage.loadTotals()).toEqual({ wins: 0, losses: 1 });
  });

  test("selections after game over are ignored and total wins update only once", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");
    const saveSpy = vi.spyOn(scoreStorage, "saveTotals");

    const { getByRole, getByTestId, queryByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    clickTimes(rockBtn);
    expect(saveSpy).toHaveBeenCalledTimes(1);

    // The Scores modal is open, but the selection buttons are still reachable
    // by keyboard, so extra clicks must not count.
    fireEvent.click(rockBtn);
    fireEvent.click(rockBtn);

    expect(screen.getByTestId("player-score").textContent).toBe("5");
    expect(queryByTestId("player-result-5")).not.toBeInTheDocument();
    expect(getByTestId("total-wins")).toHaveTextContent("1");
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  test("shows totals saved by a previous visit", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 3, computer: 2 }),
    );

    const { getByTestId } = render(<GameComponent />);
    fireEvent.click(screen.getByRole("button", { name: MENU.scores }));

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

    const { getByRole, getByTestId } = render(
      <GameComponent />,
    );
    const rockBtn = getByRole("button", { name: /Rock icon/i });

    clickTimes(rockBtn);
    expect(getByTestId("total-wins")).toHaveTextContent("1");

    fireEvent.click(getByTestId("continue-button"));
    clickTimes(rockBtn);
    expect(getByTestId("total-wins")).toHaveTextContent("2");

    fireEvent.click(getByTestId("continue-button"));
    fireEvent.click(screen.getByRole("button", { name: MENU.reset }));
    fireEvent.click(screen.getByRole("button", { name: MENU.scores }));
    expect(getByTestId("total-wins")).toHaveTextContent("0");
  });
});

describe("Reset button", () => {
  test("clicking Reset zeroes scores and clears history", async () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const { getByRole, queryByTestId } = render(
      <GameComponent />,
    );

    fireEvent.click(getByRole("button", { name: /Rock icon/i }));

    await waitFor(() => {
      expect(screen.getByTestId("player-score").textContent).toBe("1");
    });

    fireEvent.click(screen.getByRole("button", { name: MENU.reset }));

    await waitFor(() => {
      expect(screen.getByTestId("player-score").textContent).toBe("0");
      expect(screen.getByTestId("computer-score").textContent).toBe("0");
      expect(queryByTestId("player-latest-result")).toBeNull();
      expect(queryByTestId("computer-latest-result")).toBeNull();
    });
  });

  test("clicking Reset also clears saved totals", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 3, computer: 2 }),
    );

    const { getByTestId } = render(<GameComponent />);

    fireEvent.click(screen.getByRole("button", { name: MENU.reset }));
    fireEvent.click(screen.getByRole("button", { name: MENU.scores }));

    expect(getByTestId("total-wins")).toHaveTextContent("0");
    expect(getByTestId("total-losses")).toHaveTextContent("0");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
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
    const { getByText } = render(<GameComponent />);
    fireEvent.click(getByText(/play game/i));

    const seeRules = screen.getByRole("button", { name: MENU.rules });
    seeRules.focus();
    fireEvent.click(seeRules);
    expect(screen.getByTestId("rules-modal")).toHaveFocus();

    fireEvent.click(getByText(/play game/i));
    expect(seeRules).toHaveFocus();
  });
});

describe("ScoresModal close behavior", () => {
  test("clicking Continue closes ScoresModal and resets game on WIN", async () => {
    const { getByRole, queryByTestId, getByTestId } = render(
      <GameComponent />,
    );
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");

    const rockBtn = getByRole("button", { name: /Rock icon/i });
    clickTimes(rockBtn);

    await waitFor(() => {
      expect(queryByTestId("game-scores-modal")).toBeInTheDocument();
      expect(screen.getByTestId("player-score").textContent).toBe("5");
    });

    fireEvent.click(getByTestId("continue-button"));

    await waitFor(() => {
      expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
      expect(screen.getByTestId("player-score").textContent).toBe("0");
      expect(screen.getByTestId("computer-score").textContent).toBe("0");
    });
  });

  test("pressing Escape after game over also resets the game", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("LOSE");
    const { getByRole, getByTestId, queryByTestId } = render(
      <GameComponent />,
    );

    const rockBtn = getByRole("button", { name: /Rock icon/i });
    clickTimes(rockBtn);
    expect(getByRole("dialog", { name: "Game Over! You lost!" })).toBeVisible();

    pressEscape(getByTestId("game-scores-modal"));

    expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
    expect(screen.getByTestId("computer-score").textContent).toBe("0");
  });

  test("opening scores mid-game and pressing Continue keeps the current game", () => {
    vi.spyOn(gameLogic, "playGameRound").mockReturnValue("WIN");
    const { getByRole, getByTestId, queryByTestId } = render(
      <GameComponent />,
    );

    const rockBtn = getByRole("button", { name: /Rock icon/i });
    fireEvent.click(rockBtn);
    fireEvent.click(rockBtn);

    fireEvent.click(screen.getByRole("button", { name: MENU.scores }));
    expect(getByRole("dialog", { name: "Game Scores" })).toBeVisible();

    fireEvent.click(getByTestId("continue-button"));

    expect(queryByTestId("game-scores-modal")).not.toBeInTheDocument();
    expect(screen.getByTestId("player-score").textContent).toBe("2");
    expect(queryByTestId("player-result-1")).toBeInTheDocument();
  });
});

describe("RulesModal behavior", () => {
  test("clicking See rules button re‑opens the Rules modal (openRulesModal)", async () => {
    const { getByText, queryByTestId } = render(
      <GameComponent />,
    );

    fireEvent.click(getByText(/play game/i)); // closes Rules modal
    await waitFor(() =>
      expect(queryByTestId("rules-modal")).not.toBeInTheDocument(),
    );

    const seeRulesBtn = screen.getByRole("button", { name: MENU.rules });
    fireEvent.click(seeRulesBtn);

    await waitFor(() =>
      expect(queryByTestId("rules-modal")).toBeInTheDocument(),
    );
  });
});
