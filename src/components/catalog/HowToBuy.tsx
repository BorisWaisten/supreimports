import { MessageCircle, Search, ShoppingBag } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  {
    icon: Search,
    title: "Explorá el catálogo",
    desc: "Filtrá por categoría y descubrí precios mayoristas por escala.",
  },
  {
    icon: ShoppingBag,
    title: "Armá tu pedido",
    desc: "Sumá productos, ajustá cantidades y agregá aclaraciones por ítem.",
  },
  {
    icon: MessageCircle,
    title: "Enviá por WhatsApp",
    desc: "Generamos el mensaje con todo el detalle. Coordinás envío y pago.",
  },
];

export function HowToBuy() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="how"
      className="reveal container-page py-16 sm:py-24 border-t border-border/60"
    >
      <div className="max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
          Cómo comprar
        </p>
        <h2 className="display-1 text-3xl sm:text-4xl lg:text-5xl text-balance">
          Tres pasos. Cero fricción.
        </h2>
        <p className="mt-4 text-muted-foreground text-balance">
          Diseñamos el proceso para que armes tu pedido en menos de 2 minutos.
        </p>
      </div>

      <ol className="mt-12 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="group relative rounded-3xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="absolute top-4 right-5 font-display font-bold text-5xl text-foreground/5 group-hover:text-primary/20 transition-colors">
              0{i + 1}
            </span>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-foreground text-background mb-4">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
