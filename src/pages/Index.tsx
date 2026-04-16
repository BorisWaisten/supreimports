import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { Hero } from "@/components/catalog/Hero";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { CartDrawer } from "@/components/catalog/CartDrawer";
import { FloatingCart } from "@/components/catalog/FloatingCart";
import { HowToBuy } from "@/components/catalog/HowToBuy";
import { SiteFooter } from "@/components/catalog/SiteFooter";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useDolar } from "@/hooks/useDolar";
import type { Product } from "@/types/catalog";

const Index = () => {
  const [dolar, setDolar] = useDolar();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);

  const cart = useCart();
  const totals = cart.computeTotals(PRODUCTS, dolar);

  // Filtered + grouped products
  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (activeCat && p.category !== activeCat) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q))
        return false;
      return true;
    });
    const map = new Map<string, Product[]>();
    filtered.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
    return Array.from(map.entries());
  }, [search, activeCat]);

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
          categories={CATEGORIES}
          active={activeCat}
          onChange={setActiveCat}
        />

        <section id="catalog" className="container-page py-10 sm:py-14 space-y-14 pb-32">
          {grouped.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-xl font-semibold">Sin resultados</p>
              <p className="text-sm text-muted-foreground mt-2">
                Probá con otra búsqueda o categoría.
              </p>
            </div>
          )}

          {grouped.map(([cat, items]) => (
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

      {/* Floating elements */}
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
