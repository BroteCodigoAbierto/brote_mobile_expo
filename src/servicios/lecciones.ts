import type { RespuestaLeccion } from "../tipos/contrato";
import { pedir } from "./api";

// GET /cursos/:idCurso/lecciones/:idLeccion: la lección con sus actividades
// (spec F03). Para los errores sirven esNoDisponible y leerErrorDeCarga de
// servicios/cursos.ts: el 404, los 5xx y "sin conexión" significan lo mismo
// que en el detalle.
export function traerLeccion(idCurso: string, idLeccion: string) {
  return pedir<RespuestaLeccion>(
    `/cursos/${encodeURIComponent(idCurso)}/lecciones/${encodeURIComponent(idLeccion)}`,
  );
}
