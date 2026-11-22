import { createContext } from "react";
import type { PreferenciaTema } from "../constantes/temas";

export type EstadoTema = {
  preferencia: PreferenciaTema;
  estado: "listo" | "guardando" | "guardado" | "error";
};
export const TemaContext = createContext<
  | (EstadoTema & {
      cambiar: (preferencia: PreferenciaTema) => void;
    })
  | null
>(null);

export function reducirTema(estado: EstadoTema, accion: Partial<EstadoTema>): EstadoTema {
  return { ...estado, ...accion };
}
