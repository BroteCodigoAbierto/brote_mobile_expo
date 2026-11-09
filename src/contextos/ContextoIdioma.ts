import { createContext, use } from "react";
import type { IdiomaCurso } from "../tipos/contrato";

// El idioma del curso (spec F14): el de la voz que lee las frases de escuchar y repetir y con
// el que se marcan para el lector de pantalla. Lo da el reproductor, para no pasarlo por las
// props de las trece actividades (brote_specs, plan de F14, "Excepciones"). Sin proveedor,
// español.
export const ContextoIdioma = createContext<IdiomaCurso>("es");

export function useIdioma(): IdiomaCurso {
  return use(ContextoIdioma);
}
