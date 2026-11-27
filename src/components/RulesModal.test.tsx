import { render, fireEvent } from "@testing-library/react";
import { describe, test, vi, expect } from "vitest";
import RulesModal from "./RulesModal";

describe("RulesModal", () => {
  test("renders when showRulesModal is true", () => {
    const { getByText } = render(
      <RulesModal showRulesModal={true} closeRulesModal={() => {}} />
    );

    expect(getByText(/how it works/i)).toBeInTheDocument();
    expect(getByText(/play game/i)).toBeInTheDocument();
  });

  test("does not render when showRulesModal is false", () => {
    const { container } = render(
      <RulesModal showRulesModal={false} closeRulesModal={() => {}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("calls closeRulesModal when Play game button is clicked", () => {
    const closeMock = vi.fn();
    const { getByText } = render(
      <RulesModal showRulesModal={true} closeRulesModal={closeMock} />
    );

    const button = getByText(/play game/i);
    fireEvent.click(button);

    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  test("lists every choice's rule, built from the choice table", () => {
    const { getAllByRole } = render(
      <RulesModal showRulesModal={true} closeRulesModal={() => {}} />,
    );

    expect(getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "✊Rock beats scissors and lizard but loses to paper and spock.",
      "🖐Paper beats rock and spock but loses to scissors and lizard.",
      "✌️Scissors beats paper and lizard but loses to rock and spock.",
      "🤏Lizard beats spock and paper but loses to rock and scissors.",
      "🖖Spock beats rock and scissors but loses to paper and lizard.",
    ]);
  });

  test("hides the rule emoji from screen readers", () => {
    const { getAllByRole } = render(
      <RulesModal showRulesModal={true} closeRulesModal={() => {}} />,
    );

    for (const li of getAllByRole("listitem")) {
      expect(li.querySelector(".icon")).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("states the winning score", () => {
    const { getByText } = render(
      <RulesModal showRulesModal={true} closeRulesModal={() => {}} />,
    );

    expect(getByText("The winner of a game is the first to win 5 rounds.")).toBeInTheDocument();
  });

  test("hides image on load error", () => {
    const { getByAltText } = render(
      <RulesModal showRulesModal={true} closeRulesModal={() => {}} />
    );

    const image = getByAltText("Diagram of the Rock Paper Scissors Lizard Spock rules") as HTMLImageElement;
    fireEvent.error(image);

    expect(image.style.display).toBe("none");
  });

  test("renders image src using BASE_URL", () => {
    const { getByAltText } = render(
      <RulesModal showRulesModal={true} closeRulesModal={() => {}} />
    );

    const image = getByAltText("Diagram of the Rock Paper Scissors Lizard Spock rules");
    expect(image).toHaveAttribute(
      "src",
      `${import.meta.env.BASE_URL}images/rules.png`
    );
  });
});
