import { CircleCheck, PartyPopper } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { espacio, movimiento } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import Aviso from "./Aviso";
import Boton from "./Boton";
import Insignia from "./Insignia";
import Texto from "./Texto";

// Estado del progreso de la lección (spec F04). Los mismos valores que en la web.
export type EstadoGuardado = "guardando" | "guardado" | "error" | "sinConexion" | "noDisponible";

type Props = {
  titulo: string;
  aciertos: number;
  preguntas: number;
  alVolver: () => void;
  // sin él no se muestra nada del guardado
  guardado?: EstadoGuardado;
  alReintentar?: () => void;
};

const AVISOS_GUARDADO = {
  error: "No se pudo guardar tu progreso.",
  sinConexion: "Sin conexión. Tu progreso no se guardó.",
  noDisponible: "Esta lección ya no está disponible. Tu progreso no se guardó.",
} as const;

// Fin de la lección (docs/diseno.md, sección 6): celebración breve y sin
// sonido, cuántas acertó si la lección tiene preguntas y si se guardó el
// progreso. "Volver al curso" espera a que termine de guardarse.
export default function ResultadoLeccion({
  titulo,
  aciertos,
  preguntas,
  alVolver,
  guardado,
  alReintentar,
}: Props) {
  const c = useColores();
  const s = useSombras();
  const reducirMovimiento = useReducedMotion();
  const escala = useSharedValue(reducirMovimiento ? 1 : 0.4);
  const insignia = useSharedValue(reducirMovimiento ? 1 : 0);

  useEffect(() => {
    if (reducirMovimiento) {
      escala.value = 1;
      insignia.value = 1;
      return;
    }
    // crece con un pequeño rebote y luego llega la insignia
    escala.value = withSequence(
      withTiming(1.12, { duration: movimiento.lento * 0.7 }),
      withTiming(1, { duration: movimiento.lento * 0.3 }),
    );
    insignia.value = withDelay(movimiento.lento, withTiming(1, { duration: movimiento.lento }));
  }, [escala, insignia, reducirMovimiento]);

  const estiloIcono = useAnimatedStyle(() => ({
    opacity: Math.min(escala.value * 1.5, 1),
    transform: [{ scale: escala.value }],
  }));
  const estiloInsignia = useAnimatedStyle(() => ({
    opacity: insignia.value,
    transform: [{ translateY: (1 - insignia.value) * 6 }],
  }));

  return (
    <View style={styles.resultado}>
      <Animated.View
        style={[styles.circulo, { backgroundColor: c.broteSuave, boxShadow: s.suave }, estiloIcono]}
        importantForAccessibility="no-hide-descendants"
      >
        <PartyPopper size={48} color={c.broteFuerte} strokeWidth={1.75} />
      </Animated.View>
      <View style={styles.textos}>
        <Texto variante="display" accessibilityRole="header" style={styles.centrado}>
          ¡Lección completada!
        </Texto>
        <Texto variante="titulo3" color="textoSuave" style={styles.centrado}>
          {titulo}
        </Texto>
      </View>
      {preguntas > 0 && (
        <Animated.View style={estiloInsignia}>
          <Insignia
            tono="brote"
            icono={CircleCheck}
            texto={`Acertaste ${aciertos} de ${preguntas}`}
          />
        </Animated.View>
      )}
      {guardado && (
        <View style={styles.guardado} accessibilityLiveRegion="polite">
          <EstadoDelGuardado guardado={guardado} alReintentar={alReintentar} />
        </View>
      )}
      <View style={styles.boton}>
        <Boton
          titulo="Volver al curso"
          alPresionar={alVolver}
          enviando={guardado === "guardando"}
        />
      </View>
    </View>
  );
}

type PropsEstadoDelGuardado = {
  guardado: EstadoGuardado;
  alReintentar?: () => void;
};

function EstadoDelGuardado({ guardado, alReintentar }: PropsEstadoDelGuardado) {
  const c = useColores();

  if (guardado === "guardando") {
    return (
      <View style={styles.fila}>
        <ActivityIndicator size="small" color={c.textoSuave} />
        <Texto variante="nota" color="textoSuave">
          Guardando tu progreso…
        </Texto>
      </View>
    );
  }
  if (guardado === "guardado") {
    return (
      <View style={styles.fila}>
        <CircleCheck size={18} color={c.broteFuerte} strokeWidth={2.25} />
        <Texto variante="nota" color="broteFuerte">
          Progreso guardado
        </Texto>
      </View>
    );
  }
  return (
    <View style={styles.problema}>
      <Aviso tono="error" texto={AVISOS_GUARDADO[guardado]} />
      {guardado !== "noDisponible" && alReintentar && (
        <Boton
          titulo="Reintentar"
          variante="secundario"
          tamano="chico"
          alPresionar={alReintentar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacio[7],
    paddingVertical: espacio[9],
  },
  circulo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  textos: {
    gap: espacio[3],
  },
  centrado: {
    textAlign: "center",
  },
  boton: {
    alignSelf: "stretch",
  },
  guardado: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  problema: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: espacio[4],
  },
});
