import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CartItem, Product } from "@/types/catalog";
import { formatARS, getPriceTier } from "@/lib/pricing";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { logOrderToSheet } from "@/lib/orderSheet";
import { useCheckoutInfo } from "@/hooks/useCheckoutInfo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Line = {
  item: CartItem;
  product: Product;
  tier: ReturnType<typeof getPriceTier>;
  subtotal: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: Line[];
  totalARS: number;
  totalUnits: number;
  dolar: number;
  onInc: (id: string, by: number) => void;
  onClear: () => void;
};

const ENVIO_OPTIONS = ["Andreani", "Retiro por oficina", "Moto mensajería"];
const NEGOCIO_OPTIONS = ["Kiosco", "E-commerce", "Bazar", "Mayorista", "Minorista"];

export function CartDrawer({
  open,
  onOpenChange,
  lines,
  totalARS,
  totalUnits,
  dolar,
  onInc,
  onClear,
}: Props) {
  const isEmpty = lines.length === 0;
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const { info, update } = useCheckoutInfo();

  useEffect(() => {
    if (open) setStep("cart");
  }, [open]);

  const canSubmit = Boolean(
    info.nombre.trim() &&
    info.telefono.trim() &&
    info.envio &&
    info.provincia.trim() &&
    info.tipoNegocio
  );

  const handleSend = () => {
    if (isEmpty || !canSubmit) return;

    const checkout = {
      nombre: info.nombre.trim(),
      telefono: info.telefono.trim(),
      envio: info.envio,
      provincia: info.provincia.trim(),
      tipoNegocio: info.tipoNegocio,
    };

    const items = lines.map((l) => l.item);
    const products = lines.map((l) => l.product);
    const msg = buildWhatsAppMessage(items, products, dolar, totalARS, checkout);

    const productosTexto = lines
      .map(({ product, item, tier }) => `${product.name} x${item.qty} (ARS ${tier.unitARS})`)
      .join(" | ");
    const totalUSD = dolar > 0 ? Math.round((totalARS / dolar) * 100) / 100 : 0;

    logOrderToSheet({
      ...checkout,
      productos: productosTexto,
      totalARS,
      totalUSD,
      cotizacion: dolar,
    });

    openWhatsApp(msg);
    toast.success("Abriendo WhatsApp…", { description: "Se generó tu pedido." });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-border"
      >
        <SheetHeader className="px-6 py-5 border-b border-border space-y-1">
          {step === "checkout" && !isEmpty && (
            <button
              onClick={() => setStep("cart")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-1 -ml-0.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al carrito
            </button>
          )}
          <SheetTitle className="font-display text-2xl tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {step === "cart" ? "Tu pedido" : "Tus datos"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {isEmpty
              ? "Aún no agregaste productos."
              : step === "cart"
              ? `${totalUnits} unidades · ${lines.length} producto${lines.length > 1 ? "s" : ""}`
              : "Los necesitamos para coordinar tu pedido."}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold">Tu carrito está vacío</p>
            <p className="text-sm text-muted-foreground">
              Explorá el catálogo y armá tu pedido. Te enviamos todo por WhatsApp.
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-2">
              Seguir comprando
            </Button>
          </div>
        ) : step === "cart" ? (
          <>
            <ScrollArea className="flex-1">
              <ul className="divide-y divide-border">
                {lines.map(({ item, product, tier, subtotal }) => (
                  <li key={product.id} className="px-6 py-4 flex gap-3">
                    <img
                      src={product.url}
                      alt=""
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/200x200/f5f5f5/999?text=S";
                      }}
                      className="h-16 w-16 rounded-xl object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                        {tier.isWholesale
                          ? `Mayorista ${tier.scale?.min}+ · U$D ${tier.unitUSD}`
                          : "Minorista"}
                      </p>
                      {item.note && (
                        <p className="text-xs italic text-muted-foreground mt-1 line-clamp-2">
                          “{item.note}”
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => onInc(product.id, -1)}
                            className="grid h-7 w-7 place-items-center hover:bg-foreground hover:text-background transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onInc(product.id, 1)}
                            className="grid h-7 w-7 place-items-center hover:bg-foreground hover:text-background transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold tabular-nums">{formatARS(subtotal)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-3">
                <button
                  onClick={onClear}
                  className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Vaciar carrito
                </button>
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-muted/20 px-6 py-5 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Total estimado
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums leading-none mt-1">
                    {formatARS(totalARS)}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  USD ${dolar.toLocaleString("es-AR")}
                </p>
              </div>
              <Button variant="whatsapp" size="lg" className="w-full" onClick={() => setStep("checkout")}>
                Continuar
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Te pedimos algunos datos antes de enviar el pedido.
              </p>
            </div>
          </>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-6 py-5 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="co-nombre">Nombre y apellido</Label>
                  <Input
                    id="co-nombre"
                    value={info.nombre}
                    onChange={(e) => update({ nombre: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="co-telefono">Teléfono</Label>
                  <Input
                    id="co-telefono"
                    value={info.telefono}
                    onChange={(e) => update({ telefono: e.target.value })}
                    placeholder="Ej: 11 2345 6789"
                    inputMode="tel"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="co-provincia">Provincia / Barrio</Label>
                  <Input
                    id="co-provincia"
                    value={info.provincia}
                    onChange={(e) => update({ provincia: e.target.value })}
                    placeholder="Ej: CABA - Palermo"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de envío</Label>
                  <OptionChips
                    options={ENVIO_OPTIONS}
                    value={info.envio}
                    onChange={(v) => update({ envio: v })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de negocio</Label>
                  <OptionChips
                    options={NEGOCIO_OPTIONS}
                    value={info.tipoNegocio}
                    onChange={(v) => update({ tipoNegocio: v })}
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-muted/20 px-6 py-5 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Total estimado
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums leading-none mt-1">
                    {formatARS(totalARS)}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  USD ${dolar.toLocaleString("es-AR")}
                </p>
              </div>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={handleSend}
                disabled={!canSubmit}
              >
                Enviar pedido por WhatsApp
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Te redirigimos a WhatsApp con el pedido pre-cargado.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function OptionChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3.5 h-8 text-xs font-semibold transition-all duration-300 border",
            value === opt
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
