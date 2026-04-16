import { useEffect, useState } from "react";

const KEY = "supre-dolar-v1";
const DEFAULT = 1420;

export function useDolar() {
  const [dolar, setDolar] = useState<number>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = parseFloat(raw);
        if (!Number.isNaN(v) && v > 0) setDolar(v);
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, String(dolar));
    } catch {
      /* noop */
    }
  }, [dolar]);

  return [dolar, setDolar] as const;
}
