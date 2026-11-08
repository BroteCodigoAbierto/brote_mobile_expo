import { File, Paths } from "expo-file-system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EstadoArchivoAudio, ValorAudios } from "../contextos/ContextoAudios";
import { cabecerasSesion } from "../servicios/api";
import type { Actividad, Audio } from "../tipos/contrato";
import { audiosDe, urlAudio } from "../utilidades/audios";

// Un audio nunca cambia (otro archivo es otro audio): se guarda por su id, y el que ya está
// (otra lección lo trajo) no se pide otra vez.
// https://docs.expo.dev/versions/v58.0.0/sdk/filesystem/
function archivoDe({ id, formato }: Audio): File {
  return new File(Paths.cache, "audios", `${id}.${formato}`);
}

// Al abrir la lección, todos sus audios, sin esperarlos (spec F14, "Cargar el audio al
// cursar"), como las imágenes: así, si después se pierde la conexión, lo que ya llegó se oye.
// Cuando sube `intento` (vuelve la conexión) se piden otra vez los que fallaron. Devuelve lo
// que da ContextoAudios (research de F14, puntos 10 y 11).
export function usePrecargarAudios(actividades: Actividad[], intento: number): ValorAudios {
  const [estados, setEstados] = useState<Record<string, EstadoArchivoAudio>>({});
  const actuales = useRef(estados);
  const enCurso = useRef(new Set<string>());
  const montado = useRef(true);

  useEffect(() => {
    actuales.current = estados;
  });

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const poner = useCallback((id: string, estado: EstadoArchivoAudio | null) => {
    if (!montado.current) return;
    setEstados((antes) => {
      const despues = { ...antes };
      if (estado === null) delete despues[id];
      else despues[id] = estado;
      return despues;
    });
  }, []);

  const pedir = useCallback(
    async (audio: Audio) => {
      const archivo = archivoDe(audio);
      if (enCurso.current.has(audio.id)) return;
      if (archivo.exists) {
        poner(audio.id, { uri: archivo.uri });
        return;
      }
      enCurso.current.add(audio.id);
      poner(audio.id, "cargando");
      try {
        // un error deja la descarga en un temporal, nunca a medias en el archivo
        await File.createDownloadTask(urlAudio(audio.id), archivo, {
          headers: cabecerasSesion(),
        }).downloadAsync();
        poner(audio.id, { uri: archivo.uri });
      } catch {
        poner(audio.id, "noCargo");
      } finally {
        enCurso.current.delete(audio.id);
      }
    },
    [poner],
  );

  const olvidar = useCallback(
    (audio: Audio) => {
      try {
        const archivo = archivoDe(audio);
        if (archivo.exists) archivo.delete();
      } catch {
        // si no se pudo borrar, la siguiente descarga lo reemplaza
      }
      poner(audio.id, null);
    },
    [poner],
  );

  useEffect(() => {
    for (const audio of actividades.flatMap(audiosDe)) {
      const estado = actuales.current[audio.id];
      if (estado === undefined || estado === "noCargo") void pedir(audio);
    }
  }, [actividades, intento, pedir]);

  return useMemo(
    () => ({ estados, pedir: (audio) => void pedir(audio), olvidar }),
    [estados, pedir, olvidar],
  );
}
