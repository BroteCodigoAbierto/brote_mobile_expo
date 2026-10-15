import { StyleSheet, View } from "react-native";
import { colores } from "../constantes/tema";

type Props = {
  progreso: number; // de 0 a 1
};

// Barra hecha con dos View: el fondo gris y encima la parte llena,
// con un ancho en porcentaje.
export default function BarraProgreso({ progreso }: Props) {
  return (
    <View style={styles.fondo}>
      <View style={[styles.lleno, { width: `${Math.round(progreso * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colores.claro.borde,
    overflow: "hidden",
  },
  lleno: {
    height: "100%",
    backgroundColor: colores.claro.primario,
  },
});
