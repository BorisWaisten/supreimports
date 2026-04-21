import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/catalog/SiteHeader";
import { Hero } from "@/components/catalog/Hero";
import { FeaturedCarousel } from "@/components/catalog/FeaturedCarousel";
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
import { getFeaturedProducts } from "@/lib/featured";
import type { Product } from "@/types/catalog";


function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const Index = () => {
  const { dolar, refetchCotizacion } = useDolar();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(t);
  }, [searchInput]);
  
  const deferredSearch = useDeferredValue(search);

  const { products, categories, status, error, usedFallback, refresh } =
    useProducts();
  const cart = useCart();
  const totals = cart.computeTotals(products, dolar);

  const isLoading = status === "loading" && products.length === 0;
  const isDev = import.meta.env.DEV;

  const featuredProducts = useMemo(
    () => getFeaturedProducts(products, 16),
    [products],
  );
  const heroShowcase = useMemo(
    () => featuredProducts.slice(0, 4),
    [featuredProducts],
  );

  const filtered = useMemo(() => {
    const q = normalize(deferredSearch.trim());
  
    if (!q && !activeCat) return products;
  
    return products.filter((p) => {
      if (activeCat && p.category !== activeCat) return false;
  
      if (!q) return true;
  
      return (
        normalize(p.name).includes(q) ||
        normalize(p.category).includes(q) ||
        normalize(p.description || "").includes(q)
      );
    });
  }, [products, deferredSearch, activeCat]);
  
  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
  
    filtered.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
  
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        dolar={dolar}
        search={search}
        setSearch={setSearchInput}
        cartCount={totals.totalUnits}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        <Hero
          showcaseProducts={heroShowcase}
          onOpenProduct={(p) => setDetail(p)}
        />

        <FeaturedCarousel
          products={featuredProducts}
          dolar={dolar}
          getQty={cart.getQty}
          onInc={cart.inc}
          onOpenDetail={(p) => setDetail(p)}
        />

        <CategoryFilter
          categories={categories}
          active={activeCat}
          onChange={setActiveCat}
        />

        <section
          id="catalog"
          className="container-page py-10 sm:py-14 space-y-14 pb-32"
        >
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
