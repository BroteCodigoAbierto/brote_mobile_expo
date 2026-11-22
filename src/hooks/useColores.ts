import { useColorScheme } from "react-native";
import { paletas } from "../constantes/paletas";
import { colores, fondoAmbiental, sombras, type Colores, type Sombras } from "../constantes/tema";
import { useTema } from "./useTema";

export function useModoTema(): "claro" | "oscuro" {
  const sistema = useColorScheme();
  const { preferencia } = useTema();
  return preferencia.modo === "sistema"
    ? sistema === "dark"
      ? "oscuro"
      : "claro"
    : preferencia.modo;
}

export function useColores(): Colores {
  const modo = useModoTema();
  const { preferencia } = useTema();
  return preferencia.tema === "original"
    ? colores[modo]
    : { ...colores[modo], ...paletas[preferencia.tema][modo].colores };
}

export function useSombras(): Sombras {
  const modo = useModoTema();
  const { preferencia } = useTema();
  return preferencia.tema === "original" ? sombras[modo] : paletas[preferencia.tema][modo].sombras;
}

export function useFondoAmbiental(): string {
  const modo = useModoTema();
  const { preferencia } = useTema();
  return preferencia.tema === "original"
    ? fondoAmbiental[modo]
    : paletas[preferencia.tema][modo].fondo;
}
