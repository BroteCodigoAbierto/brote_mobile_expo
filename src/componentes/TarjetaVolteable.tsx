import { useEffect, useState } from "react";
import { Pressable, StyleSheet, type LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { espacio, fuentes, movimiento, radio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import Texto from "./Texto";

type Props = {
  frente: string;
  reverso: string;
  volteada: boolean;
  alVoltear: () => void;
};

const ALTO_MINIMO = 200;

// Tarjeta de memoria (docs/diseno.md, sección 6): gira sobre el eje vertical.
// Las caras son opacas (como en la web) y la tarjeta mide lo que la más alta.
// Con "reducir movimiento" cambia de cara sin girar.
export default function TarjetaVolteable({ frente, reverso, volteada, alVoltear }: Props) {
  const c = useColores();
  const s = useSombras();
  const reducirMovimiento = useReducedMotion();
  const giro = useSharedValue(volteada ? 180 : 0);
  const [altos, setAltos] = useState({ frente: 0, reverso: 0 });
  const alto = Math.max(ALTO_MINIMO, altos.frente, altos.reverso);

  useEffect(() => {
    const destino = volteada ? 180 : 0;
    giro.value = reducirMovimiento ? destino : withTiming(destino, { duration: movimiento.lento });
  }, [giro, volteada, reducirMovimiento]);

  const estiloFrente = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${giro.value}deg` }],
  }));
  const estiloReverso = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${giro.value + 180}deg` }],
  }));

  function medir(cara: "frente" | "reverso") {
    return (evento: LayoutChangeEvent) => {
      const medido = evento.nativeEvent.layout.height;
      setAltos((antes) => (antes[cara] === medido ? antes : { ...antes, [cara]: medido }));
    };
  }

  const cara = [
    styles.cara,
    { backgroundColor: c.vidrioOpaco, borderColor: c.vidrioBorde, boxShadow: s.elevada },
  ];

  return (
    <Pressable
      onPress={alVoltear}
      accessibilityRole="button"
      accessibilityLabel={volteada ? `Tarjeta, reverso: ${reverso}` : `Tarjeta, frente: ${frente}`}
      accessibilityHint="Voltea la tarjeta"
      style={({ pressed }) => [{ height: alto }, pressed && styles.presionada]}
    >
      <Animated.View
        style={[
          cara,
          { minHeight: alto },
          estiloFrente,
          reducirMovimiento && volteada && styles.oculta,
        ]}
        onLayout={medir("frente")}
      >
        <Texto variante="titulo2" style={styles.centrado}>
          {frente}
        </Texto>
      </Animated.View>
      <Animated.View
        style={[
          cara,
          { minHeight: alto },
          estiloReverso,
          reducirMovimiento && !volteada && styles.oculta,
        ]}
        onLayout={medir("reverso")}
      >
        <Texto style={[styles.centrado, styles.reverso]}>{reverso}</Texto>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cara: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: espacio[8],
    paddingHorizontal: espacio[7],
    borderWidth: 1,
    borderRadius: radio.grande,
    borderCurve: "continuous",
    backfaceVisibility: "hidden",
  },
  centrado: {
    textAlign: "center",
  },
  reverso: {
    fontFamily: fuentes.medio,
    fontSize: 18,
    lineHeight: 26,
  },
  oculta: {
    opacity: 0,
  },
  presionada: {
    transform: [{ scale: 0.98 }],
  },
});
