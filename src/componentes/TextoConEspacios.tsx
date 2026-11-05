import { Fragment, useMemo, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { partirEnLineas } from "../utilidades/actividades";
import Texto from "./Texto";

type Props = {
  texto: string;
  dibujarEspacio: (indice: number) => ReactNode;
};

// Las líneas de un texto con espacios (docs/diseno.md, sección 4): lo que va en cada
// espacio lo dibuja quien lo usa. Una línea por fila, para que se envuelva bien.
export default function TextoConEspacios({ texto, dibujarEspacio }: Props) {
  const lineas = useMemo(() => partirEnLineas(texto), [texto]);

  return lineas.map((piezas, i) => (
    <View key={i} style={styles.linea}>
      {piezas.length === 0 && <Texto> </Texto>}
      {piezas.map((pieza, j) => (
        <Fragment key={j}>
          {pieza.tipo === "texto" ? (
            <Texto style={styles.palabra}>{pieza.texto}</Texto>
          ) : (
            dibujarEspacio(pieza.indice)
          )}
        </Fragment>
      ))}
    </View>
  ));
}

const styles = StyleSheet.create({
  linea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  // conserva los espacios del texto, incluida la sangría
  palabra: {
    flexShrink: 0,
  },
});
