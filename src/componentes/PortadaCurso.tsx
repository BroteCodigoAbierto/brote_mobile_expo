import { StyleSheet, Text, View } from "react-native";
import { coloresPortada, radio, sobrePortada } from "../constantes/tema";
import { indiceColorPortada, inicialPortada } from "../utilidades/cursos";

type Props = {
  id: string;
  titulo: string;
  tamano: "tarjeta" | "detalle";
};

// Los cursos no tienen imagen: la portada es la inicial del título sobre un
// color que sale del id. Es decorativa, el título siempre va al lado; por eso
// los lectores de pantalla la saltan.
export default function PortadaCurso({ id, titulo, tamano }: Props) {
  const esDetalle = tamano === "detalle";

  return (
    <View
      style={[
        styles.portada,
        esDetalle ? styles.detalle : styles.tarjeta,
        { backgroundColor: coloresPortada[indiceColorPortada(id)] },
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
    borderRadius: radio,
  },
  tarjeta: {
    width: 72,
    height: 72,
  },
  detalle: {
    width: 112,
    height: 112,
  },
  inicial: {
    color: sobrePortada,
    fontWeight: "700",
  },
  inicialTarjeta: {
    fontSize: 32,
  },
  inicialDetalle: {
    fontSize: 52,
  },
});
