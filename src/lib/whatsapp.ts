import type { CartItem, Product } from "@/types/catalog";
import { formatARS, getPriceTier } from "@/lib/pricing";

const WHATSAPP_NUMBER = "5491131512531";

export function buildWhatsAppMessage(
  items: CartItem[],
  products: Product[],
  dolar: number,
  totalARS: number
): string {
  const lines: string[] = [];
  lines.push("*PEDIDO · SUPRE IMPORTS*");
  lines.push("");
  lines.push(`_Cotización del día: $${dolar.toLocaleString("es-AR")}_`);
  lines.push("");

  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const tier = getPriceTier(product, item.qty, dolar);
    const subtotal = tier.unitARS * item.qty;
    lines.push(`• *${product.name}* × ${item.qty}`);
    lines.push(
      `   ${tier.isWholesale ? `Mayorista (U$D ${tier.unitUSD})` : "Minorista"} — ${formatARS(subtotal)}`
    );
    if (item.note?.trim()) {
      lines.push(`   _Detalle: ${item.note.trim()}_`);
    }
  });

  lines.push("");
  lines.push(`*TOTAL ESTIMADO: ${formatARS(totalARS)}*`);

  return lines.join("\n");
}

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
