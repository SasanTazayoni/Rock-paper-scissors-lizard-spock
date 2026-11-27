import { rules } from "./rules";

export const getComputerChoice = () => {
  const randomIndex = Math.floor(Math.random() * rules.length);
  const choice = rules[randomIndex];
  if (!choice) throw new Error(`No rule at index ${randomIndex}`);
  return choice;
};
