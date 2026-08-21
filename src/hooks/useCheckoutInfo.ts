import { useCallback, useEffect, useState } from "react";
import type { CheckoutInfo } from "@/types/catalog";

const STORAGE_KEY = "supre-checkout-info-v1";

const EMPTY: CheckoutInfo = {
  nombre: "",
  telefono: "",
  envio: "",
  provincia: "",
  tipoNegocio: "",
};

function readStorage(): CheckoutInfo {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<CheckoutInfo>) };
  } catch {
    return EMPTY;
  }
}

/** Recuerda los datos del cliente (nombre, teléfono, etc.) entre pedidos. */
export function useCheckoutInfo() {
  const [info, setInfo] = useState<CheckoutInfo>(EMPTY);

  useEffect(() => {
    setInfo(readStorage());
  }, []);

  const update = useCallback((patch: Partial<CheckoutInfo>) => {
    setInfo((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  return { info, update };
}
