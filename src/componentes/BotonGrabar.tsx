import { Mic, Square } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { espacio, movimiento, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { LIMITES_AUDIOS } from "../tipos/contrato";
import { formatearDuracion } from "../utilidades/audios";
import Boton from "./Boton";
import Texto from "./Texto";

type Props = {
  estado: "listo" | "grabando" | "conGrabacion";
  // los que lleva grabando
  segundos: number;
  deshabilitado?: boolean;
  alPulsar: () => void;
};

// El punto que late mientras graba; con "reducir movimiento", quieto.
function PuntoGrabando() {
  const c = useColores();
  const quieto = useReducedMotion();
  const opacidad = useSharedValue(1);

  useEffect(() => {
    if (quieto) return;
    opacidad.value = withRepeat(withTiming(0.35, { duration: movimiento.lento }), -1, true);
    return () => cancelAnimation(opacidad);
  }, [quieto, opacidad]);

  const estilo = useAnimatedStyle(() => ({ opacity: opacidad.value }));
  return <Animated.View style={[styles.punto, { backgroundColor: c.error }, estilo]} />;
}

// "Grabarme" de escuchar y repetir (docs/diseno.md, sección 4; spec F14, "Grabarse"). Mientras
// graba, "Detener" y el tiempo. "Grabando" y "Grabación lista" se anuncian; el tiempo no,
// para no leerlo cada segundo. Como la web.
export default function BotonGrabar({ estado, segundos, deshabilitado = false, alPulsar }: Props) {
  const anterior = useRef(estado);

  useEffect(() => {
    const antes = anterior.current;
    anterior.current = estado;
    let anuncio: string | null = null;
    if (estado === "grabando" && antes !== "grabando") anuncio = "Grabando";
    else if (antes === "grabando" && estado === "conGrabacion") anuncio = "Grabación lista";
    // en iOS, accessibilityLiveRegion no existe: se anuncia a mano
    if (anuncio && Platform.OS === "ios") AccessibilityInfo.announceForAccessibility(anuncio);
  }, [estado]);

  const anuncioAndroid =
    estado === "grabando" ? "Grabando" : estado === "conGrabacion" ? "Grabación lista" : "";

  return (
    <View style={styles.grabar}>
      {estado === "grabando" ? (
        <>
          <Boton
            titulo="Detener"
            etiqueta="Detener la grabación"
            variante="secundario"
            icono={Square}
            alPresionar={alPulsar}
          />
          <View style={styles.tiempo} importantForAccessibility="no-hide-descendants">
            <PuntoGrabando />
            <Texto variante="nota" color="textoSuave" style={styles.numeros}>
              Grabando… {formatearDuracion(segundos * 1000)} de{" "}
              {formatearDuracion(LIMITES_AUDIOS.grabacionMax)}
            </Texto>
          </View>
        </>
      ) : (
        <Boton
          titulo={estado === "conGrabacion" ? "Volver a grabarme" : "Grabarme"}
          variante="secundario"
          icono={Mic}
          deshabilitado={deshabilitado}
          alPresionar={alPulsar}
        />
      )}
      {Platform.OS === "android" && (
        <Texto style={styles.oculto} accessibilityLiveRegion="polite">
          {anuncioAndroid}
        </Texto>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grabar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: espacio[4],
  },
  tiempo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: radio.pildora,
  },
  numeros: {
    fontVariant: ["tabular-nums"],
  },
  oculto: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
