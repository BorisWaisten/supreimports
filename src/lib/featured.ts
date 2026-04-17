import type { Product } from "@/types/catalog";

/**
 * Prioriza productos marcados como destacados (sheet: columna `featured` / `destacado`)
 * y completa con el resto en el orden original.
 */
export function getFeaturedProducts(products: Product[], limit: number): Product[] {
  if (limit <= 0 || products.length === 0) return [];

  const flagged: Product[] = [];
  const rest: Product[] = [];
  for (const p of products) {
    if (p.featured) flagged.push(p);
    else rest.push(p);
  }

  const merged = [...flagged, ...rest];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of merged) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}
