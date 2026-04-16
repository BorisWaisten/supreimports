import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CartItem, Product } from "@/types/catalog";
import { formatARS, getPriceTier } from "@/lib/pricing";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { toast } from "sonner";

type Line = {
  item: CartItem;
  product: Product;
  tier: ReturnType<typeof getPriceTier>;
  subtotal: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: Line[];
  totalARS: number;
  totalUnits: number;
  dolar: number;
  onInc: (id: string, by: number) => void;
  onClear: () => void;
};

export function CartDrawer({
  open,
  onOpenChange,
  lines,
  totalARS,
  totalUnits,
  dolar,
  onInc,
  onClear,
}: Props) {
  const isEmpty = lines.length === 0;

  const handleSend = () => {
    if (isEmpty) return;
    const items = lines.map((l) => l.item);
    const products = lines.map((l) => l.product);
    const msg = buildWhatsAppMessage(items, products, dolar, totalARS);
    openWhatsApp(msg);
    toast.success("Abriendo WhatsApp…", { description: "Se generó tu pedido." });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-border"
      >
        <SheetHeader className="px-6 py-5 border-b border-border space-y-1">
          <SheetTitle className="font-display text-2xl tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Tu pedido
          </SheetTitle>
          <SheetDescription className="text-xs">
            {isEmpty ? "Aún no agregaste productos." : `${totalUnits} unidades · ${lines.length} producto${lines.length > 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold">Tu carrito está vacío</p>
            <p className="text-sm text-muted-foreground">
              Explorá el catálogo y armá tu pedido. Te enviamos todo por WhatsApp.
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-2">
              Seguir comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <ul className="divide-y divide-border">
                {lines.map(({ item, product, tier, subtotal }) => (
                  <li key={product.id} className="px-6 py-4 flex gap-3">
                    <img
                      src={product.image}
                      alt=""
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/200x200/f5f5f5/999?text=S";
                      }}
                      className="h-16 w-16 rounded-xl object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                        {tier.isWholesale
                          ? `Mayorista ${tier.scale?.min}+ · U$D ${tier.unitUSD}`
                          : "Minorista"}
                      </p>
                      {item.note && (
                        <p className="text-xs italic text-muted-foreground mt-1 line-clamp-2">
                          “{item.note}”
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => onInc(product.id, -1)}
                            className="grid h-7 w-7 place-items-center hover:bg-foreground hover:text-background transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onInc(product.id, 1)}
                            className="grid h-7 w-7 place-items-center hover:bg-foreground hover:text-background transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold tabular-nums">{formatARS(subtotal)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-3">
                <button
                  onClick={onClear}
                  className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Vaciar carrito
                </button>
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-muted/20 px-6 py-5 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Total estimado
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums leading-none mt-1">
                    {formatARS(totalARS)}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  USD ${dolar.toLocaleString("es-AR")}
                </p>
              </div>
              <Button variant="whatsapp" size="lg" className="w-full" onClick={handleSend}>
                Enviar pedido por WhatsApp
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Te redirigimos a WhatsApp con el pedido pre-cargado.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
