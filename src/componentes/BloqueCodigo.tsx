import { ScrollView, StyleSheet, View } from "react-native";
import { espacio, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { NOMBRE_LENGUAJE, type LenguajeCodigo } from "../tipos/contrato";
import { tipoLineaCodigo } from "../utilidades/actividades";
import Texto from "./Texto";

type Props = {
  codigo: string;
  // F12: la etiqueta arriba a la derecha; con "otro", sin etiqueta
  lenguaje?: LenguajeCodigo;
  // F12: con false, ninguna línea se colorea como diff (la solución de un reto)
  diff?: boolean;
};

// Código de una actividad (docs/diseno.md, sección 4): panel oscuro, una fila
// por línea y las líneas de diff resaltadas. Las líneas no se cortan: dentro
// del ScrollView horizontal cada una mide lo que mide su texto, y el bloque se
// desplaza hacia los lados.
export default function BloqueCodigo({ codigo, lenguaje, diff = true }: Props) {
  const c = useColores();
  const aspecto = {
    agregada: { color: c.codigoAgregado, fondo: c.codigoAgregadoFondo },
    eliminada: { color: c.codigoEliminado, fondo: c.codigoEliminadoFondo },
    encabezado: { color: c.codigoEncabezado, fondo: "transparent" },
    normal: { color: c.codigoTexto, fondo: "transparent" },
  };

  const bloque = (
    <ScrollView
      horizontal
      style={[styles.bloque, { backgroundColor: c.codigoFondo }]}
      contentContainerStyle={styles.contenido}
      accessibilityLabel="Código"
    >
      <View style={styles.lineas}>
        {codigo.split("\n").map((linea, i) => {
          const { color, fondo } = aspecto[diff ? tipoLineaCodigo(linea) : "normal"];
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

  if (!lenguaje || lenguaje === "otro") return bloque;
  // la etiqueta va en su propia fila, para no tapar el final de la primera línea
  return (
    <View style={[styles.conEtiqueta, { backgroundColor: c.codigoFondo }]}>
      <EtiquetaLenguaje lenguaje={lenguaje} />
      {bloque}
    </View>
  );
}

// La etiqueta del lenguaje (docs/diseno.md, sección 4): es parte del panel de código, y la
// usa también CampoCodigo, como en la web la clase de BloqueCodigo.module.css.
export function EtiquetaLenguaje({ lenguaje }: { lenguaje: LenguajeCodigo }) {
  const c = useColores();
  return (
    <View style={[styles.etiqueta, { backgroundColor: c.codigoEtiquetaFondo }]}>
      <Texto variante="nota" color="codigoTenue">
        {NOMBRE_LENGUAJE[lenguaje]}
      </Texto>
    </View>
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
  conEtiqueta: {
    borderRadius: radio.medio,
    borderCurve: "continuous",
    paddingTop: espacio[4],
  },
  // encima del ScrollView, que se dibuja después con su fondo: sin zIndex, el margen negativo
  // deja la mitad de abajo de la etiqueta tapada por el código
  etiqueta: {
    zIndex: 1,
    alignSelf: "flex-end",
    marginRight: espacio[4],
    marginBottom: -espacio[3],
    paddingHorizontal: espacio[4],
    paddingVertical: espacio[1],
    borderRadius: radio.pildora,
  },
});
