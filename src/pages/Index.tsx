import { useMemo, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { Hero } from "@/components/catalog/Hero";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { CartDrawer } from "@/components/catalog/CartDrawer";
import { FloatingCart } from "@/components/catalog/FloatingCart";
import { HowToBuy } from "@/components/catalog/HowToBuy";
import { SiteFooter } from "@/components/catalog/SiteFooter";
import { ProductGridSkeleton } from "@/components/catalog/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useDolar } from "@/hooks/useDolar";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/catalog";

const Index = () => {
  const [dolar, setDolar] = useDolar();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);

  const { products, categories, status, error, usedFallback, refresh } =
    useProducts();
  const cart = useCart();
  const totals = cart.computeTotals(products, dolar);

  const isLoading = status === "loading" && products.length === 0;
  const isDev = import.meta.env.DEV;

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (activeCat && p.category !== activeCat) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
    const map = new Map<string, Product[]>();
    filtered.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
    return Array.from(map.entries());
  }, [search, activeCat, products]);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        dolar={dolar}
        setDolar={setDolar}
        search={search}
        setSearch={setSearch}
        cartCount={totals.totalUnits}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        <Hero />

        <CategoryFilter
          categories={categories}
          active={activeCat}
          onChange={setActiveCat}
        />

        <section
          id="catalog"
          className="container-page py-10 sm:py-14 space-y-14 pb-32"
        >
          {(error || isDev) && !isLoading && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                {error ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-muted-foreground">{error}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    {usedFallback
                      ? "Mostrando datos locales"
                      : `Conectado a Google Sheets · ${products.length} productos`}
                  </span>
                )}
              </div>
              {isDev && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh()}
                  disabled={status === "loading"}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      status === "loading" ? "animate-spin" : ""
                    }`}
                  />
                  Recargar productos
                </Button>
              )}
            </div>
          )}

          {isLoading && <ProductGridSkeleton count={8} />}

          {!isLoading && grouped.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-xl font-semibold">Sin resultados</p>
              <p className="text-sm text-muted-foreground mt-2">
                Probá con otra búsqueda o categoría.
              </p>
            </div>
          )}

          {!isLoading &&
            grouped.map(([cat, items]) => (
              <div key={cat}>
                <header className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5">
                      Categoría
                    </p>
                    <h2 className="display-1 text-3xl sm:text-4xl">{cat}</h2>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                    {items.length} producto{items.length > 1 ? "s" : ""}
                  </span>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      qty={cart.getQty(p.id)}
                      dolar={dolar}
                      onInc={cart.inc}
                      onSetQty={cart.setQty}
                      onOpenDetail={(prod) => setDetail(prod)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </section>

        <HowToBuy />
      </main>

      <SiteFooter />

      <FloatingCart
        totalARS={totals.totalARS}
        totalUnits={totals.totalUnits}
        onOpen={() => setCartOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        lines={totals.lines}
        totalARS={totals.totalARS}
        totalUnits={totals.totalUnits}
        dolar={dolar}
        onInc={cart.inc}
        onClear={cart.clear}
      />

      <ProductDetail
        product={detail}
        open={!!detail}
        onOpenChange={(o) => !o && setDetail(null)}
        qty={detail ? cart.getQty(detail.id) : 0}
        note={detail ? cart.getNote(detail.id) : ""}
        dolar={dolar}
        onInc={cart.inc}
        onSetQty={cart.setQty}
        onSetNote={cart.setNote}
      />
    </div>
  );
};

export default Index;
