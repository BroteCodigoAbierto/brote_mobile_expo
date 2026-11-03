import { useColorScheme } from "react-native";
import { colores, fondoAmbiental, sombras, type Colores, type Sombras } from "../constantes/tema";

// Colores del tema según el modo del sistema (claro u oscuro).
export function useColores(): Colores {
  return useColorScheme() === "dark" ? colores.oscuro : colores.claro;
}

// Sombras (boxShadow) del modo actual.
export function useSombras(): Sombras {
  return useColorScheme() === "dark" ? sombras.oscuro : sombras.claro;
}

// Degradado del fondo ambiental del modo actual.
export function useFondoAmbiental(): string {
  return useColorScheme() === "dark" ? fondoAmbiental.oscuro : fondoAmbiental.claro;
}
