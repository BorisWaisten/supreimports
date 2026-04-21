import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/lib/pricing";

type Props = {
  dolar: number;
  search: string;
  setSearch: (s: string) => void;
  cartCount: number;
  onOpenCart: () => void;
};

export function SiteHeader({
  dolar,
  cartCount,
  onOpenCart,
}: Props) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="container-page flex h-16 items-center gap-3 sm:gap-6 justify-between">

        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background font-display font-bold text-sm">
            S
          </span>
        </a>

        {/* Cotización SIEMPRE visible */}
        <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            USD
          </span>
          <span className="text-sm font-bold tabular-nums">
            {formatUSD(dolar)}
          </span>
        </div>

        {/* Cart */}
        <Button
          variant="ink"
          size="sm"
          className="relative"
          onClick={onOpenCart}
          aria-label="Ver carrito"
        >
          <ShoppingBag />
          {cartCount > 0 && (
            <span
              className={cn(
                "absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent text-accent-foreground text-[10px] font-black px-1",
                "animate-scale-in"
              )}
            >
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}