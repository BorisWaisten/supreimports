// Guarda cada pedido en el Google Sheet del cliente vía JSONP (el Apps Script
// no responde headers CORS, por eso se usa un <script> en vez de fetch).
const DEFAULT_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzqGof7fCQpqRzVj6gvahbicGfq4aYzxCxq6bHNE1aTUrJRT9oPpOYLnmO882EoT--LGQ/exec";

const SHEETS_URL =
  (import.meta.env.VITE_ORDERS_SHEET_URL as string | undefined)?.trim() ||
  DEFAULT_SHEETS_URL;

export type OrderLogPayload = {
  nombre: string;
  telefono: string;
  envio: string;
  provincia: string;
  tipoNegocio: string;
  productos: string;
  totalARS: number;
  totalUSD: number;
  cotizacion: number;
};

type WindowWithCallback = Window & { sheetCallback?: () => void };

/**
 * Best-effort: si falla o el endpoint no está configurado, no debe frenar
 * el envío del pedido por WhatsApp.
 */
export function logOrderToSheet(order: OrderLogPayload): void {
  if (!SHEETS_URL || typeof document === "undefined") return;

  const params =
    "?nombre=" + encodeURIComponent(order.nombre) +
    "&telefono=" + encodeURIComponent(order.telefono) +
    "&envio=" + encodeURIComponent(order.envio) +
    "&provincia=" + encodeURIComponent(order.provincia) +
    "&tipoNegocio=" + encodeURIComponent(order.tipoNegocio) +
    "&productos=" + encodeURIComponent(order.productos) +
    "&totalARS=" + encodeURIComponent(order.totalARS) +
    "&totalUSD=" + encodeURIComponent(order.totalUSD) +
    "&cotizacion=" + encodeURIComponent(order.cotizacion) +
    "&callback=sheetCallback";

  const script = document.createElement("script");
  script.src = SHEETS_URL + params;

  const cleanup = () => script.remove();
  (window as WindowWithCallback).sheetCallback = cleanup;
  script.onerror = cleanup;

  document.head.appendChild(script);
}
