import { render, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import NavigationButtons from "./NavigationButtons";
import { MENU } from "../test/helpers";

const renderButtons = (props: Partial<Parameters<typeof NavigationButtons>[0]> = {}) =>
  render(
    <NavigationButtons
      resetGame={() => {}}
      resetTotals={() => {}}
      openRulesModal={() => {}}
      openGameScoresModal={() => {}}
      {...props}
    />,
  );

describe("NavigationButtons component", () => {
  test("each button's accessible name is its visible text", () => {
    const { getByRole } = renderButtons();

    for (const name of Object.values(MENU)) {
      expect(getByRole("button", { name })).toHaveTextContent(name);
    }
  });

  test("renders a single navigation landmark", () => {
    const { getAllByRole } = renderButtons();
    expect(getAllByRole("navigation")).toHaveLength(1);
  });

  test("calls correct callbacks on button clicks", () => {
    const resetGame = vi.fn();
    const resetTotals = vi.fn();
    const openRulesModal = vi.fn();
    const openGameScoresModal = vi.fn();

    const { getByRole } = renderButtons({
      resetGame,
      resetTotals,
      openRulesModal,
      openGameScoresModal,
    });

    fireEvent.click(getByRole("button", { name: MENU.reset }));
    expect(resetGame).toHaveBeenCalledTimes(1);
    expect(resetTotals).toHaveBeenCalledTimes(1);

    fireEvent.click(getByRole("button", { name: MENU.rules }));
    expect(openRulesModal).toHaveBeenCalledTimes(1);

    fireEvent.click(getByRole("button", { name: MENU.scores }));
    expect(openGameScoresModal).toHaveBeenCalledTimes(1);
  });
});

describe("NavigationButtons ripple effect", () => {
  const pressReset = (clientX: number, clientY: number) => {
    const utils = renderButtons();
    const resetBtn = utils.getByRole("button", { name: MENU.reset });
    vi.spyOn(resetBtn, "getBoundingClientRect").mockReturnValue(
      new DOMRect(100, 50, 200, 45),
    );
    fireEvent.mouseDown(resetBtn, { clientX, clientY });
    return resetBtn;
  };

  test("places the ripple where the button was pressed", () => {
    const resetBtn = pressReset(130, 70);

    const ripple = resetBtn.querySelector(".ripple");
    expect(ripple).toHaveStyle({ left: "30px", top: "20px" });
  });

  test("removes the ripple when its animation ends", () => {
    const resetBtn = pressReset(130, 70);
    const ripple = resetBtn.querySelector(".ripple");
    expect(ripple).toBeInTheDocument();

    fireEvent.animationEnd(ripple!);

    expect(resetBtn.querySelector(".ripple")).toBeNull();
  });

  test("the ripple doesn't change the button's accessible name", () => {
    const resetBtn = pressReset(130, 70);
    expect(resetBtn).toHaveAccessibleName(MENU.reset);
  });
});
