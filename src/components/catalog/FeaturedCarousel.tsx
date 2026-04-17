import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatARS, getPriceTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type Props = {
  products: Product[];
  dolar: number;
  getQty: (id: string) => number;
  onInc: (id: string, by: number) => void;
  onOpenDetail: (product: Product) => void;
};

export function FeaturedCarousel({
  products,
  dolar,
  getQty,
  onInc,
  onOpenDetail,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section
      className="border-b border-border/60 bg-muted/25"
      aria-labelledby="featured-heading"
    >
      <div className="container-page py-10 sm:py-12">
        <Carousel
          opts={{ align: "start", loop: false, dragFree: true }}
          className="w-full"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Selección
              </p>
              <h2
                id="featured-heading"
                className="display-1 text-2xl sm:text-3xl tracking-tight"
              >
                Destacados
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Productos marcados en catálogo y novedades. Deslizá para ver más.
              </p>
            </div>
            <div className="flex gap-2 shrink-0 self-end sm:self-auto">
              <CarouselPrevious
                variant="outline"
                size="icon"
                className="static left-auto top-auto right-auto bottom-auto translate-x-0 translate-y-0 rounded-full border-border shadow-sm"
              />
              <CarouselNext
                variant="outline"
                size="icon"
                className="static left-auto top-auto right-auto bottom-auto translate-x-0 translate-y-0 rounded-full border-border shadow-sm"
              />
            </div>
          </div>

          <CarouselContent className="-ml-3 sm:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className={cn(
                  "pl-3 sm:pl-4 basis-[min(100%,280px)] sm:basis-[46%] lg:basis-[31%] xl:basis-[24%]",
                )}
              >
                <FeaturedSlide
                  product={product}
                  dolar={dolar}
                  qty={getQty(product.id)}
                  onInc={onInc}
                  onOpenDetail={onOpenDetail}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

function FeaturedSlide({
  product,
  dolar,
  qty,
  onInc,
  onOpenDetail,
}: {
  product: Product;
  dolar: number;
  qty: number;
  onInc: (id: string, by: number) => void;
  onOpenDetail: (product: Product) => void;
}) {
  const tier = getPriceTier(product, qty || 1, dolar);
  const displayPrice =
    qty > 0 ? tier.unitARS * qty : product.retailARS;
  const wholesaleFloor =
    product.scales.length > 0
      ? product.scales[product.scales.length - 1].price * dolar
      : null;

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
      <button
        type="button"
        onClick={() => onOpenDetail(product)}
        className="relative aspect-[4/3] overflow-hidden bg-muted/50 text-left group"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.image}
          alt=""
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/600x450/f5f5f5/999?text=SUPRE";
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
          {product.category}
        </span>
        {product.featured && (
          <span className="absolute top-3 right-3 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Destacado
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="h-4 w-4" />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-h-0">
          <h3 className="font-display font-bold text-sm leading-snug tracking-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {product.description ?? product.stockInfo}
          </p>
        </div>

        <div className="mt-auto space-y-2">
          <div>
            <p className="font-display text-lg font-bold tabular-nums">
              {formatARS(displayPrice)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {qty > 0
                ? `${qty} u · ${tier.isWholesale ? `U$D ${tier.unitUSD}` : "Minorista"}`
                : wholesaleFloor != null
                  ? `Mayorista desde ${formatARS(wholesaleFloor)}`
                  : "Consultá escala"}
            </p>
          </div>
          <Button
            variant="ink"
            size="sm"
            className="w-full gap-1.5"
            onClick={() => onInc(product.id, qty === 0 ? 1 : 1)}
          >
            <Plus className="h-3.5 w-3.5" />
            {qty === 0 ? "Agregar" : "Sumar unidad"}
          </Button>
        </div>
      </div>
    </div>
  );
}
