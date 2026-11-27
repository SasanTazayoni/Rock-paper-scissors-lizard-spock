import { CHOICES, SELECTIONS, type Choice } from "./choices";

export const getComputerChoice = (): Choice => {
  const randomIndex = Math.floor(Math.random() * SELECTIONS.length);
  const selection = SELECTIONS[randomIndex];
  if (!selection) throw new Error(`No choice at index ${randomIndex}`);
  return CHOICES[selection];
};
