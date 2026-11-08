import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from "expo-audio";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { ValorAudios } from "../contextos/ContextoAudios";
import {
  ETIQUETA_VOZ,
  VELOCIDAD_LENTA,
  type ActividadEscucharRepetir,
  type IdiomaCurso,
} from "../tipos/contrato";
import { elegirVoz, vocesDelIdioma } from "../utilidades/voz";

// La frase de un escuchar y repetir (spec F14, "Cursar la actividad"; brote_specs, research de
// F14, puntos 10, 11 y 14): su audio, ya descargado, o la voz del teléfono en el idioma del
// curso. Nunca la voz en lugar de un audio que no cargó. Como el de la web.
// https://docs.expo.dev/versions/v58.0.0/sdk/audio/

export type EstadoFrase = "cargando" | "lista" | "sonando" | "noCargo" | "sinVoz" | "noSono";

export type VelocidadFrase = "normal" | "lenta";

export type Frase = {
  estado: EstadoFrase;
  // la del botón que la hizo sonar
  velocidad: VelocidadFrase;
  // empezó a sonar alguna vez: habilita "Comprobar"
  sono: boolean;
  escuchar: (velocidad: VelocidadFrase) => void;
  detener: () => void;
};

const RITMO: Record<VelocidadFrase, number> = { normal: 1, lenta: VELOCIDAD_LENTA };

// Sin empezar a sonar en 3 s, no logró sonar.
const ESPERA_INICIO_MS = 3000;

// El audio que no se pudo abrir: iOS lo dice con "failed" y un `error` en el estado.
function fallo(estado: AudioStatus): boolean {
  return estado.playbackState === "failed" || "error" in estado;
}

export function useFrase(
  { frase, audio }: ActividadEscucharRepetir,
  idioma: IdiomaCurso,
  audios: ValorAudios,
): Frase {
  const [voz, setVoz] = useState<Speech.Voice | null | undefined>(undefined);
  const [sonando, setSonando] = useState(false);
  const [noSono, setNoSono] = useState(false);
  const [velocidad, setVelocidad] = useState<VelocidadFrase>("normal");
  const [sono, setSono] = useState(false);
  // la velocidad con la que hay que sonar en cuanto llegue el audio pedido con "Escuchar"
  const pendiente = useRef<VelocidadFrase | null>(null);
  const reproductor = useRef<AudioPlayer | null>(null);
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  const archivo = audio ? audios.estados[audio.id] : undefined;
  const uri = typeof archivo === "object" ? archivo.uri : null;

  function pararEspera() {
    if (espera.current) clearTimeout(espera.current);
    espera.current = null;
  }

  function detener() {
    pararEspera();
    pendiente.current = null;
    void Speech.stop();
    reproductor.current?.pause();
    setSonando(false);
  }

  function terminoDeSonar() {
    if (montado.current) setSonando(false);
  }

  function empezo() {
    if (!montado.current) return;
    pararEspera();
    setSono(true);
    setNoSono(false);
    setSonando(true);
  }

  // Un audio que no pudo sonar sale de la caché: el siguiente "Escuchar" lo descarga otra vez.
  function noLogroSonar() {
    if (!montado.current) return;
    pararEspera();
    void Speech.stop();
    reproductor.current?.pause();
    setSonando(false);
    setNoSono(true);
    if (audio) audios.olvidar(audio);
  }

  // Al abrir: la frase suena aunque el teléfono esté en silencio, porque el alumno la pide.
  // Sin audio, se busca la voz del idioma.
  useEffect(() => {
    montado.current = true;
    void setAudioModeAsync({ playsInSilentMode: true });
    if (!audio) {
      void vocesDelIdioma(idioma).then((voces) => {
        if (montado.current) setVoz(elegirVoz(voces, idioma));
      });
    }
    return () => {
      montado.current = false;
      pararEspera();
      void Speech.stop();
      reproductor.current?.remove();
      reproductor.current = null;
    };
  }, [audio, idioma]);

  // A segundo plano, todo se detiene.
  useEffect(() => {
    const suscripcion = AppState.addEventListener("change", (estado) => {
      if (estado !== "active") detener();
    });
    return () => suscripcion.remove();
  });

  function sonarAudio(fuente: string, ritmo: number) {
    if (!reproductor.current) {
      const nuevo = createAudioPlayer({ uri: fuente });
      nuevo.addListener("playbackStatusUpdate", (estado) => {
        if (fallo(estado)) noLogroSonar();
        else if (estado.playing) empezo();
        else if (estado.didJustFinish && montado.current) setSonando(false);
      });
      reproductor.current = nuevo;
    } else {
      reproductor.current.replace({ uri: fuente });
    }
    const actual = reproductor.current;
    // más lento sin sonar más grave
    actual.shouldCorrectPitch = true;
    actual.setPlaybackRate(ritmo, "high");
    void actual.seekTo(0);
    actual.play();
    espera.current = setTimeout(noLogroSonar, ESPERA_INICIO_MS);
  }

  // El audio pedido con "Escuchar" llegó: suena. Si no llegó, ya no: que no suene de pronto
  // cuando la precarga lo traiga después.
  useEffect(() => {
    const velocidadPedida = pendiente.current;
    if (velocidadPedida === null) return;
    if (archivo === "noCargo") pendiente.current = null;
    if (!uri) return;
    pendiente.current = null;
    sonarAudio(uri, RITMO[velocidadPedida]);
    // sonarAudio solo usa refs y setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, archivo]);

  function escuchar(nueva: VelocidadFrase) {
    pararEspera();
    void Speech.stop();
    reproductor.current?.pause();
    setVelocidad(nueva);
    setSonando(true);
    const ritmo = RITMO[nueva];
    if (audio) {
      if (uri) {
        sonarAudio(uri, ritmo);
      } else {
        // no cargó o se borró por dañado: se pide en este momento y, si llega, suena
        setSonando(false);
        pendiente.current = nueva;
        audios.pedir(audio);
      }
      return;
    }
    if (!voz) return;
    Speech.speak(frase, {
      language: ETIQUETA_VOZ[idioma],
      voice: voz.identifier,
      rate: ritmo,
      // la sesión de audio de la app, que deja sonar con el interruptor de silencio
      useApplicationAudioSession: true,
      onStart: empezo,
      onDone: terminoDeSonar,
      onStopped: terminoDeSonar,
      onError: noLogroSonar,
    });
    espera.current = setTimeout(noLogroSonar, ESPERA_INICIO_MS);
  }

  let estado: EstadoFrase;
  if (sonando) estado = "sonando";
  else if (noSono) estado = "noSono";
  else if (audio) {
    estado = uri ? "lista" : archivo === "noCargo" ? "noCargo" : "cargando";
  } else {
    estado = voz === undefined ? "cargando" : voz ? "lista" : "sinVoz";
  }

  return { estado, velocidad, sono, escuchar, detener };
}
