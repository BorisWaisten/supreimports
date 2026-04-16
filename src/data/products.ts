import type { Product } from "@/types/catalog";

/**
 * Productos extraídos del CATALOGO2.html del cliente.
 * Cuando se conecte Google Sheets, este archivo actuará como fallback.
 */
export const PRODUCTS: Product[] = [
  // ── VAPEO ──────────────────────────────────────────────
  {
    id: "vapeo-elfbar-ice-king",
    category: "VAPEO",
    name: "Elfbar Ice King 40k",
    image: "https://images.unsplash.com/photo-1567429472743-2eb52e8b3edd?w=600&q=80",
    retailARS: 30000,
    scales: [
      { min: 3, price: 15 },
      { min: 5, price: 14 },
      { min: 10, price: 13.5 },
      { min: 20, price: 13 },
      { min: 30, price: 12.5 },
      { min: 50, price: 12 },
      { min: 100, price: 11.5 },
      { min: 200, price: 11 },
    ],
    stockInfo:
      "Blue Razz Ice (30) · Cherry Fuse (21) · Dragon Strawnana (15) · Grape Ice (26) · Miami Mint (12) · Tigers Blood (13) · Watermelon Ice (15)",
    description: "Vape descartable de 40.000 puffs con sabores premium.",
  },
  {
    id: "vapeo-elfbar-bc-pro",
    category: "VAPEO",
    name: "Elfbar BC Pro 45k",
    image: "https://vape-island.com/cdn/shop/files/Elf_Bar_BC10000_Puffs_Disposable_Vape.png",
    retailARS: 34000,
    scales: [
      { min: 3, price: 18 },
      { min: 5, price: 17 },
      { min: 10, price: 16.5 },
      { min: 50, price: 14.5 },
      { min: 100, price: 14 },
    ],
    stockInfo:
      "Grape Ice (7) · Mango Magic (8) · Strawberry Ice (5) · Strawberry Kiwi (7) · Watermelon Ice (10)",
    description: "Edición Pro de 45k puffs, batería extendida.",
  },
  {
    id: "vapeo-elfbar-trio",
    category: "VAPEO",
    name: "Elfbar Trio 40k",
    image: "https://vape-island.com/cdn/shop/files/Elf_Bar_Trio_40000_Puffs_Disposable_Vape.png",
    retailARS: 28500,
    scales: [
      { min: 3, price: 15 },
      { min: 5, price: 14 },
      { min: 10, price: 13.5 },
      { min: 50, price: 12 },
    ],
    stockInfo:
      "Blue Razz (19) · Blueberry Pom (10) · Peach Twist (10) · Raspberry Watermelon (10) · Strawberry Dragonfruit (20) · Watermelon Mix (10)",
    description: "Tres sabores en un solo dispositivo.",
  },
  {
    id: "vapeo-ignite-v300",
    category: "VAPEO",
    name: "Ignite V300 30k",
    image: "https://vape-island.com/cdn/shop/products/IgniteV15DisposableVape_800x.png",
    retailARS: 30000,
    scales: [
      { min: 3, price: 14.5 },
      { min: 5, price: 14 },
      { min: 10, price: 13.5 },
      { min: 20, price: 13 },
      { min: 50, price: 12 },
    ],
    stockInfo:
      "Banana Ice (10) · Blueberry (4) · Grape Ice (9) · Menthol (9) · Strawberry Ice (9) · Watermelon Ice (25)",
    description: "Línea Ignite, 30k puffs y construcción premium.",
  },
  {
    id: "vapeo-ignite-v400",
    category: "VAPEO",
    name: "Ignite V400 Mix 40k",
    image: "https://vape-island.com/cdn/shop/files/IgniteV80DisposableVape_800x.png",
    retailARS: 32000,
    scales: [
      { min: 3, price: 16.5 },
      { min: 10, price: 15.5 },
      { min: 50, price: 14.2 },
    ],
    stockInfo: "Blueberry Ice-Raspberry (6) · Mango Ice Peach (1)",
    description: "Mix de sabores premium 40k puffs.",
  },

  // ── APPLE ──────────────────────────────────────────────
  {
    id: "apple-airpods-pro-2",
    category: "APPLE",
    name: "AirPods Pro 2",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
    retailARS: 25000,
    scales: [
      { min: 5, price: 10.5 },
      { min: 20, price: 9 },
      { min: 100, price: 7.5 },
    ],
    stockInfo: "Calidad original · Cancelación de ruido activa · Estuche MagSafe",
    description: "Versión calidad original con ANC.",
  },
  {
    id: "apple-silicone-case",
    category: "APPLE",
    name: "Silicone Case",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&q=80",
    retailARS: 10000,
    scales: [
      { min: 5, price: 2.5 },
      { min: 20, price: 1.8 },
      { min: 100, price: 1.4 },
      { min: 1000, price: 1.1 },
    ],
    stockInfo: "Modelos i11 al i17 Pro Max · Stock total: 1.355 unidades",
    description: "Funda de silicona suave con interior microfibra.",
  },
  {
    id: "apple-magsafe-clear",
    category: "APPLE",
    name: "Clear MagSafe Case",
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&q=80",
    retailARS: 10000,
    scales: [
      { min: 5, price: 2.5 },
      { min: 100, price: 1.4 },
    ],
    stockInfo: "i13 Pro al i17 Pro Max · Stock total: 240 unidades",
    description: "Funda transparente con anillo MagSafe integrado.",
  },
  {
    id: "apple-tempered-glass",
    category: "APPLE",
    name: "Vidrios Templados",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80",
    retailARS: 5500,
    scales: [
      { min: 10, price: 1.5 },
      { min: 50, price: 1.2 },
    ],
    stockInfo: "i12 al i16 Pro Max · Stock total: 921 unidades",
    description: "Protector 9H con marco negro y oleofóbico.",
  },

  // ── BAZAR ──────────────────────────────────────────────
  {
    id: "bazar-quencher",
    category: "BAZAR",
    name: "Vaso Quencher 1.2L",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    retailARS: 35000,
    scales: [
      { min: 5, price: 12 },
      { min: 10, price: 11 },
      { min: 20, price: 9.5 },
      { min: 100, price: 7.5 },
    ],
    stockInfo: "Negro · Blanco · Rosa · Crema · Azul · Estilo Stanley",
    description: "Vaso térmico 1.2L con manija y sorbete.",
  },
  {
    id: "bazar-termo-classic",
    category: "BAZAR",
    name: "Termo Classic 1L",
    image: "https://images.unsplash.com/photo-1523362289600-a70b4a0e09aa?w=600&q=80",
    retailARS: 45000,
    scales: [
      { min: 5, price: 22 },
      { min: 10, price: 20 },
      { min: 50, price: 18 },
    ],
    stockInfo: "Verde · Negro · Azul · Acero inoxidable de alta resistencia",
    description: "Termo clásico de acero, ideal para mate.",
  },
  {
    id: "bazar-mug-termico",
    category: "BAZAR",
    name: "Mug Térmico 473ml",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80",
    retailARS: 28000,
    scales: [
      { min: 10, price: 9 },
      { min: 50, price: 7.5 },
    ],
    stockInfo: "Tapa a presión · Mantiene calor 6h / frío 12h",
    description: "Mug térmico con cierre hermético.",
  },

  // ── ESTÉTICA ───────────────────────────────────────────
  {
    id: "estetica-vs-bodysplash",
    category: "ESTÉTICA",
    name: "Body Splash VS Original",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
    retailARS: 32500,
    scales: [
      { min: 5, price: 17 },
      { min: 10, price: 16.5 },
      { min: 20, price: 16 },
    ],
    stockInfo:
      "Amber Romance · Aqua Kiss · Bare Vanilla · Coconut Passion · Love Spell",
    description: "Body splash Victoria's Secret, fragancia original.",
  },

  // ── TECNOLOGÍA ─────────────────────────────────────────
  {
    id: "tec-watch-ultra",
    category: "TECNOLOGÍA",
    name: "Reloj Ultra 7 Mallas",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
    retailARS: 32000,
    scales: [
      { min: 5, price: 16 },
      { min: 10, price: 14.5 },
      { min: 50, price: 11.5 },
    ],
    stockInfo: "Smartwatch Ultra con 7 correas de distintos materiales",
    description: "Smartwatch estilo Apple Watch Ultra con kit de mallas.",
  },
];

export const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category)));
