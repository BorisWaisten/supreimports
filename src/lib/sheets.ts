import type { Product, Scale } from "@/types/catalog";

const SHEET_ID = "1EOVPqSQ5Y3rcKUu5hB2dfdJB7zf3Nx6dldXr7a_A8fA";
const CACHE_KEY = "supre_products_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Productos`;
// Fallback al primer sheet si "Productos" no existe
const GVIZ_URL_FALLBACK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

type CacheEntry = { ts: number; data: Product[] };

/** Parser mínimo de CSV con soporte para campos entre comillas. */
function parseCSV(text: string): string[][] {
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
  const idx = (key: string) => headers.indexOf(key.toLowerCase());

  const iId = idx("id");
  const iCat = idx("category");
  const iName = idx("name");
  const iImage = idx("image");
  const iRetail = idx("retailars");
  const iScales = idx("scales");
  const iStock = idx("stockinfo");
  const iDesc = idx("description");

  return rows
    .slice(1)
    .map((r): Product | null => {
      const id = (r[iId] ?? "").trim();
      const name = (r[iName] ?? "").trim();
      if (!id || !name) return null;
      return {
        id,
        category: (r[iCat] ?? "").trim() || "OTROS",
        name,
        image: (r[iImage] ?? "").trim(),
        retailARS: Number((r[iRetail] ?? "0").replace(/[^\d.-]/g, "")) || 0,
        scales: parseScales(r[iScales] ?? ""),
        stockInfo: (r[iStock] ?? "").trim(),
        description: (r[iDesc] ?? "").trim() || undefined,
      };
    })
    .filter((p): p is Product => p !== null);
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

  const rows = parseCSV(csv);
  const products = rowsToProducts(rows);
  if (products.length > 0) writeCache(products);
  return products;
}
