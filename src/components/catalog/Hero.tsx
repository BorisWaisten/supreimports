import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      <div ref={ref} className="reveal container-page py-14 sm:py-20 lg:py-28 relative">
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

          {/* Stats */}
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
      </div>
    </section>
  );
}
