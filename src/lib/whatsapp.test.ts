import { describe, it, expect } from "vitest";
import { buildWhatsAppMessage } from "./whatsapp";
import type { CartItem, CheckoutInfo, Product } from "@/types/catalog";

describe("whatsapp", () => {
  const mockProduct: Product = {
    id: "test-product",
    category: "VAPEO",
    name: "Test Vape Product",
    image: "test.jpg",
    url: "test",
    retailARS: 10000,
    featured: false,
    scales: [{ min: 1, price: 100 }],
    stockInfo: "In stock",
    description: "Test description",
  };

  const mockCheckout: CheckoutInfo = {
    nombre: "Juan Pérez",
    telefono: "1122334455",
    envio: "Envío a domicilio",
    provincia: "CABA - Palermo",
    tipoNegocio: "Kiosco",
  };

  describe("buildWhatsAppMessage", () => {
    it("should generate a valid message with product details", () => {
      const items: CartItem[] = [
        { productId: "test-product", qty: 2, note: "" }
      ];
      const message = buildWhatsAppMessage(items, [mockProduct], 1000, 200000, mockCheckout);
      expect(message).toContain(mockProduct.name);
      expect(message).toContain("× 2");
    });

    it("should include multiple products in message", () => {
      const product2 = { ...mockProduct, id: "product-2", name: "Product 2" };
      const items: CartItem[] = [
        { productId: "test-product", qty: 1, note: "" },
        { productId: "product-2", qty: 2, note: "" }
      ];
      const message = buildWhatsAppMessage(items, [mockProduct, product2], 1000, 300000, mockCheckout);
      expect(message).toContain(mockProduct.name);
      expect(message).toContain(product2.name);
    });

    it("should format message properly", () => {
      const items: CartItem[] = [
        { productId: "test-product", qty: 1, note: "" }
      ];
      const message = buildWhatsAppMessage(items, [mockProduct], 1000, 100000, mockCheckout);
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
      expect(message).toContain("PEDIDO");
      expect(message).toContain("TOTAL ESTIMADO");
    });

    it("should include custom notes in message", () => {
      const items: CartItem[] = [
        { productId: "test-product", qty: 2, note: "Color azul por favor" }
      ];
      const message = buildWhatsAppMessage(items, [mockProduct], 1000, 200000, mockCheckout);
      expect(message).toContain("Color azul por favor");
    });

    it("should handle empty items list", () => {
      const message = buildWhatsAppMessage([], [], 1000, 0, mockCheckout);
      expect(typeof message).toBe("string");
      expect(message).toContain("PEDIDO");
    });

    it("should include customer and business info in message", () => {
      const items: CartItem[] = [
        { productId: "test-product", qty: 1, note: "" }
      ];
      const message = buildWhatsAppMessage(items, [mockProduct], 1000, 100000, mockCheckout);
      expect(message).toContain(mockCheckout.nombre);
      expect(message).toContain(mockCheckout.telefono);
      expect(message).toContain(mockCheckout.envio);
      expect(message).toContain(mockCheckout.provincia);
      expect(message).toContain(mockCheckout.tipoNegocio);
    });
  });
});
