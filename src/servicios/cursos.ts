import type { RespuestaCatalogo, RespuestaCurso, RespuestaError } from "../tipos/contrato";
import { ErrorConexion, ErrorHttp, MENSAJE_SIN_CONEXION, MENSAJE_SIN_SERVIDOR, pedir } from "./api";

type ConsultaCatalogo = { q: string; despues?: string | null };

// GET /cursos: los siguientes 10 cursos publicados que coinciden con `q`, a
// partir del cursor `despues` (el `siguiente` de la respuesta anterior).
export function traerCatalogo({ q, despues }: ConsultaCatalogo) {
  const parametros = new URLSearchParams();
  if (q) parametros.set("q", q);
  if (despues) parametros.set("despues", despues);
  const consulta = parametros.toString();
  return pedir<RespuestaCatalogo>(consulta ? `/cursos?${consulta}` : "/cursos");
}

export function traerCurso(id: string) {
  return pedir<RespuestaCurso>(`/cursos/${encodeURIComponent(id)}`);
}

// El curso no existe o no está publicado: el backend responde igual a los dos.
export function esNoDisponible(error: unknown): boolean {
  return error instanceof ErrorHttp && error.estado === 404;
}

// Lo que se muestra cuando falla una carga: el mensaje del backend si lo hay
// (p. ej. un cursor inválido), sin conexión si el teléfono no tiene red, o que
// no se pudo conectar con Brote.
export function leerErrorDeCarga(error: unknown): string {
  if (error instanceof ErrorHttp && error.estado < 500) {
    const cuerpo = error.cuerpo as Partial<RespuestaError> | null;
    if (cuerpo?.error) return cuerpo.error;
  }
  if (error instanceof ErrorConexion && error.sinConexion) return MENSAJE_SIN_CONEXION;
  return MENSAJE_SIN_SERVIDOR;
}
