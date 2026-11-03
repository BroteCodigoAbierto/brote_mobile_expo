import type { ComponentRef, Ref } from "react";
import { StyleSheet, TextInput, View, type ReturnKeyTypeOptions } from "react-native";
import { espacio, fuentes, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { LIMITES_ACTIVIDADES } from "../tipos/contrato";
import Texto from "./Texto";

export type EstadoEspacio = "normal" | "correcto" | "incorrecto";

type Props = {
  valor: string;
  alCambiar: (valor: string) => void;
  estado: EstadoEspacio;
  // la respuesta esperada, que se muestra al lado si es incorrecto
  esperada?: string;
  // nombre accesible, p. ej. "Espacio 1 de 2"
  etiqueta: string;
  deshabilitado?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  alEnviar?: () => void;
  // para pasar el foco al siguiente espacio
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

// Un espacio de "completar espacios" (docs/diseno.md, sección 6): un campo en
// la línea del texto, que crece con lo escrito.
export default function CampoEspacio({
  valor,
  alCambiar,
  estado,
  esperada,
  etiqueta,
  deshabilitado = false,
  returnKeyType,
  alEnviar,
  ref,
}: Props) {
  const c = useColores();
  const aspecto = {
    normal: { borde: c.bordeFuerte, fondo: c.vidrioSuave },
    correcto: { borde: c.broteFuerte, fondo: c.broteSuave },
    incorrecto: { borde: c.error, fondo: c.errorSuave },
  }[estado];

  return (
    <View style={styles.espacio}>
      <TextInput
        ref={ref}
        value={valor}
        onChangeText={alCambiar}
        accessibilityLabel={etiqueta}
        maxLength={LIMITES_ACTIVIDADES.respuestaEspacioMax}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        editable={!deshabilitado}
        returnKeyType={returnKeyType}
        onSubmitEditing={alEnviar}
        submitBehavior={returnKeyType === "next" ? "submit" : "blurAndSubmit"}
        style={[
          styles.campo,
          { borderColor: aspecto.borde, backgroundColor: aspecto.fondo, color: c.texto },
        ]}
      />
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
  espacio: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
    marginVertical: espacio[1],
  },
  campo: {
    ...tipografia.cuerpo,
    fontFamily: fuentes.seminegrita,
    minWidth: 64,
    minHeight: 44,
    paddingVertical: 0,
    paddingHorizontal: espacio[4],
    borderWidth: 2,
    borderRadius: radio.chico,
    borderCurve: "continuous",
  },
  esperada: {
    fontFamily: fuentes.negrita,
  },
});
