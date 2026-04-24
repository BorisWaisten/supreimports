import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDolar } from "./useDolar";

describe("useDolar", () => {
  it("should initialize dolar value", () => {
    const { result } = renderHook(() => useDolar());
    expect(result.current).toBeDefined();
    expect(result.current.dolar).toBeDefined();
    expect(typeof result.current.dolar).toBe("number");
    expect(result.current.dolar).toBeGreaterThan(0);
  });

  it("should provide refetch function", () => {
    const { result } = renderHook(() => useDolar());
    expect(typeof result.current.refetchCotizacion).toBe("function");
  });
});
