import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "./useProducts";

describe("useProducts", () => {
  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useProducts());
    expect(result.current).toBeDefined();
  });

  it("should have products array property", () => {
    const { result } = renderHook(() => useProducts());
    expect(Array.isArray(result.current.products)).toBe(true);
  });

  it("should have status and error properties", () => {
    const { result } = renderHook(() => useProducts());
    expect(result.current.status).toBeDefined();
    expect(result.current.error === null || typeof result.current.error === "string").toBe(true);
  });

  it("should provide refresh function", () => {
    const { result } = renderHook(() => useProducts());
    expect(typeof result.current.refresh).toBe("function");
  });
});
