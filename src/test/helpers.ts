import { fireEvent } from "@testing-library/react";
import { WINNING_SCORE } from "../utils/gameLogic";

/** Accessible names of the menu buttons, which are their visible text. */
export const MENU = {
  reset: "Reset",
  rules: "See rules",
  scores: "Wins & losses",
} as const;

/** Clicks `button` `times` times. The default is enough wins to end a game. */
export const clickTimes = (button: HTMLElement, times = WINNING_SCORE) => {
  for (let i = 0; i < times; i++) fireEvent.click(button);
};
