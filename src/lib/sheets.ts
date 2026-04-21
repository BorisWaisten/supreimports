import type { Product, Scale } from "@/types/catalog";

export const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const CACHE_KEY = "supre_products_cache_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min
const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x800/f5f5f5/999?text=SUPRE";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
const GVIZ_URL_FALLBACK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
type CacheEntry = { ts: number; data: Product[] };
export function parseSpreadsheetCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n") {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === "\r") {
        // skip
      } else {
        field += c;
      }
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** "3:15,5:14,10:13.5" → Scale[] */
function headerIndex(headers: string[], keys: string[]): number {
  for (const key of keys) {
    const i = headers.indexOf(key.toLowerCase());
    if (i >= 0) return i;
  }
  return -1;
}

function parseFeatured(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return ["1", "true", "yes", "y", "sí", "si", "x", "✓", "destacado", "highlight"].includes(v);
}

function parseScales(raw: string): Scale[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [min, price] = pair.split(":").map((s) => Number(s.trim()));
      return { min, price };
    })
    .filter((s) => Number.isFinite(s.min) && Number.isFinite(s.price));
}

function rowsToProducts(rows: string[][]): Product[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());

  const findIndex = (name: string) =>
    headers.findIndex((h) => h.includes(name.toLowerCase()));

  const iId = findIndex("id");
  const iName = findIndex("nombre");
  const iCat = findIndex("tipo");
  const iBase = findIndex("preciobase");
  const iStock = findIndex("stock");
  const iEstado = findIndex("estado");
  const iFeatured = findIndex("featured");

  // Detectar dinámicamente columnas PrecioCant
  const scaleColumns = headers
    .map((h, i) => ({ h, i }))
    .filter((col) => col.h.includes("preciocant"));

  return rows.slice(1).map((r): Product | null => {
    const id = (r[iId] ?? "").trim();
    const name = (r[iName] ?? "").trim();

    if (!id || !name) return null;

    // 🔥 Construcción automática de escalas
    const scales: Scale[] = scaleColumns
      .map(({ h, i }) => {
        const match = h.match(/\d+/); // extrae el número (3,5,10...)
        const min = match ? Number(match[0]) : 0;
        const price = Number((r[i] ?? "").replace(/[^\d.-]/g, ""));

        if (!min || !price) return null;
        return { min, price };
      })
      .filter((s): s is Scale => s !== null);

    return {
      id,
      name,
      category: (r[iCat] ?? "").trim() || "OTROS",
      image: PLACEHOLDER_IMAGE,

      // ⚠️ este es el precio base (lo estás usando como retail)
      retailARS:
        Number((r[iBase] ?? "0").replace(/[^\d.-]/g, "")) || 0,

      scales,
      stockInfo: `${r[iStock] ?? ""} - ${r[iEstado] ?? ""}`,

      ...(iFeatured >= 0 && parseFeatured(r[iFeatured])
        ? { featured: true }
        : {}),
    };
  }).filter((p): p is Product => p !== null);
}

function readCache(): Product[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CacheEntry = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: Product[]) {
  try {
    const entry: CacheEntry = { ts: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}

export function clearProductsCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

async function fetchCSV(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  return res.text();
}

/**
 * Lee productos del Google Sheet público vía GViz.
 * Usa cache local (10 min). Si forceRefresh=true ignora el cache.
 */
export async function fetchProductsFromSheet(
  forceRefresh = false
): Promise<Product[]> {
  if (!forceRefresh) {
    const cached = readCache();
    if (cached && cached.length > 0) return cached;
  }

  let csv: string;
  try {
    csv = await fetchCSV(GVIZ_URL);
  } catch {
    csv = await fetchCSV(GVIZ_URL_FALLBACK);
  }

  const rows = parseSpreadsheetCSV(csv);
  const products = rowsToProducts(rows);
  if (products.length > 0) writeCache(products);
  return products;
}
