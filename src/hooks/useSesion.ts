import { use } from "react";
import { SesionContext, type ValorSesion } from "../contextos/SesionContext";

export function useSesion(): ValorSesion {
  const valor = use(SesionContext);
  if (!valor) throw new Error("useSesion debe usarse dentro de <SesionProvider>");
  return valor;
}
