import { Minus, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";
import type { Product } from "@/types/catalog";
import { formatARS, getPriceTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  qty: number;
  dolar: number;
  onInc: (id: string, by: number) => void;
  onSetQty: (id: string, qty: number) => void;
  onOpenDetail: (product: Product) => void;
};

export function ProductCard({ product, qty, dolar, onInc, onSetQty, onOpenDetail }: Props) {
  const { ref, inView } = useReveal<HTMLDivElement>(0.1);
  const tier = getPriceTier(product, qty || 1, dolar);
  const subtotal = qty > 0 ? tier.unitARS * qty : product.retailARS;

  return (
    <div
      ref={ref}
      className={cn(
        "reveal group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500",
        inView && "in-view",
        "hover:shadow-lg hover:-translate-y-1 hover:border-foreground/15"
      )}
    >
      {/* Image */}
      <button
        onClick={() => onOpenDetail(product)}
        className="relative aspect-square overflow-hidden bg-muted/50"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/600x600/f5f5f5/999?text=SUPRE";
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category tag */}
        <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
          {product.category}
        </span>

        {/* Wholesale badge */}
        {qty > 0 && tier.isWholesale && (
          <span className="absolute top-3 right-3 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-brand animate-scale-in">
            Mayorista {tier.scale?.min}+
          </span>
        )}

        {/* Detail hint */}
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="h-4 w-4" />
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 gap-3">
        <div>
          <h3 className="font-display font-bold text-[15px] sm:text-base leading-tight tracking-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {product.description ?? product.stockInfo}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between gap-2">
          <div className="leading-tight">
            <p className="text-xl sm:text-2xl font-display font-bold tabular-nums">
              {formatARS(subtotal)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
              {qty > 0
                ? `${qty} u · ${tier.isWholesale ? `U$D ${tier.unitUSD}` : "Minorista"}`
                : `Desde ${formatARS(product.scales[product.scales.length - 1].price * dolar)} mayorista`}
            </p>
          </div>
        </div>

        {/* Qty controls */}
        <div className="mt-auto flex items-center gap-2">
          {qty === 0 ? (
            <Button
              variant="ink"
              size="sm"
              className="flex-1"
              onClick={() => onInc(product.id, 1)}
            >
              <Plus />
              Agregar
            </Button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-xl border border-border bg-muted/40 overflow-hidden">
              <button
                onClick={() => onInc(product.id, -1)}
                className="grid h-10 w-10 place-items-center hover:bg-foreground hover:text-background transition-colors"
                aria-label="Disminuir"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) =>
                  onSetQty(product.id, Math.max(0, parseInt(e.target.value || "0", 10)))
                }
                className="w-12 bg-transparent text-center text-sm font-bold tabular-nums outline-none"
              />
              <button
                onClick={() => onInc(product.id, 1)}
                className="grid h-10 w-10 place-items-center hover:bg-foreground hover:text-background transition-colors"
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
          <Button
            variant="soft"
            size="icon-sm"
            onClick={() => onOpenDetail(product)}
            aria-label="Ver detalle"
          >
            <Eye />
          </Button>
        </div>
      </div>
    </div>
  );
}
