import { StyleSheet, TextInput, View } from "react-native";
import { espacio, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { LIMITES_ACTIVIDADES, NOMBRE_LENGUAJE, type LenguajeCodigo } from "../tipos/contrato";
import { limpiarEscrito } from "../utilidades/codigo";
import { EtiquetaLenguaje } from "./BloqueCodigo";

type Props = {
  valor: string;
  alCambiar: (valor: string) => void;
  lenguaje: LenguajeCodigo;
  soloLectura?: boolean;
  // el nombre accesible del campo; el lenguaje se le agrega
  etiqueta: string;
};

const LINEAS_MIN = 6;
// con más, se desplaza por dentro y la línea que se escribe queda sobre el teclado
const LINEAS_MAX = 12;
const RELLENO = espacio[5];

// El campo de código del reto (docs/diseno.md, sección 4): el panel oscuro, de 6 a 12
// líneas. En el teléfono no hay Tab: la sangría se escribe con espacios. El teclado no
// corrige ni cambia comillas, guiones ni puntos (brote_specs, research de F12, punto 5).
export default function CampoCodigo({
  valor,
  alCambiar,
  lenguaje,
  soloLectura = false,
  etiqueta,
}: Props) {
  const c = useColores();
  const nombre = lenguaje === "otro" ? "" : NOMBRE_LENGUAJE[lenguaje];

  function cambiar(texto: string) {
    alCambiar(limpiarEscrito(texto, texto.length, LIMITES_ACTIVIDADES.respuestaCodigoMax).texto);
  }

  return (
    <View style={[styles.panel, { backgroundColor: c.codigoFondo }]}>
      {/* el lenguaje ya va en el nombre del campo */}
      {nombre ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <EtiquetaLenguaje lenguaje={lenguaje} />
        </View>
      ) : null}
      <TextInput
        value={valor}
        onChangeText={cambiar}
        editable={!soloLectura}
        multiline
        scrollEnabled
        textAlignVertical="top"
        maxLength={LIMITES_ACTIVIDADES.respuestaCodigoMax}
        accessibilityLabel={nombre ? `${etiqueta}, ${nombre}` : etiqueta}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        autoComplete="off"
        smartInsertDelete={false}
        cursorColor={c.codigoCursor}
        selectionColor={c.codigoCursor}
        style={[
          tipografia.codigo,
          styles.entrada,
          { color: soloLectura ? c.codigoTenue : c.codigoTexto },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radio.medio,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  entrada: {
    minHeight: LINEAS_MIN * tipografia.codigo.lineHeight + 2 * RELLENO,
    maxHeight: LINEAS_MAX * tipografia.codigo.lineHeight + 2 * RELLENO,
    padding: RELLENO,
  },
});
