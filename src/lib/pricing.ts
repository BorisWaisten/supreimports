import type { PriceTier, Product } from "@/types/catalog";

/** Calcula el precio unitario correspondiente a la cantidad y dólar dados. */
export function getPriceTier(product: Product, qty: number, dolar: number): PriceTier {
  const sorted = [...product.scales].sort((a, b) => b.min - a.min);
  const scale = sorted.find((s) => qty >= s.min) ?? null;

  if (scale) {
    return {
      unitUSD: scale.price,
      unitARS: Math.round(scale.price * dolar),
      isWholesale: true,
      scale,
    };
  }

  return {
    unitUSD: null,
    unitARS: product.retailARS,
    isWholesale: false,
    scale: null,
  };
}

/** Formato moneda ARS sin decimales, estilo argentino. */
export function formatARS(value: number): string {
  return "$ " + Math.round(value).toLocaleString("es-AR");
}

/** Formato dólar simple. */
export function formatUSD(value: number): string {
  return "U$D " + value.toFixed(2).replace(".", ",");
}
