import type { RespuestaGrupo, RespuestaGrupos } from "../tipos/contrato";
import { pedir } from "./api";

export function traerMisGrupos() {
  return pedir<RespuestaGrupos>("/grupos/mios");
}

export function unirseAGrupo(codigo: string) {
  return pedir<RespuestaGrupo>("/grupos/unirse", {
    method: "POST",
    body: JSON.stringify({ codigo }),
  });
}
