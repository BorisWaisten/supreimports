import { Instagram, MessageCircle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-page py-12 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background font-display font-bold">
              S
            </span>
            <p className="font-display font-bold text-lg tracking-tight">Supre Imports</p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Importación directa de productos mayoristas. Atención personalizada por WhatsApp.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Contacto
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://wa.me/5491131512531"
                target="_blank"
                rel="noopener noreferrer"
                className="story-link inline-flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                +54 9 11 3151-2531
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/supreimports"
                target="_blank"
                rel="noopener noreferrer"
                className="story-link inline-flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" />
                @supreimports
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Información
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Stock real con escala mayorista.</li>
            <li>Precios sujetos a cotización del día.</li>
            <li>Envíos a todo el país.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Supre Imports. Todos los derechos reservados.</p>
          <p>Importación · Mayorista · Minorista</p>
        </div>
      </div>
    </footer>
  );
}
