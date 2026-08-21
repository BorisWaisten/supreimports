import { describe, it, expect, beforeEach } from "vitest";
import { logOrderToSheet } from "./orderSheet";

describe("orderSheet", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("appends a script tag pointing to the Apps Script URL with encoded params", () => {
    logOrderToSheet({
      nombre: "Juan Pérez",
      telefono: "11 2345 6789",
      envio: "Envío a domicilio",
      provincia: "CABA - Palermo",
      tipoNegocio: "Kiosco",
      productos: "Producto x1 (ARS 1000)",
      totalARS: 1000,
      totalUSD: 1,
      cotizacion: 1000,
    });

    const script = document.head.querySelector("script");
    expect(script).not.toBeNull();
    const src = script!.getAttribute("src") ?? "";
    expect(src).toContain("script.google.com/macros");
    expect(src).toContain("nombre=Juan%20P%C3%A9rez");
    expect(src).toContain("tipoNegocio=Kiosco");
    expect(src).toContain("provincia=CABA%20-%20Palermo");
    expect(src).toContain("callback=sheetCallback");
  });

  it("defines a global sheetCallback that removes the script when invoked", () => {
    logOrderToSheet({
      nombre: "Ana",
      telefono: "111",
      envio: "Retiro en el local",
      provincia: "CABA",
      tipoNegocio: "Bazar",
      productos: "Item x1 (ARS 500)",
      totalARS: 500,
      totalUSD: 0.5,
      cotizacion: 1000,
    });

    expect(document.head.querySelector("script")).not.toBeNull();
    expect(typeof (window as unknown as { sheetCallback?: () => void }).sheetCallback).toBe(
      "function"
    );

    (window as unknown as { sheetCallback: () => void }).sheetCallback();
    expect(document.head.querySelector("script")).toBeNull();
  });
});
