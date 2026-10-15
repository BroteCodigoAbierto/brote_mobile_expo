import { StyleSheet, Text, View } from "react-native";
import { colores, radio } from "../constantes/tema";
import { Leccion } from "../tipos/tipos";

type Props = {
  leccion: Leccion;
  numero: number;
  esLaSiguiente: boolean; // la primera lección que falta por hacer
};

export default function FilaLeccion({ leccion, numero, esLaSiguiente }: Props) {
  return (
    <View style={[styles.fila, esLaSiguiente && styles.filaSiguiente]}>
      {/* Círculo con palomita si ya se completó, o con el número si no */}
      <View style={[styles.circulo, leccion.completada && styles.circuloCompletado]}>
        <Text style={[styles.textoCirculo, leccion.completada && styles.textoCirculoCompletado]}>
          {leccion.completada ? "✓" : numero}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.titulo}>{leccion.titulo}</Text>
        {esLaSiguiente && <Text style={styles.etiqueta}>Continúa aquí</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radio,
    backgroundColor: colores.claro.superficie,
    borderWidth: 1,
    borderColor: colores.claro.borde,
  },
  filaSiguiente: {
    borderColor: colores.claro.primario,
    borderWidth: 2,
  },
  circulo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colores.claro.borde,
    alignItems: "center",
    justifyContent: "center",
  },
  circuloCompletado: {
    backgroundColor: colores.claro.primario,
    borderColor: colores.claro.primario,
  },
  textoCirculo: {
    fontWeight: "700",
    color: colores.claro.textoSuave,
  },
  textoCirculoCompletado: {
    color: colores.claro.sobrePrimario,
  },
  info: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    color: colores.claro.texto,
  },
  etiqueta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: colores.claro.primario,
  },
});
