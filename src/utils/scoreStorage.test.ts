import { describe, test, expect, vi } from "vitest";
import { clearTotals, loadTotals, saveTotals } from "./scoreStorage";

const store = (value: unknown) =>
  localStorage.setItem("gameScores", JSON.stringify(value));

describe("loadTotals", () => {
  test("reads saved wins and losses", () => {
    store({ player: 3, computer: 7 });
    expect(loadTotals()).toEqual({ wins: 3, losses: 7 });
  });

  test("returns zeros when nothing is saved", () => {
    expect(loadTotals()).toEqual({ wins: 0, losses: 0 });
  });

  test("treats a missing field as 0", () => {
    store({ player: 2 });
    expect(loadTotals()).toEqual({ wins: 2, losses: 0 });
  });

  test.each([
    ["a numeric string", "2"],
    ["an object", { n: 1 }],
    ["a negative number", -1],
    ["a fraction", 1.5],
    ["NaN (saved as null)", NaN],
  ])("treats %s as 0", (_label, bad) => {
    store({ player: bad, computer: 4 });
    expect(loadTotals()).toEqual({ wins: 0, losses: 4 });
  });

  test.each([
    ["invalid JSON", "not-valid-json"],
    ["a JSON number", "42"],
    ["JSON null", "null"],
  ])("clears %s and returns zeros", (_label, raw) => {
    localStorage.setItem("gameScores", raw);
    expect(loadTotals()).toEqual({ wins: 0, losses: 0 });
    expect(localStorage.getItem("gameScores")).toBeNull();
  });
});

describe("saveTotals and clearTotals", () => {
  test("saves in the { player, computer } format older versions used", () => {
    saveTotals({ wins: 5, losses: 2 });
    expect(JSON.parse(localStorage.getItem("gameScores")!)).toEqual({
      player: 5,
      computer: 2,
    });
  });

  test("round-trips through loadTotals", () => {
    saveTotals({ wins: 1, losses: 9 });
    expect(loadTotals()).toEqual({ wins: 1, losses: 9 });
  });

  test("clearTotals removes the saved totals", () => {
    saveTotals({ wins: 1, losses: 1 });
    clearTotals();
    expect(localStorage.getItem("gameScores")).toBeNull();
  });
});

describe("when storage is blocked", () => {
  const blocked = () => {
    throw new DOMException("Storage is disabled", "SecurityError");
  };

  test("loadTotals returns zeros instead of throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    expect(loadTotals()).toEqual({ wins: 0, losses: 0 });
  });

  test("saveTotals does not throw", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    expect(() => saveTotals({ wins: 1, losses: 0 })).not.toThrow();
  });

  test("clearTotals does not throw", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);
    expect(() => clearTotals()).not.toThrow();
  });

  test("corrupt data is still handled if removeItem throws", () => {
    localStorage.setItem("gameScores", "not-valid-json");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);
    expect(loadTotals()).toEqual({ wins: 0, losses: 0 });
  });
});
