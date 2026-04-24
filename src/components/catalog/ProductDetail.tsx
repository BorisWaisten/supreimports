import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types/catalog";
import { formatARS, formatUSD, getPriceTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Props = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qty: number;
  note: string;
  dolar: number;
  onInc: (id: string, by: number) => void;
  onSetQty: (id: string, qty: number) => void;
  onSetNote: (id: string, note: string) => void;
};

export function ProductDetail({
  product,
  open,
  onOpenChange,
  qty,
  note,
  dolar,
  onInc,
  onSetQty,
  onSetNote,
}: Props) {
  if (!product) return null;

  const tier = getPriceTier(product, qty || 1, dolar);
  const subtotal = qty > 0 ? tier.unitARS * qty : product.retailARS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-full h-[100dvh]
          max-w-none
          sm:max-w-3xl sm:h-auto
          p-0 overflow-y-auto sm:overflow-hidden
          rounded-none sm:rounded-3xl
        "
      >
        <div className="flex flex-col h-full md:grid md:grid-cols-2">

          {/* 📱 HEADER MOBILE */}
          <div className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background border-b border-border">
            <button
              onClick={() => onOpenChange(false)}
              className="text-sm font-medium"
            >
              ← Volver
            </button>

            <span className="text-sm font-semibold line-clamp-1">
              {product.name}
            </span>

            <div className="w-12" />
          </div>

          {/* 🖼 IMAGEN */}
          <div className="relative aspect-square md:aspect-auto bg-muted/40">
            <img
              src={product.url}
              alt={product.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/800x800/f5f5f5/999?text=SUPRE";
              }}
              className="h-full w-full object-cover"
            />

            <span className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
              {product.category}
            </span>
          </div>

          {/* 📄 CONTENIDO */}
          <div className="flex flex-col h-full">

            {/* 🔽 SCROLL REAL */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">

              <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight tracking-tight">
                {product.name}
              </h2>

              {product.description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* 📦 STOCK */}
              <div className="mt-5 rounded-2xl bg-accent/15 border border-accent/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-1.5">
                  Variedades disponibles
                </p>
                <p className="text-sm leading-relaxed">
                  {product.stockInfo}
                </p>
              </div>

              {/* 📊 ESCALA */}
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Escala mayorista
                </p>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="grid grid-cols-2 bg-muted/50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Cantidad</span>
                    <span className="text-right">Precio unitario</span>
                  </div>

                  {product.scales.map((s, i) => {
                    const isActive = tier.scale?.min === s.min;

                    return (
                      <div
                        key={s.min}
                        className={cn(
                          "grid grid-cols-2 px-4 py-2.5 text-sm border-t border-border",
                          i === 0 && "border-t-0",
                          isActive && "bg-primary/5 font-semibold"
                        )}
                      >
                        <span className="tabular-nums">
                          {s.min}+ unidades{" "}
                          {isActive && (
                            <span className="text-primary">·</span>
                          )}
                        </span>

                        <span className="text-right tabular-nums">
                          {formatUSD(s.price)}{" "}
                          <span className="text-muted-foreground text-xs">
                            ({formatARS(s.price * dolar)})
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 📝 NOTAS */}
              {qty > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Aclaraciones
                  </p>

                  <Textarea
                    value={note}
                    onChange={(e) =>
                      onSetNote(product.id, e.target.value)
                    }
                    placeholder="Ej: 10 Blue Razz Ice y 10 Watermelon Ice"
                    rows={2}
                    className="rounded-xl resize-none"
                  />
                </div>
              )}

              {/* espacio para que no tape el footer */}
              <div className="h-24" />
            </div>

            {/* 💰 FOOTER FIJO */}
            <div className="border-t border-border p-4 bg-background flex items-center gap-3">

              <div className="flex-1">
                <p className="text-2xl font-display font-bold tabular-nums">
                  {formatARS(subtotal)}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {qty > 0
                    ? `${qty} u · ${
                        tier.isWholesale
                          ? `Mayorista U$D ${tier.unitUSD}`
                          : "Minorista"
                      }`
                    : "Precio minorista"}
                </p>
              </div>

              {qty === 0 ? (
                <Button
                  variant="ink"
                  size="lg"
                  onClick={() => onInc(product.id, 1)}
                >
                  <Plus />
                  Agregar
                </Button>
              ) : (
                <div className="flex items-center rounded-2xl border border-border bg-muted/40 overflow-hidden">
                  <button
                    onClick={() => onInc(product.id, -1)}
                    className="grid h-12 w-12 place-items-center hover:bg-foreground hover:text-background"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    value={qty}
                    onChange={(e) =>
                      onSetQty(
                        product.id,
                        Math.max(
                          0,
                          parseInt(e.target.value || "0", 10)
                        )
                      )
                    }
                    className="w-14 bg-transparent text-center font-bold outline-none"
                  />

                  <button
                    onClick={() => onInc(product.id, 1)}
                    className="grid h-12 w-12 place-items-center hover:bg-foreground hover:text-background"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}