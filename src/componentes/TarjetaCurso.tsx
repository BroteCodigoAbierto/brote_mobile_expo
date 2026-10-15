import { Pressable, StyleSheet, Text, View } from "react-native";
import { colores, radio } from "../constantes/tema";
import { progresoDe } from "../datos/cursos";
import { Curso } from "../tipos/tipos";
import BarraProgreso from "./BarraProgreso";

type Props = {
  curso: Curso;
  alPresionar: () => void;
};

export default function TarjetaCurso({ curso, alPresionar }: Props) {
  const progreso = progresoDe(curso);

  return (
    <Pressable
      onPress={alPresionar}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <View style={[styles.icono, { backgroundColor: curso.color }]}>
        <Text style={styles.textoIcono}>{curso.icono}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.titulo}>{curso.titulo}</Text>
        <Text style={styles.lecciones}>{curso.lecciones.length} lecciones</Text>
        <BarraProgreso progreso={progreso} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: radio,
    backgroundColor: colores.claro.superficie,
    borderWidth: 1,
    borderColor: colores.claro.borde,
  },
  presionada: {
    opacity: 0.7,
  },
  icono: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textoIcono: {
    fontSize: 24,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  info: {
    flex: 1, // ocupa el resto del ancho para que la barra se estire
    gap: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "600",
    color: colores.claro.texto,
  },
  lecciones: {
    fontSize: 13,
    color: colores.claro.textoSuave,
  },
});
