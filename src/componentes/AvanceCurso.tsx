import { CircleCheck } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { espacio, fuentes } from "../constantes/tema";
import { textoAvance, textoAvanceAccesible } from "../utilidades/progreso";
import BarraProgreso from "./BarraProgreso";
import Insignia from "./Insignia";
import Texto from "./Texto";

type Props = {
  completadas: number;
  total: number;
};

// Avance de un curso (docs/diseno.md, sección 4): "2 de 6 lecciones" con su
// barra y, con todas completadas, "Curso terminado".
export default function AvanceCurso({ completadas, total }: Props) {
  const terminado = total > 0 && completadas >= total;

  return (
    <View style={styles.avance}>
      <View style={styles.encabezado}>
        <Texto variante="cuerpoChico" style={styles.texto}>
          {textoAvance(completadas, total)}
        </Texto>
        {terminado && <Insignia tono="brote" icono={CircleCheck} texto="Curso terminado" />}
      </View>
      {/* en fila: la barra trae flex: 1 para la fila de la lección */}
      <View style={styles.fila}>
        <BarraProgreso
          actual={completadas}
          total={total}
          etiqueta="Avance del curso"
          textoValor={textoAvanceAccesible(completadas, total)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avance: {
    gap: espacio[3],
  },
  encabezado: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espacio[3],
  },
  texto: {
    fontFamily: fuentes.seminegrita,
  },
  fila: {
    flexDirection: "row",
  },
});
