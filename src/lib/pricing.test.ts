import { describe, it, expect } from "vitest";
import { getPriceTier, formatARS, formatUSD } from "./pricing";
import type { Product } from "@/types/catalog";

describe("pricing", () => {
  const mockProduct: Product = {
    id: "test-product",
    category: "TEST",
    name: "Test Product",
    image: "test.jpg",
    url: "test",
    retailARS: 10000,
    featured: false,
    scales: [
      { min: 1, price: 100 },
      { min: 5, price: 90 },
      { min: 10, price: 80 },
      { min: 20, price: 70 },
    ],
    stockInfo: "In stock",
  };

  describe("getPriceTier", () => {
    it("should return retail price for qty below minimum scale", () => {
      const result = getPriceTier(mockProduct, 1, 1000);
      expect(result.unitARS).toBe(100000); // 100 * 1000
      expect(result.unitUSD).toBe(100);
      expect(result.isWholesale).toBe(true);
      expect(result.scale?.min).toBe(1);
    });

    it("should return first tier price at minimum quantity", () => {
      const result = getPriceTier(mockProduct, 5, 1000);
      expect(result.unitUSD).toBe(90);
      expect(result.unitARS).toBe(90000);
      expect(result.isWholesale).toBe(true);
      expect(result.scale?.min).toBe(5);
    });

    it("should return best price tier for higher quantities", () => {
      const result = getPriceTier(mockProduct, 20, 1000);
      expect(result.unitUSD).toBe(70);
      expect(result.unitARS).toBe(70000);
      expect(result.isWholesale).toBe(true);
      expect(result.scale?.min).toBe(20);
    });

    it("should calculate ARS correctly based on dolar rate", () => {
      const result = getPriceTier(mockProduct, 10, 850);
      expect(result.unitUSD).toBe(80);
      expect(result.unitARS).toBe(68000); // 80 * 850
      expect(result.isWholesale).toBe(true);
    });

    it("should handle very high quantities", () => {
      const result = getPriceTier(mockProduct, 1000, 1000);
      expect(result.unitUSD).toBe(70);
      expect(result.isWholesale).toBe(true);
    });
  });

  describe("formatARS", () => {
    it("should format currency with $ and thousand separators", () => {
      const result = formatARS(1000000);
      expect(result).toContain("$");
      expect(result).toContain("1");
    });

    it("should round values", () => {
      const result = formatARS(1234.56);
      expect(result).toContain("1.235");
    });

    it("should handle zero", () => {
      const result = formatARS(0);
      expect(result).toContain("$");
    });
  });

  describe("formatUSD", () => {
    it("should format currency with U$D", () => {
      const result = formatUSD(99.99);
      expect(result).toContain("U$D");
      expect(result).toContain("99");
    });

    it("should use comma as decimal separator", () => {
      const result = formatUSD(123.45);
      expect(result).toContain(",");
    });
  });
});
