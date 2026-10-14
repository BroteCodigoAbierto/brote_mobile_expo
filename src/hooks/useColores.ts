import { useColorScheme } from "react-native";
import { colores, type Colores } from "../constantes/tema";

// Colores del tema según el modo del sistema (claro u oscuro).
export function useColores(): Colores {
  return useColorScheme() === "dark" ? colores.oscuro : colores.claro;
}
