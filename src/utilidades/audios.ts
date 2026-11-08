import { URL_API } from "../config";
import { RUTA_AUDIOS, type Actividad, type Audio } from "../tipos/contrato";

// Los audios de los cursos (spec F14). El móvil los descarga a su caché con el token de la
// sesión antes de que suenen (brote_specs, research de F14, punto 10). La web tiene las mismas
// funciones.

export function urlAudio(id: string): string {
  return `${URL_API}${RUTA_AUDIOS}/${id}`;
}

// El audio de una actividad: solo escuchar y repetir puede traer uno.
export function audiosDe(actividad: Actividad): Audio[] {
  return actividad.tipo === "escucharRepetir" && actividad.audio ? [actividad.audio] : [];
}

// "0:04": minutos y segundos, redondeados al segundo.
export function formatearDuracion(milisegundos: number): string {
  const segundos = Math.round(milisegundos / 1000);
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`;
}
