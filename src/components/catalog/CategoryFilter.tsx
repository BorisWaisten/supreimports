import { cn } from "@/lib/utils";

type Props = {
  categories: string[];
  active: string | null;
  onChange: (cat: string | null) => void;
};

export function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="sticky top-16 z-30 glass border-b border-border/60">
      <div className="container-page py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <Chip active={active === null} onClick={() => onChange(null)}>
            Todos
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={active === c} onClick={() => onChange(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 h-9 text-xs font-semibold uppercase tracking-wider transition-all duration-300 border",
        active
          ? "bg-foreground text-background border-foreground shadow-md scale-[1.02]"
          : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
