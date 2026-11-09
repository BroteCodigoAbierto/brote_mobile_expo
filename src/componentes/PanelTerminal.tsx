import { useRef, type ComponentRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { espacio, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { LIMITES_ACTIVIDADES } from "../tipos/contrato";
import { limpiarEscrito } from "../utilidades/codigo";
import Texto from "./Texto";

type Props = {
  salidaPrevia?: string;
  carpeta?: string;
  comando: string;
  alCambiar: (comando: string) => void;
  // con la tecla de enviar, solo si hay algo escrito
  alEnviar: () => void;
  soloLectura?: boolean;
  // va debajo del comando (al acertar)
  salida?: string;
};

// La terminal simulada (docs/diseno.md, sección 4): el panel oscuro con la salida previa, la
// línea del comando y, al acertar, su salida. La línea es multiline para que un comando largo
// pase a la siguiente mientras se escribe, pero la tecla de enviar nunca salta de línea
// (brote_specs, research de F12, puntos 5 y 6).
export default function PanelTerminal({
  salidaPrevia,
  carpeta,
  comando,
  alCambiar,
  alEnviar,
  soloLectura = false,
  salida,
}: Props) {
  const c = useColores();
  const linea = useRef<ComponentRef<typeof TextInput>>(null);
  const conComando = comando.trim() !== "";

  // el teclado no cambia comillas, guiones ni puntos, y un salto pegado pasa a espacio
  function cambiar(texto: string) {
    alCambiar(limpiarEscrito(texto, texto.length, LIMITES_ACTIVIDADES.comandoMax, true).texto);
  }

  return (
    // pulsar en cualquier parte pone el cursor en la línea y abre el teclado
    <Pressable
      onPress={() => linea.current?.focus()}
      disabled={soloLectura}
      accessible={false}
      style={[styles.panel, { backgroundColor: c.codigoFondo }]}
    >
      {salidaPrevia ? (
        <Texto variante="codigo" color="codigoTexto">
          {salidaPrevia}
        </Texto>
      ) : null}
      <View style={styles.linea}>
        <Texto variante="codigo" color="codigoCursor" style={styles.indicador}>
          {carpeta ? (
            <Texto variante="codigo" color="codigoTenue">
              {`${carpeta} `}
            </Texto>
          ) : null}
          $
        </Texto>
        <TextInput
          ref={linea}
          value={comando}
          onChangeText={cambiar}
          editable={!soloLectura}
          multiline
          maxLength={LIMITES_ACTIVIDADES.comandoMax}
          accessibilityLabel={carpeta ? `Comando, ${carpeta}` : "Comando"}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          autoComplete="off"
          smartInsertDelete={false}
          returnKeyType="send"
          enablesReturnKeyAutomatically
          // con algo escrito, comprueba y cierra el teclado; vacío, no hace nada
          submitBehavior={conComando ? "blurAndSubmit" : "submit"}
          onSubmitEditing={() => {
            if (conComando) alEnviar();
          }}
          cursorColor={c.codigoCursor}
          selectionColor={c.codigoCursor}
          textAlignVertical="top"
          style={[tipografia.codigo, styles.comando, { color: c.codigoTexto }]}
        />
      </View>
      {salida ? (
        <Texto variante="codigo" color="codigoTexto">
          {salida}
        </Texto>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: espacio[2],
    padding: espacio[5],
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  // la carpeta y el $; si la carpeta es larga, el comando sigue debajo
  linea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    columnGap: espacio[3],
  },
  indicador: {
    flexShrink: 1,
  },
  comando: {
    flex: 1,
    minWidth: 96,
    padding: 0,
  },
});
