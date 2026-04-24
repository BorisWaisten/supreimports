import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReveal } from "./useReveal";

describe("useReveal", () => {
  it("should initialize with inView as false", () => {
    const { result } = renderHook(() => useReveal<HTMLDivElement>(0.1));
    expect(result.current.inView).toBe(false);
  });

  it("should have a ref object", () => {
    const { result } = renderHook(() => useReveal<HTMLDivElement>(0.1));
    expect(result.current.ref).toBeDefined();
  });

  it("should accept threshold parameter", () => {
    const { result } = renderHook(() => useReveal<HTMLDivElement>(0.5));
    expect(result.current.inView).toBe(false);
  });
});
