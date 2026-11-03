import { StyleSheet, Text, View } from "react-native";
import { aclarar, coloresPortada, fuentes, radio, sobrePortada } from "../constantes/tema";
import { indiceColorPortada, inicialPortada } from "../utilidades/cursos";

type Props = {
  id: string;
  titulo: string;
  tamano: "tarjeta" | "detalle";
};

// Los cursos no tienen imagen: la portada es la inicial del título sobre un
// degradado del color que sale del id (docs/diseno.md, sección 2.1). Es
// decorativa, el título siempre va al lado; por eso los lectores de pantalla
// la saltan.
export default function PortadaCurso({ id, titulo, tamano }: Props) {
  const esDetalle = tamano === "detalle";
  const color = coloresPortada[indiceColorPortada(id)];
  const degradado =
    "radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.28), transparent 38%), " +
    `linear-gradient(135deg, ${color}, ${aclarar(color)})`;

  return (
    <View
      style={[
        styles.portada,
        esDetalle ? styles.detalle : styles.tarjeta,
        { backgroundColor: color, experimental_backgroundImage: degradado },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={[styles.inicial, esDetalle ? styles.inicialDetalle : styles.inicialTarjeta]}>
        {inicialPortada(titulo)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  portada: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderCurve: "continuous",
  },
  tarjeta: {
    width: 84,
    height: 84,
    borderRadius: radio.medio,
  },
  detalle: {
    width: 120,
    height: 120,
    borderRadius: radio.grande,
  },
  inicial: {
    color: sobrePortada,
    fontFamily: fuentes.extranegrita,
    textShadowColor: "rgba(0, 0, 0, 0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  inicialTarjeta: {
    fontSize: 36,
    lineHeight: 42,
  },
  inicialDetalle: {
    fontSize: 54,
    lineHeight: 62,
  },
});
