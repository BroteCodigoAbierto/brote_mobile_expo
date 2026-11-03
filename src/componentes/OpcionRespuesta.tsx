import { CircleCheck, CircleX } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { espacio, fuentes, radio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import Texto from "./Texto";

export type EstadoOpcion = "normal" | "seleccionada" | "correcta" | "incorrecta";

type Props = {
  estado: EstadoOpcion;
  // una opción es un texto o un símbolo que se muestra en grande
  texto?: string;
  simbolo?: string;
  deshabilitada?: boolean;
  alElegir: () => void;
};

// Opción de una pregunta (docs/diseno.md, sección 6, "Opciones"): un radio de
// vidrio con borde de 2 px. La incorrecta se sacude, salvo con "reducir movimiento".
export default function OpcionRespuesta({
  estado,
  texto,
  simbolo,
  deshabilitada = false,
  alElegir,
}: Props) {
  const c = useColores();
  const s = useSombras();
  const reducirMovimiento = useReducedMotion();
  const desplazamiento = useSharedValue(0);

  useEffect(() => {
    if (estado !== "incorrecta" || reducirMovimiento) return;
    const paso = { duration: 60 };
    desplazamiento.value = withSequence(
      withTiming(-6, paso),
      withTiming(6, paso),
      withTiming(-6, paso),
      withTiming(6, paso),
      withTiming(0, paso),
    );
  }, [estado, reducirMovimiento, desplazamiento]);

  const estiloSacudida = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazamiento.value }],
  }));

  const aspecto = {
    normal: { borde: c.borde, fondo: c.vidrioOpaco, sombra: undefined },
    seleccionada: { borde: c.primario, fondo: c.primarioSuave, sombra: s.elevada },
    correcta: { borde: c.broteFuerte, fondo: c.broteSuave, sombra: undefined },
    incorrecta: { borde: c.error, fondo: c.errorSuave, sombra: undefined },
  }[estado];

  const etiqueta = simbolo ?? texto ?? "";

  return (
    <Animated.View style={[simbolo ? styles.contenedorMosaico : null, estiloSacudida]}>
      <Pressable
        onPress={alElegir}
        disabled={deshabilitada}
        accessibilityRole="radio"
        accessibilityLabel={
          estado === "correcta"
            ? `${etiqueta}, correcta`
            : estado === "incorrecta"
              ? `${etiqueta}, incorrecta`
              : etiqueta
        }
        accessibilityState={{ checked: estado !== "normal", disabled: deshabilitada }}
        style={({ pressed }) => [
          styles.opcion,
          simbolo ? styles.mosaico : null,
          // debajo del color de la opción, el vidrio opaco
          { borderColor: aspecto.borde, backgroundColor: c.vidrioOpaco, boxShadow: aspecto.sombra },
          pressed && !deshabilitada && styles.presionada,
        ]}
      >
        <View
          style={[
            styles.relleno,
            simbolo ? styles.rellenoMosaico : null,
            { backgroundColor: aspecto.fondo },
          ]}
        >
          {simbolo ? (
            <Texto variante="display">{simbolo}</Texto>
          ) : (
            <Texto style={styles.texto}>{texto}</Texto>
          )}
          {estado === "correcta" && (
            <CircleCheck
              size={22}
              color={c.broteFuerte}
              strokeWidth={2.25}
              style={simbolo ? styles.iconoMosaico : null}
            />
          )}
          {estado === "incorrecta" && (
            <CircleX
              size={22}
              color={c.error}
              strokeWidth={2.25}
              style={simbolo ? styles.iconoMosaico : null}
            />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  opcion: {
    borderWidth: 2,
    borderRadius: radio.medio,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  relleno: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[4],
    // con el borde de 2 px, la opción mide al menos 56
    minHeight: 52,
    paddingVertical: espacio[4],
    paddingHorizontal: espacio[5],
  },
  texto: {
    flex: 1,
    fontFamily: fuentes.medio,
  },
  presionada: {
    transform: [{ scale: 0.98 }],
  },
  contenedorMosaico: {
    flexBasis: 96,
    flexGrow: 1,
  },
  mosaico: {
    aspectRatio: 1,
  },
  rellenoMosaico: {
    flex: 1,
    justifyContent: "center",
  },
  iconoMosaico: {
    position: "absolute",
    top: espacio[4],
    right: espacio[4],
  },
});
