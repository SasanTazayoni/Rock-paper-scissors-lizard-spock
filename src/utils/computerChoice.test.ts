import { describe, test, expect, vi } from "vitest";
import { getComputerChoice } from "./computerChoice";
import { CHOICES, SELECTIONS } from "./choices";

describe("getComputerChoice", () => {
  test("returns a valid choice", () => {
    expect(Object.values(CHOICES)).toContain(getComputerChoice());
  });

  test.each(SELECTIONS.map((s, i) => [s, i] as const))(
    "can return %s",
    (selection, index) => {
      // Middle of each choice's slice of [0, 1).
      vi.spyOn(Math, "random").mockReturnValue((index + 0.5) / SELECTIONS.length);
      expect(getComputerChoice()).toBe(CHOICES[selection]);
    },
  );
});
