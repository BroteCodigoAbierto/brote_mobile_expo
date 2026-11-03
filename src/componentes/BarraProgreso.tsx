import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { movimiento, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";

type Props = {
  // en la lección, actividades ya pasadas con "Continuar"; en un curso, lecciones completadas
  actual: number;
  total: number;
  // lo que anuncia el lector de pantalla; sin ellas, lo de la lección (F03)
  etiqueta?: string;
  textoValor?: string;
};

// Barra de progreso de la lección y del avance de un curso (docs/diseno.md,
// secciones 4 y 6): vacía al empezar y llena al terminar. Avanza con
// animación, salvo con "reducir movimiento".
export default function BarraProgreso({
  actual,
  total,
  etiqueta = "Progreso de la lección",
  textoValor,
}: Props) {
  const c = useColores();
  const reducirMovimiento = useReducedMotion();
  const proporcion = total > 0 ? Math.min(actual / total, 1) : 0;
  const ancho = useSharedValue(proporcion);
  const texto =
    textoValor ?? (actual >= total ? "Lección completada" : `Actividad ${actual + 1} de ${total}`);

  useEffect(() => {
    ancho.value = reducirMovimiento
      ? proporcion
      : withTiming(proporcion, { duration: movimiento.medio });
  }, [ancho, proporcion, reducirMovimiento]);

  const estiloRelleno = useAnimatedStyle(() => ({ width: `${ancho.value * 100}%` }));

  return (
    <View
      style={[styles.barra, { backgroundColor: c.borde }]}
      accessibilityRole="progressbar"
      accessibilityLabel={etiqueta}
      accessibilityValue={{ min: 0, max: total, now: actual, text: texto }}
    >
      <Animated.View
        style={[
          styles.relleno,
          {
            // el color sólido queda debajo por si no se dibuja el degradado
            backgroundColor: c.brote,
            experimental_backgroundImage: `linear-gradient(90deg, ${c.brote}, ${c.progresoFin})`,
          },
          estiloRelleno,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flex: 1,
    height: 10,
    overflow: "hidden",
    borderRadius: radio.pildora,
  },
  relleno: {
    height: "100%",
    borderRadius: radio.pildora,
  },
});
