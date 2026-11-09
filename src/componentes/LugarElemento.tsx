import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { espacio, fuentes, medidasImagen, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { EstadoEspacio } from "./CampoEspacio";
import Texto from "./Texto";

type Props = {
  // el lugar de ordenar, a la izquierda
  numero?: number;
  // espacio del banco, dentro del texto
  enLinea?: boolean;
  // F13: el lugar de un elemento de imagen, del tamaño de un mosaico
  mosaico?: boolean;
  estado?: EstadoEspacio;
  // la ficha esperada, que se muestra al lado si es incorrecto
  esperada?: string;
  // el elemento arrastrado está encima
  resaltado?: boolean;
  // nombre accesible del lugar vacío, p. ej. "Lugar 2, vacío"
  etiqueta: string;
  // el elemento colocado; sin él, el lugar está libre
  children?: ReactNode;
};

// Donde se coloca un ElementoRespuesta (docs/diseno.md, sección 4).
export default function LugarElemento({
  numero,
  enLinea = false,
  mosaico = false,
  estado = "normal",
  esperada,
  resaltado = false,
  etiqueta,
  children,
}: Props) {
  const c = useColores();
  const vacio = children === undefined || children === null;
  const colorNumero = { normal: c.primarioSuave, correcto: c.broteSuave, incorrecto: c.errorSuave };

  return (
    <View style={enLinea ? styles.enLinea : styles.fila}>
      {numero !== undefined && (
        <View style={[styles.numero, { backgroundColor: colorNumero[estado] }]}>
          <Texto variante="etiqueta">{numero}</Texto>
        </View>
      )}
      <View
        accessible={vacio}
        accessibilityLabel={vacio ? etiqueta : undefined}
        style={[
          enLinea ? styles.huecoEnLinea : styles.hueco,
          mosaico && styles.huecoMosaico,
          vacio ? [styles.vacio, { borderColor: c.bordeFuerte }] : styles.lleno,
          resaltado && { borderColor: c.primario, backgroundColor: c.primarioSuave },
        ]}
      >
        {children}
      </View>
      {esperada !== undefined && (
        <Texto
          variante="nota"
          style={[styles.esperada, { color: c.broteFuerte }]}
          accessibilityLabel={`Respuesta esperada: ${esperada}`}
        >
          {esperada}
        </Texto>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  enLinea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: espacio[3],
    marginVertical: espacio[1],
  },
  numero: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: radio.pildora,
  },
  hueco: {
    flex: 1,
    minHeight: 56,
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  // F13: el mosaico y los 2 px de borde de cada lado
  huecoMosaico: {
    flex: 0,
    width: medidasImagen.mosaicoElemento + 4,
    height: medidasImagen.mosaicoElemento + 4,
    minHeight: 0,
  },
  huecoEnLinea: {
    flexShrink: 1,
    minWidth: 64,
    minHeight: 44,
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  vacio: {
    borderWidth: 2,
    borderStyle: "dashed",
  },
  // sin borde propio, pero con el mismo grosor: resaltarlo no mueve al elemento
  lleno: {
    borderWidth: 2,
    borderColor: "transparent",
  },
  esperada: {
    fontFamily: fuentes.negrita,
  },
});
