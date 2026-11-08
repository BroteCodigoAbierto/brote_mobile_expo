import {
  createAudioPlayer,
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  type AudioPlayer,
} from "expo-audio";
import { File } from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import { LIMITES_AUDIOS } from "../tipos/contrato";

// Grabarse en un escuchar y repetir (spec F14, "Grabarse"; brote_specs, research de F14, punto
// 13), con expo-audio. La grabación vive en la caché de la app mientras está la actividad:
// nunca se manda a ningún lado. Como el de la web, más "Abrir ajustes".
// https://docs.expo.dev/versions/v58.0.0/sdk/audio/

export type EstadoGrabacion =
  | "lista"
  | "pidiendoPermiso"
  | "grabando"
  | "conGrabacion"
  | "sonando"
  | "sinPermiso"
  | "sinMicrofono";

export type Grabacion = {
  estado: EstadoGrabacion;
  // los que lleva grabando
  segundos: number;
  hayGrabacion: boolean;
  // sin permiso y el sistema ya no lo vuelve a pedir: el aviso lleva "Abrir ajustes"
  puedeAbrirAjustes: boolean;
  grabar: () => void;
  detener: () => void;
  escuchar: () => void;
  detenerEscucha: () => void;
  abrirAjustes: () => void;
};

function borrar(uri: string | null) {
  if (!uri) return;
  try {
    const archivo = new File(uri);
    if (archivo.exists) archivo.delete();
  } catch {
    // es de la caché: el sistema la limpia
  }
}

export function useGrabacion(): Grabacion {
  const grabador = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const estadoGrabador = useAudioRecorderState(grabador, 250);
  const [estado, setEstado] = useState<EstadoGrabacion>("lista");
  const [uri, setUri] = useState<string | null>(null);
  const [puedeAbrirAjustes, setPuedeAbrirAjustes] = useState(false);
  const reproductor = useRef<AudioPlayer | null>(null);
  const ultima = useRef<string | null>(null);
  const montado = useRef(true);
  // ya empezó a grabar de verdad, y si ya se está cerrando: para no cerrarla dos veces ni
  // confundir la grabación anterior con la nueva
  const empezo = useRef(false);
  const terminando = useRef(false);

  // Lo que suene después vuelve al altavoz con su volumen normal.
  async function terminarGrabacion() {
    if (terminando.current) return;
    terminando.current = true;
    empezo.current = false;
    try {
      await grabador.stop();
    } catch {
      // ya se había detenido sola (a los 30 s o por una llamada)
    }
    await setAudioModeAsync({ allowsRecording: false }).catch(() => undefined);
    terminando.current = false;
    if (!montado.current) return;
    ultima.current = grabador.uri;
    setUri(grabador.uri);
    setEstado(grabador.uri ? "conGrabacion" : "lista");
  }

  // Se detuvo sola: a los 30 s o porque la interrumpió una llamada. Se queda lo grabado.
  useEffect(() => {
    if (estado !== "grabando") return;
    if (estadoGrabador.isRecording) empezo.current = true;
    else if (empezo.current) void terminarGrabacion();
    // terminarGrabacion solo usa refs, el grabador y setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, estadoGrabador.isRecording]);

  function detenerEscucha() {
    reproductor.current?.pause();
    setEstado((actual) => (actual === "sonando" ? "conGrabacion" : actual));
  }

  function detener() {
    if (estado === "grabando") void terminarGrabacion();
  }

  // A segundo plano, la grabación se detiene y se queda; lo que suena, también se detiene.
  // Al volver, si ya hay permiso (lo dio en los ajustes), el aviso se va.
  useEffect(() => {
    const suscripcion = AppState.addEventListener("change", (ahora) => {
      if (ahora !== "active") {
        detener();
        detenerEscucha();
        return;
      }
      if (estado !== "sinPermiso") return;
      void getRecordingPermissionsAsync().then(({ granted }) => {
        if (granted && montado.current) {
          setPuedeAbrirAjustes(false);
          setEstado(ultima.current ? "conGrabacion" : "lista");
        }
      });
    });
    return () => suscripcion.remove();
  });

  // Al salir de la actividad, la grabación se descarta.
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      reproductor.current?.remove();
      reproductor.current = null;
      borrar(ultima.current);
    };
  }, []);

  async function grabar() {
    detenerEscucha();
    setEstado("pidiendoPermiso");
    let permiso;
    try {
      // la primera vez, el sistema pregunta; después responde lo que se eligió
      permiso = await requestRecordingPermissionsAsync();
    } catch {
      if (montado.current) setEstado("sinMicrofono");
      return;
    }
    if (!montado.current) return;
    if (!permiso.granted) {
      setPuedeAbrirAjustes(!permiso.canAskAgain);
      setEstado("sinPermiso");
      return;
    }
    try {
      // solo mientras graba: si no, lo que suena sale por el auricular y más bajo
      await setAudioModeAsync({ allowsRecording: true });
      await grabador.prepareToRecordAsync();
      // la anterior se reemplaza
      reproductor.current?.remove();
      reproductor.current = null;
      borrar(ultima.current);
      ultima.current = null;
      setUri(null);
      grabador.record({ forDuration: LIMITES_AUDIOS.grabacionMax / 1000 });
      if (montado.current) setEstado("grabando");
    } catch {
      await setAudioModeAsync({ allowsRecording: false }).catch(() => undefined);
      if (montado.current) setEstado("sinMicrofono");
    }
  }

  function escuchar() {
    if (!uri) return;
    if (!reproductor.current) {
      const nuevo = createAudioPlayer({ uri });
      nuevo.addListener("playbackStatusUpdate", ({ didJustFinish }) => {
        if (didJustFinish && montado.current) setEstado("conGrabacion");
      });
      reproductor.current = nuevo;
    }
    void reproductor.current.seekTo(0);
    reproductor.current.play();
    setEstado("sonando");
  }

  return {
    estado,
    segundos: Math.floor(
      Math.min(estadoGrabador.durationMillis, LIMITES_AUDIOS.grabacionMax) / 1000,
    ),
    hayGrabacion: uri !== null,
    puedeAbrirAjustes: estado === "sinPermiso" && puedeAbrirAjustes,
    grabar: () => void grabar(),
    detener,
    escuchar,
    detenerEscucha,
    abrirAjustes: () => void Linking.openSettings(),
  };
}
