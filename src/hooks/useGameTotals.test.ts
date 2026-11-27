import { act, renderHook } from "@testing-library/react";
import { test, expect, describe, vi } from "vitest";
import { useGameTotals } from "./useGameTotals";
import { STORAGE_KEY } from "../utils/scoreStorage";

const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

describe("useGameTotals hook", () => {
  test("loads stored totals from localStorage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 3, computer: 7 }),
    );
    const { result } = renderHook(() => useGameTotals());
    expect(result.current.totalWins).toBe(3);
    expect(result.current.totalLosses).toBe(7);
  });

  test("defaults to 0 if no localStorage data", () => {
    const { result } = renderHook(() => useGameTotals());
    expect(result.current.totalWins).toBe(0);
    expect(result.current.totalLosses).toBe(0);
  });

  test("recordGame increments wins or losses and saves them", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 2, computer: 1 }),
    );
    const { result } = renderHook(() => useGameTotals());

    act(() => result.current.recordGame("WIN"));
    expect(result.current.totalWins).toBe(3);
    expect(saved()).toEqual({ player: 3, computer: 1 });

    act(() => result.current.recordGame("LOSE"));
    expect(result.current.totalLosses).toBe(2);
    expect(saved()).toEqual({ player: 3, computer: 2 });
  });

  test("resetTotals zeroes totals and clears storage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 4, computer: 5 }),
    );
    const { result } = renderHook(() => useGameTotals());

    act(() => result.current.resetTotals());

    expect(result.current.totalWins).toBe(0);
    expect(result.current.totalLosses).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test("keeps counting in memory when storage is blocked", () => {
    const blocked = () => {
      throw new DOMException("Storage is disabled", "SecurityError");
    };
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);

    const { result } = renderHook(() => useGameTotals());
    expect(result.current.totalWins).toBe(0);

    act(() => result.current.recordGame("WIN"));
    act(() => result.current.recordGame("WIN"));
    expect(result.current.totalWins).toBe(2);

    act(() => result.current.resetTotals());
    expect(result.current.totalWins).toBe(0);
  });
});
