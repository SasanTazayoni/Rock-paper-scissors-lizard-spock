import { render, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import NavigationButtons from "./NavigationButtons";

describe("NavigationButtons component", () => {
  test("renders all buttons with correct aria-labels", () => {
    const { getByRole } = render(
      <NavigationButtons
        resetGame={() => {}}
        resetTotals={() => {}}
        openRulesModal={() => {}}
        openGameScoresModal={() => {}}
      />,
    );

    expect(getByRole("button", { name: /reset button/i })).toBeInTheDocument();
    expect(
      getByRole("button", { name: /see rules button/i }),
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: /game scores button/i }),
    ).toBeInTheDocument();
  });

  test("calls correct callbacks on button clicks", () => {
    const resetGameMock = vi.fn();
    const resetTotalsMock = vi.fn();
    const openRulesModalMock = vi.fn();
    const openGameScoresModalMock = vi.fn();

    const { getByRole } = render(
      <NavigationButtons
        resetGame={resetGameMock}
        resetTotals={resetTotalsMock}
        openRulesModal={openRulesModalMock}
        openGameScoresModal={openGameScoresModalMock}
      />,
    );

    fireEvent.click(getByRole("button", { name: /reset button/i }));
    expect(resetGameMock).toHaveBeenCalled();
    expect(resetTotalsMock).toHaveBeenCalledTimes(1);

    fireEvent.click(getByRole("button", { name: /see rules button/i }));
    expect(openRulesModalMock).toHaveBeenCalled();

    fireEvent.click(getByRole("button", { name: /game scores button/i }));
    expect(openGameScoresModalMock).toHaveBeenCalled();
  });
});

describe("NavigationButtons ripple effect", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("creates and removes ripple span on mousedown", () => {
    const { getByRole } = render(
      <NavigationButtons
        resetGame={() => {}}
        resetTotals={() => {}}
        openRulesModal={() => {}}
        openGameScoresModal={() => {}}
      />,
    );

    const resetBtn = getByRole("button", { name: /reset button/i });
    fireEvent.mouseDown(resetBtn);

    const ripple = resetBtn.querySelector("span");
    expect(ripple).toBeInTheDocument();

    vi.advanceTimersByTime(500);
    expect(resetBtn.querySelector("span")).toBeNull();
  });
});
