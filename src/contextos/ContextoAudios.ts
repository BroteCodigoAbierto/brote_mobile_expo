import { createContext, use } from "react";
import type { Audio } from "../tipos/contrato";

// Los audios de una lección, ya en la caché del teléfono (spec F14, "Cargar el audio al
// cursar"; brote_specs, research de F14, puntos 10 y 11). Los descarga usePrecargarAudios al
// abrir la lección; los que no cargaron se piden otra vez al volver la conexión, o al pulsar
// "Escuchar".
export type EstadoArchivoAudio = "cargando" | "noCargo" | { uri: string };

export type ValorAudios = {
  // sin entrada: todavía no se pidió
  estados: Record<string, EstadoArchivoAudio>;
  // lo pide otra vez si no está
  pedir: (audio: Audio) => void;
  // borra el archivo de un audio que no pudo sonar (llegó dañado)
  olvidar: (audio: Audio) => void;
};

export const ContextoAudios = createContext<ValorAudios>({
  estados: {},
  pedir: () => undefined,
  olvidar: () => undefined,
});

export function useAudios(): ValorAudios {
  return use(ContextoAudios);
}
