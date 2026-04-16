import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  dolar: number;
  setDolar: (n: number) => void;
  search: string;
  setSearch: (s: string) => void;
  cartCount: number;
  onOpenCart: () => void;
};

export function SiteHeader({ dolar, setDolar, search, setSearch, cartCount, onOpenCart }: Props) {
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="container-page flex h-16 items-center gap-3 sm:gap-6">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background font-display font-bold text-sm">
            S
          </span>
          <div className="hidden sm:block leading-none">
            <p className="font-display font-bold text-base tracking-tight">Supre Imports</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
              Catálogo mayorista
            </p>
          </div>
        </a>

        {/* Search desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto…"
            className="h-10 rounded-xl bg-muted/60 border-transparent focus-visible:bg-background"
          />
        </div>

        {/* Dólar */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            USD
          </span>
          <input
            type="number"
            value={dolar}
            onChange={(e) => setDolar(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-20 bg-transparent text-sm font-bold tabular-nums outline-none"
          />
        </div>

        {/* Mobile search toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileSearch((v) => !v)}
          aria-label="Buscar"
        >
          {mobileSearch ? <X /> : <Menu />}
        </Button>

        {/* Cart */}
        <Button
          variant="ink"
          size="sm"
          className="relative"
          onClick={onOpenCart}
          aria-label="Ver carrito"
        >
          <ShoppingBag />
          <span className="hidden sm:inline">Pedido</span>
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

      {/* Mobile expandable area */}
      {mobileSearch && (
        <div className="md:hidden border-t border-border/60 px-4 py-3 space-y-2 bg-background animate-fade-in">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto…"
            className="h-10 rounded-xl"
            autoFocus
          />
          <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 sm:hidden">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
              Cotización USD
            </span>
            <input
              type="number"
              value={dolar}
              onChange={(e) => setDolar(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-24 bg-transparent text-right text-sm font-bold tabular-nums outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}
