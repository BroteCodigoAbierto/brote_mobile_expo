import type { RespuestaOrganizacion, RespuestaOrganizaciones } from "../tipos/contrato";
import { pedir } from "./api";

export function traerMisOrganizaciones() {
  return pedir<RespuestaOrganizaciones>("/organizaciones/mias");
}

export function unirseAOrganizacion(codigo: string) {
  return pedir<RespuestaOrganizacion>("/organizaciones/unirse", {
    method: "POST",
    body: JSON.stringify({ codigo }),
  });
}
