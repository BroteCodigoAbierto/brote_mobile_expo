import { X } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { AREA_TACTIL, espacio, MARGEN_PANTALLA, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import BarraProgreso from "../componentes/BarraProgreso";

type Props = {
  alSalir: () => void;
  // sin progreso mientras carga la lección
  progreso?: { actual: number; total: number };
  // mientras se guarda el progreso (F04), para no salir antes de que termine
  deshabilitada?: boolean;
};

// Barra superior de la lección (docs/diseno.md, sección 6): la X y la barra de
// progreso. También se ve mientras carga y en los estados de error.
export default function EncabezadoLeccion({ alSalir, progreso, deshabilitada = false }: Props) {
  const c = useColores();
  return (
    <View style={styles.encabezado}>
      <Pressable
        onPress={alSalir}
        disabled={deshabilitada}
        accessibilityRole="button"
        accessibilityLabel="Salir de la lección"
        accessibilityState={{ disabled: deshabilitada }}
        hitSlop={espacio[2]}
        style={({ pressed }) => [
          styles.salir,
          { backgroundColor: c.primarioSuave },
          pressed && styles.presionado,
          deshabilitada && styles.deshabilitada,
        ]}
      >
        <X size={20} color={c.primario} strokeWidth={2.25} />
      </Pressable>
      {progreso && <BarraProgreso actual={progreso.actual} total={progreso.total} />}
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[5],
    paddingHorizontal: MARGEN_PANTALLA,
    paddingVertical: espacio[3],
  },
  salir: {
    width: AREA_TACTIL,
    height: AREA_TACTIL,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radio.pildora,
  },
  presionado: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  // como el Boton mientras envía
  deshabilitada: {
    opacity: 0.6,
  },
});
