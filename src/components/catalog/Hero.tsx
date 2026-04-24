import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

const collageSlots = [
  "left-0 top-6 z-10 -rotate-[5deg] hover:z-[60]",
  "right-0 top-0 z-20 rotate-[4deg] hover:z-[60]",
  "left-4 bottom-2 z-30 rotate-[3deg] hover:z-[60]",
  "right-6 bottom-10 z-40 -rotate-[3deg] hover:z-[60]",
];

type Props = {
  showcaseProducts: Product[];
  onOpenProduct?: (product: Product) => void;
};

export function Hero({ showcaseProducts, onOpenProduct }: Props) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const tiles = showcaseProducts.slice(0, 4);
  const hasVisual = tiles.length > 0;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Decorative blobs — mismos tokens que antes */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      <div
        ref={ref}
        className={cn(
          "reveal container-page py-14 sm:py-20 lg:py-24 relative",
          inView && "in-view",
          hasVisual && "lg:grid lg:grid-cols-[1fr_min(42%,480px)] lg:gap-x-14 lg:items-center",
        )}
      >
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1.5 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Importación directa · Stock real</span>
          </div>

          <h1 className="display-1 text-5xl sm:text-6xl lg:text-7xl text-balance">
            Mayorista,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              sin intermediarios.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl text-balance leading-relaxed">
            Vapeo, Apple, Bazar y Tecnología al mejor precio del mercado. Cotizá tu pedido
            en segundos y enviálo directo por WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <a href="#catalog">
                Ver catálogo
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how">Cómo comprar</a>
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { v: "+500", l: "Productos" },
              { v: "24h", l: "Respuesta" },
              { v: "100%", l: "Stock real" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                  {s.v}
                </dt>
                <dd className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {hasVisual && (
          <HeroShowcase
            tiles={tiles}
            onOpenProduct={onOpenProduct}
            className="mt-12 lg:mt-0"
          />
        )}
      </div>
    </section>
  );
}

function HeroShowcase({
  tiles,
  onOpenProduct,
  className,
}: {
  tiles: Product[];
  onOpenProduct?: (product: Product) => void;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {/* Mobile / tablet: grilla limpia */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto lg:hidden">
        {tiles.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpenProduct?.(p)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            aria-label={`Ver ${p.name}`}
          >
            <img
              src={p.url}
              alt=""
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/600x600/f5f5f5/999?text=SUPRE";
              }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-2 left-2 right-2 rounded-lg bg-background/90 backdrop-blur px-2 py-1 text-left text-[10px] font-semibold leading-tight line-clamp-2">
              {p.name}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop: collage con profundidad */}
      <div className="hidden lg:block relative h-[min(420px,42vw)] w-full max-w-xl ml-auto">
        {tiles.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpenProduct?.(p)}
            className={cn(
              "absolute w-[56%] overflow-hidden rounded-3xl border-2 border-background bg-card shadow-lg ring-1 ring-border/80",
              "transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:ring-primary/25",
              collageSlots[i] ?? collageSlots[0],
            )}
            style={{ animationDelay: `${i * 80}ms` }}
            aria-label={`Ver ${p.name}`}
          >
            <div className="aspect-square w-full">
              <img
                src={p.url}
                alt=""
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/600x600/f5f5f5/999?text=SUPRE";
                }}
                className="h-full w-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
