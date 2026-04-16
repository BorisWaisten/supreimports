import { useCallback, useEffect, useState } from "react";
import type { CartItem, Product } from "@/types/catalog";
import { getPriceTier } from "@/lib/pricing";

const STORAGE_KEY = "supre-cart-v1";

type CartMap = Record<string, CartItem>;

function readStorage(): CartMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartMap) : {};
  } catch {
    return {};
  }
}

export function useCart() {
  const [items, setItems] = useState<CartMap>({});

  // hydrate
  useEffect(() => {
    setItems(readStorage());
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items]);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = { productId, qty, note: prev[productId]?.note ?? "" };
      }
      return next;
    });
  }, []);

  const inc = useCallback((productId: string, by = 1) => {
    setItems((prev) => {
      const current = prev[productId]?.qty ?? 0;
      const nextQty = Math.max(0, current + by);
      const next = { ...prev };
      if (nextQty <= 0) delete next[productId];
      else next[productId] = { productId, qty: nextQty, note: prev[productId]?.note ?? "" };
      return next;
    });
  }, []);

  const setNote = useCallback((productId: string, note: string) => {
    setItems((prev) => {
      if (!prev[productId]) return prev;
      return { ...prev, [productId]: { ...prev[productId], note } };
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const getQty = useCallback((id: string) => items[id]?.qty ?? 0, [items]);
  const getNote = useCallback((id: string) => items[id]?.note ?? "", [items]);

  const computeTotals = useCallback(
    (products: Product[], dolar: number) => {
      let totalARS = 0;
      let totalUnits = 0;
      const lines = Object.values(items)
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          const tier = getPriceTier(product, item.qty, dolar);
          const subtotal = tier.unitARS * item.qty;
          totalARS += subtotal;
          totalUnits += item.qty;
          return { item, product, tier, subtotal };
        })
        .filter(Boolean) as Array<{
        item: CartItem;
        product: Product;
        tier: ReturnType<typeof getPriceTier>;
        subtotal: number;
      }>;
      return { lines, totalARS, totalUnits };
    },
    [items]
  );

  return { items, setQty, inc, setNote, clear, getQty, getNote, computeTotals };
}
