import { describe, expect, test } from "vitest";
import { CHOICES, SELECTIONS, losesTo } from "./choices";

describe("CHOICES table", () => {
  test("has exactly one entry per selection, keyed by its name", () => {
    expect(Object.keys(CHOICES).sort()).toEqual([...SELECTIONS].sort());
    for (const selection of SELECTIONS) {
      expect(CHOICES[selection].name).toBe(selection);
    }
  });

  test.each(SELECTIONS)("%s beats two different choices, not itself", (s) => {
    const [first, second] = CHOICES[s].beats;
    expect(first).not.toBe(second);
    expect(CHOICES[s].beats).not.toContain(s);
  });

  test.each(SELECTIONS)("%s loses to exactly the two it doesn't beat", (s) => {
    const others = SELECTIONS.filter((o) => o !== s);
    const beaten = CHOICES[s].beats;
    expect(losesTo(s)).toHaveLength(2);
    expect([...beaten, ...losesTo(s)].sort()).toEqual([...others].sort());
  });

  test("every symbol is unique", () => {
    const symbols = SELECTIONS.map((s) => CHOICES[s].symbol);
    expect(new Set(symbols).size).toBe(SELECTIONS.length);
  });
});
