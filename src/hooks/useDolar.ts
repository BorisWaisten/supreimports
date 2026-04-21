import { useEffect, useState, useCallback } from "react";

import {
  DEFAULT_COTIZACION,
  clearCotizacionCache,
  fetchCotizacionUSD,
} from "@/lib/dolarSheet";

export function useDolar() {
  const [dolar, setDolar] = useState<number>(DEFAULT_COTIZACION);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const force = reloadToken > 0;
    fetchCotizacionUSD(force).then((v) => {
      if (!cancelled) setDolar(v);
    });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);
  const refetchCotizacion = useCallback(() => {
    clearCotizacionCache();
    setReloadToken((t) => t + 1);
  }, []);
  return { dolar, refetchCotizacion };
}
