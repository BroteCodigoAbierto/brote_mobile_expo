import type { LeccionDelCurso, ProgresoLeccion } from "../tipos/contrato";

// Textos y cálculos del avance que no vienen del backend (brote_specs, research
// de F04, punto 9). La web tiene las mismas funciones, para que un curso
// muestre el mismo avance en los dos.

export type Avance = {
  completadas: number;
  total: number;
  // la primera lección sin completar en el orden del curso, aunque haya
  // completadas después; null si completó todas
  siguiente: LeccionDelCurso | null;
};

export function avanceCurso(lecciones: LeccionDelCurso[]): Avance {
  const enOrden = [...lecciones].sort((a, b) => a.posicion - b.posicion);
  return {
    completadas: lecciones.filter((leccion) => leccion.progreso !== null).length,
    total: lecciones.length,
    siguiente: enOrden.find((leccion) => leccion.progreso === null) ?? null,
  };
}

// "2 de 6 lecciones"; con un curso de una sola lección, "1 de 1 lección".
export function textoAvance(completadas: number, total: number): string {
  return `${completadas} de ${total} ${total === 1 ? "lección" : "lecciones"}`;
}

// Lo que anuncia el lector de pantalla en la barra del avance.
export function textoAvanceAccesible(completadas: number, total: number): string {
  return `${textoAvance(completadas, total)} ${total === 1 ? "completada" : "completadas"}`;
}

// "2 de 3 aciertos", también con 1 para no confundirlo con el avance; null si
// la lección no tiene preguntas (se marca sin resultado).
export function textoAciertos({ aciertos, preguntas }: ProgresoLeccion): string | null {
  if (preguntas === 0) return null;
  return `${aciertos} de ${preguntas} aciertos`;
}

export function textoBotonSiguiente(siguiente: LeccionDelCurso, completadas: number): string {
  const leccion = `${siguiente.posicion}. ${siguiente.titulo}`;
  return completadas === 0 ? `Empezar: ${leccion}` : `Continuar: ${leccion}`;
}
