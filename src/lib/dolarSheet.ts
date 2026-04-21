import { SHEET_ID, parseSpreadsheetCSV } from "@/lib/sheets";
export const DEFAULT_COTIZACION = 1420;
const CACHE_KEY = "supre_cotizacion_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
type CacheEntry = { ts: number; value: number };
function parseMoneyCell(raw: string | undefined): number {
  if (!raw) return NaN;
  const n = Number(String(raw).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}
function isValidCotizacion(n: number): boolean {
  return Number.isFinite(n) && n >= 1 && n <= 100_000;
}
/** Evita tomar por error la hoja de catálogo como configuración. */
function looksLikeCatalogHeaders(headers: string[]): boolean {
    return (
      headers.includes("preciobase") ||
      headers.some((h) => h.includes("nombre del artículo")) ||
      headers.some((h) => /^preciocant\d/.test(h))
    );
  }
  function normKey(s: string): string {
    return s
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  const KEY_RE =
  /^(usd|dolar|cotizacion|valor_usd|dolar_blue|tipo_de_cambio|tc)$/;


  function rowsToCotizacion(rows: string[][]): number | null {
    if (rows.length < 1) return null;
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    if (looksLikeCatalogHeaders(headers)) return null;
    const valCol = headers.findIndex((h) =>
      ["valor", "value", "precio", "importe", "ars"].includes(h),
    );
    const keyCol = headers.findIndex((h) =>
      [
        "clave",
        "key",
        "config",
        "configuracion",
        "configuración",
        "nombre",
        "item",
        "parametro",
        "parámetro",
      ].includes(h),
    );
    if (keyCol >= 0 && valCol >= 0) {
      for (let r = 1; r < rows.length; r++) {
        const k = normKey(rows[r][keyCol] ?? "");
        if (KEY_RE.test(k)) {
          const n = parseMoneyCell(rows[r][valCol]);
          if (isValidCotizacion(n)) return Math.round(n);
        }
      }
    }
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (row.length < 2) continue;
      const k = normKey(row[0] ?? "");
      if (KEY_RE.test(k)) {
        const n = parseMoneyCell(row[1]);
        if (isValidCotizacion(n)) return Math.round(n);
      }
    }
    return null;
  }

  async function fetchCSV(url: string): Promise<string> {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Cotización fetch failed: ${res.status}`);
    return res.text();
  }
  function readCache(): number | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed: CacheEntry = JSON.parse(raw);
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      if (!isValidCotizacion(parsed.value)) return null;
      return parsed.value;
    } catch {
      return null;
    }
  }
  function readStaleCache(): number | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed: CacheEntry = JSON.parse(raw);
      if (!isValidCotizacion(parsed.value)) return null;
      return parsed.value;
    } catch {
      return null;
    }
  }

  function writeCache(value: number) {
    try {
      const entry: CacheEntry = { ts: Date.now(), value };
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
      /* noop */
    }
  }

  export async function fetchCotizacionUSD(
    forceRefresh = false,
  ): Promise<number> {
    const gid = (import.meta.env.VITE_COTIZACION_SHEET_GID ?? "").trim();
    if (!gid) return DEFAULT_COTIZACION;
    if (!forceRefresh) {
      const cached = readCache();
      if (cached != null) return cached;
    }
    const sheetId =
      (import.meta.env.VITE_COTIZACION_SHEET_ID ?? "").trim() || SHEET_ID;
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    try {
      const csv = await fetchCSV(url);
      const rows = parseSpreadsheetCSV(csv);
      const n = rowsToCotizacion(rows);
      if (n != null) {
        writeCache(n);
        return n;
      }
    } catch (e) {
      console.warn("[fetchCotizacionUSD]", e);
    }
    const stale = readStaleCache();
    if (stale != null) return stale;
    return DEFAULT_COTIZACION;
  }


export function clearCotizacionCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      /* noop */
    }
  }