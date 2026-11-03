import type { Actividad, TipoActividad } from "../tipos/contrato";

// Lo que comparten todos los componentes de actividad (brote_specs, research de
// F03, punto 7). El reproductor no sabe nada de ningún tipo: le pasa la
// actividad a su componente y recibe el resultado.

// "sinCalificar": teoría y tarjetas, que no cuentan como preguntas.
export type ResultadoActividad = "acierto" | "fallo" | "sinCalificar";

export type PropsActividad<T extends TipoActividad> = {
  actividad: Extract<Actividad, { tipo: T }>;
  // la primera vez que elige, escribe o voltea algo (para confirmar al salir)
  alInteractuar: () => void;
  // al pulsar "Continuar"
  alTerminar: (resultado: ResultadoActividad) => void;
};
