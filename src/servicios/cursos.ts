import type {
  CategoriaCurso,
  IdiomaCurso,
  NivelCurso,
  OrdenCatalogo,
  RespuestaCatalogo,
  RespuestaCurso,
  RespuestaError,
} from "../tipos/contrato";
import { ErrorConexion, ErrorHttp, MENSAJE_SIN_CONEXION, MENSAJE_SIN_SERVIDOR, pedir } from "./api";

export type FiltrosCatalogo = {
  q: string;
  categoria?: CategoriaCurso;
  nivel?: NivelCurso;
  idioma?: IdiomaCurso;
  orden?: OrdenCatalogo;
  ocultarCompletados?: boolean;
  organizacion?: string;
};

type ConsultaCatalogo = FiltrosCatalogo & { despues?: string | null };

// GET /cursos: cursos publicados según búsqueda, filtros y organización opcional,
// paginados a partir del cursor `despues`.
export function traerCatalogo({
  q,
  categoria,
  nivel,
  idioma,
  orden,
  ocultarCompletados,
  organizacion,
  despues,
}: ConsultaCatalogo) {
  const parametros = new URLSearchParams();
  if (q) parametros.set("q", q);
  if (categoria) parametros.set("categoria", categoria);
  if (nivel) parametros.set("nivel", nivel);
  if (idioma) parametros.set("idioma", idioma);
  if (orden && orden !== "recientes") parametros.set("orden", orden);
  if (ocultarCompletados) parametros.set("ocultarCompletados", "true");
  if (organizacion) parametros.set("organizacion", organizacion);
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
