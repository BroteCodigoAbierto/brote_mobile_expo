import type {
  CuerpoProgresoLeccion,
  RespuestaCursosEmpezados,
  RespuestaInsignias,
  RespuestaProgresoLeccion,
} from "../tipos/contrato";
import { pedir } from "./api";

// PUT .../progreso: registra (o reemplaza) el resultado de una lección completada.
// F08: la respuesta trae también la insignia que haya ganado con ella (o null).
export function guardarProgreso(idCurso: string, idLeccion: string, cuerpo: CuerpoProgresoLeccion) {
  return pedir<RespuestaProgresoLeccion>(
    `/cursos/${encodeURIComponent(idCurso)}/lecciones/${encodeURIComponent(idLeccion)}/progreso`,
    { method: "PUT", body: JSON.stringify(cuerpo) },
  );
}

// Los cursos que empezó quien llama, del avance más reciente al más antiguo.
export function traerCursosEmpezados() {
  return pedir<RespuestaCursosEmpezados>("/usuarios/yo/cursos-empezados");
}

// F08: las insignias de quien llama, de la más reciente a la más antigua.
export function traerInsignias() {
  return pedir<RespuestaInsignias>("/usuarios/yo/insignias");
}
