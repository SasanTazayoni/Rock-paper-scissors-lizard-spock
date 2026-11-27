// The single source of truth for the five choices. The selection buttons, the
// rules list and the round logic are all built from this table.

/** Display order of the choices. */
export const SELECTIONS = [
  "rock",
  "paper",
  "scissors",
  "lizard",
  "spock",
] as const;

export type Selection = (typeof SELECTIONS)[number];

export type Choice = {
  name: Selection;
  label: string;
  symbol: string;
  /** Spoken description of the hand-gesture emoji. */
  iconDescription: string;
  /** The two choices this one defeats. */
  beats: readonly [Selection, Selection];
};

export const CHOICES: Record<Selection, Choice> = {
  rock: {
    name: "rock",
    label: "Rock",
    symbol: "✊",
    iconDescription: "A fist raised in a rock gesture",
    beats: ["scissors", "lizard"],
  },
  paper: {
    name: "paper",
    label: "Paper",
    symbol: "🖐",
    iconDescription: "An open hand with fingers spread",
    beats: ["rock", "spock"],
  },
  scissors: {
    name: "scissors",
    label: "Scissors",
    symbol: "✌️",
    iconDescription: "A hand showing the scissors gesture",
    beats: ["paper", "lizard"],
  },
  lizard: {
    name: "lizard",
    label: "Lizard",
    symbol: "🤏",
    iconDescription: "A hand showing the lizard gesture",
    beats: ["spock", "paper"],
  },
  spock: {
    name: "spock",
    label: "Spock",
    symbol: "🖖",
    iconDescription: "A hand showing the Spock gesture",
    beats: ["rock", "scissors"],
  },
};

/** The choices that defeat `selection`, in display order. */
export const losesTo = (selection: Selection): Selection[] =>
  SELECTIONS.filter((other) => CHOICES[other].beats.includes(selection));
