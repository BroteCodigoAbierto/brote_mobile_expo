import { ScrollView, StyleSheet, View } from "react-native";
import { espacio, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { tipoLineaCodigo } from "../utilidades/actividades";
import Texto from "./Texto";

type Props = {
  codigo: string;
};

// Código de una actividad (docs/diseno.md, sección 4): panel oscuro, una fila
// por línea y las líneas de diff resaltadas. Las líneas no se cortan: dentro
// del ScrollView horizontal cada una mide lo que mide su texto, y el bloque se
// desplaza hacia los lados.
export default function BloqueCodigo({ codigo }: Props) {
  const c = useColores();
  const aspecto = {
    agregada: { color: c.codigoAgregado, fondo: c.codigoAgregadoFondo },
    eliminada: { color: c.codigoEliminado, fondo: c.codigoEliminadoFondo },
    encabezado: { color: c.codigoEncabezado, fondo: "transparent" },
    normal: { color: c.codigoTexto, fondo: "transparent" },
  };

  return (
    <ScrollView
      horizontal
      style={[styles.bloque, { backgroundColor: c.codigoFondo }]}
      contentContainerStyle={styles.contenido}
      accessibilityLabel="Código"
    >
      <View style={styles.lineas}>
        {codigo.split("\n").map((linea, i) => {
          const { color, fondo } = aspecto[tipoLineaCodigo(linea)];
          return (
            <Texto
              key={i}
              style={[tipografia.codigo, styles.linea, { color, backgroundColor: fondo }]}
            >
              {/* una línea vacía conserva su alto */}
              {linea === "" ? " " : linea}
            </Texto>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bloque: {
    flexGrow: 0,
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  contenido: {
    flexGrow: 1,
    paddingVertical: espacio[5],
  },
  lineas: {
    flexGrow: 1,
  },
  linea: {
    paddingHorizontal: espacio[5],
  },
});
