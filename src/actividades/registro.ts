import type { ComponentType } from "react";
import type { Actividad, TipoActividad } from "../tipos/contrato";
import CompletarEspacios from "./CompletarEspacios";
import OpcionMultiple from "./OpcionMultiple";
import PreguntaAbierta from "./PreguntaAbierta";
import TarjetaMemoria from "./TarjetaMemoria";
import Teoria from "./Teoria";
import type { PropsActividad } from "./tipos";

// Registro tipo → componente (constitución, principio IV). Agregar un tipo de
// actividad aquí es su componente y una línea en este objeto; el tipo obliga a
// tener una entrada por cada tipo del contrato, así que si falta, no compila.
export const registroActividades: {
  [T in TipoActividad]: ComponentType<PropsActividad<T>>;
} = {
  teoria: Teoria,
  tarjeta: TarjetaMemoria,
  opcionMultiple: OpcionMultiple,
  completarEspacios: CompletarEspacios,
  preguntaAbierta: PreguntaAbierta,
};

// Una versión vieja de la app puede recibir un tipo que todavía no conoce: se
// salta en vez de romper la lección (research de F03, punto 7).
export function actividadesConocidas(actividades: Actividad[]): Actividad[] {
  return actividades.filter((actividad) => actividad.tipo in registroActividades);
}
