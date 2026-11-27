import { useColorScheme } from "react-native";
import {
  colores,
  coloresEditorial,
  fondoAmbiental,
  fondoAmbientalEditorial,
  sombras,
  sombrasEditorial,
  type Colores,
  type Sombras,
} from "../constantes/tema";
import { useAspecto } from "./useAspecto";

// Colores del tema según el modo del sistema (claro u oscuro) y la variante
// visual elegida (Liquid Glass "vidrio" por defecto, "editorial" opcional).
export function useColores(): Colores {
  const oscuro = useColorScheme() === "dark";
  const { variante } = useAspecto();
  const paleta = variante === "editorial" ? coloresEditorial : colores;
  return oscuro ? paleta.oscuro : paleta.claro;
}

// Sombras (boxShadow) del modo y variante visual actuales.
export function useSombras(): Sombras {
  const oscuro = useColorScheme() === "dark";
  const { variante } = useAspecto();
  const paleta = variante === "editorial" ? sombrasEditorial : sombras;
  return oscuro ? paleta.oscuro : paleta.claro;
}

// Degradado del fondo ambiental del modo y variante visual actuales.
export function useFondoAmbiental(): string {
  const oscuro = useColorScheme() === "dark";
  const { variante } = useAspecto();
  const fondo = variante === "editorial" ? fondoAmbientalEditorial : fondoAmbiental;
  return oscuro ? fondo.oscuro : fondo.claro;
}
