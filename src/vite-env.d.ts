/// <reference types="vite/client" />
interface ImportMetaEnv {
    /** GID de la pestaña de cotización (`#gid=` en la URL de Google Sheets). */
    readonly VITE_COTIZACION_SHEET_GID?: string;
    /** Si la cotización está en otro archivo; por defecto el mismo que el catálogo. */
    readonly VITE_COTIZACION_SHEET_ID?: string;
  }

  