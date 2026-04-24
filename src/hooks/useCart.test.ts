import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart";
import type { Product } from "@/types/catalog";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useCart", () => {
  const mockProducts: Product[] = [
    {
      id: "product-1",
      category: "TEST",
      name: "Product 1",
      image: "test.jpg",
      url: "test",
      retailARS: 1000,
      featured: false,
      scales: [
        { min: 1, price: 100 },
        { min: 5, price: 90 },
      ],
      stockInfo: "In stock",
    },
    {
      id: "product-2",
      category: "TEST",
      name: "Product 2",
      image: "test.jpg",
      url: "test",
      retailARS: 2000,
      featured: false,
      scales: [
        { min: 1, price: 200 },
        { min: 3, price: 180 },
      ],
      stockInfo: "In stock",
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart());
    expect(Object.keys(result.current.items)).toHaveLength(0);
  });

  it("should add product to cart with setQty", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 2);
    });

    expect(result.current.getQty("product-1")).toBe(2);
    expect(Object.keys(result.current.items)).toHaveLength(1);
  });

  it("should increment quantity", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 2);
      result.current.inc("product-1", 3);
    });

    expect(result.current.getQty("product-1")).toBe(5);
  });

  it("should decrement quantity", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 5);
      result.current.inc("product-1", -2);
    });

    expect(result.current.getQty("product-1")).toBe(3);
  });

  it("should remove item when quantity reaches 0", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 3);
      result.current.inc("product-1", -3);
    });

    expect(result.current.getQty("product-1")).toBe(0);
    expect(result.current.items["product-1"]).toBeUndefined();
  });

  it("should set and get notes on items", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 2);
      result.current.setNote("product-1", "Custom note");
    });

    expect(result.current.getNote("product-1")).toBe("Custom note");
  });

  it("should clear entire cart", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 2);
      result.current.setQty("product-2", 3);
      result.current.clear();
    });

    expect(Object.keys(result.current.items)).toHaveLength(0);
  });

  it("should compute totals correctly", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 2);
      result.current.setQty("product-2", 1);
    });

    const { lines, totalARS, totalUnits } = result.current.computeTotals(
      mockProducts,
      1000
    );

    expect(lines).toHaveLength(2);
    expect(totalUnits).toBe(3);
    expect(totalARS).toBeGreaterThan(0);
  });

  it("should persist cart to localStorage", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.setQty("product-1", 5);
    });

    const stored = localStorage.getItem("supre-cart-v1");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toHaveProperty("product-1");
  });

  it("should handle malformed localStorage gracefully", () => {
    localStorage.setItem("supre-cart-v1", "invalid json");
    const { result } = renderHook(() => useCart());
    expect(Object.keys(result.current.items)).toHaveLength(0);
  });
});
