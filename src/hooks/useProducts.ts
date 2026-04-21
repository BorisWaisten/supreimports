import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/catalog";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";
import { clearProductsCache, fetchProductsFromSheet } from "@/lib/sheets";

type Status = "idle" | "loading" | "success" | "error";


export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const load = useCallback(async (force = false) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchProductsFromSheet(force);
      if (data.length === 0) {
        setProducts(FALLBACK_PRODUCTS);
        setUsedFallback(true);
        setError("El sheet está vacío. Mostrando datos de respaldo.");
      } else {
        setProducts(data);
        setUsedFallback(false);
      }
      setStatus("success");
    } catch (e) {
      console.error("[useProducts] Error cargando sheet:", e);
      setProducts(FALLBACK_PRODUCTS);
      setUsedFallback(true);
      setError(
        "No se pudo conectar con Google Sheets. Mostrando datos de respaldo."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const refresh = useCallback(() => {
    clearProductsCache();
    return load(true);
  }, [load]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return { products, categories, status, error, usedFallback, refresh };
}
