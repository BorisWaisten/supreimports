import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatARS } from "@/lib/pricing";

type Props = {
  totalARS: number;
  totalUnits: number;
  onOpen: () => void;
};

/** Sticky bottom bar visible when cart has items. */
export function FloatingCart({ totalARS, totalUnits, onOpen }: Props) {
  if (totalUnits === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm animate-slide-up">
      <button
        onClick={onOpen}
        className="group w-full flex items-center gap-3 rounded-2xl bg-foreground text-background pl-4 pr-2 py-2 shadow-xl border border-foreground/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
      >
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1.5 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent text-accent-foreground text-[10px] font-black px-1">
            {totalUnits}
          </span>
        </div>
        <div className="flex-1 text-left leading-none">
          <p className="text-[10px] uppercase tracking-widest opacity-60">Tu pedido</p>
          <p className="font-display font-bold text-base tabular-nums mt-0.5">
            {formatARS(totalARS)}
          </p>
        </div>
        <span className="rounded-xl bg-background text-foreground px-4 py-2.5 text-xs font-bold uppercase tracking-wider group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
          Ver
        </span>
      </button>
    </div>
  );
}
