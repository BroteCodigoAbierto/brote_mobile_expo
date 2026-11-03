import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import Boton from "../componentes/Boton";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import { espacio, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { LIMITES_ACTIVIDADES } from "../tipos/contrato";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Pregunta abierta (spec F03): escribe su respuesta, ve la solución de
// referencia y se califica él mismo.
export default function PreguntaAbierta({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"preguntaAbierta">) {
  const c = useColores();
  const [respuesta, setRespuesta] = useState("");
  const [comprobada, setComprobada] = useState(false);
  const [laTuvoBien, setLaTuvoBien] = useState<boolean | null>(null);

  function escribir(valor: string) {
    setRespuesta(valor);
    alInteractuar();
  }

  // mientras se autoevalúa no hay "Continuar": la acción son sus dos botones
  let barra = null;
  if (!comprobada) {
    barra = (
      <BarraRespuesta
        estado="neutro"
        textoBoton="Comprobar"
        deshabilitado={respuesta.trim() === ""}
        alPulsar={() => setComprobada(true)}
      />
    );
  } else if (laTuvoBien !== null) {
    barra = (
      <BarraRespuesta
        estado={laTuvoBien ? "correcto" : "incorrecto"}
        titulo={laTuvoBien ? "¡Correcto!" : "A repasar"}
        textoBoton="Continuar"
        alPulsar={() => alTerminar(laTuvoBien ? "acierto" : "fallo")}
      />
    );
  }

  return (
    <MarcoActividad barra={barra}>
      <Texto variante="titulo2" accessibilityRole="header">
        {actividad.pregunta}
      </Texto>
      <TextInput
        value={respuesta}
        onChangeText={escribir}
        placeholder="Escribe tu respuesta…"
        placeholderTextColor={c.textoTenue}
        accessibilityLabel={actividad.pregunta}
        maxLength={LIMITES_ACTIVIDADES.respuestaAbiertaMax}
        editable={!comprobada}
        multiline
        textAlignVertical="top"
        style={[
          styles.respuesta,
          {
            backgroundColor: c.vidrioSuave,
            borderColor: c.borde,
            color: comprobada ? c.textoSuave : c.texto,
          },
        ]}
      />
      {comprobada && (
        <>
          <Superficie tono="suave" style={styles.solucion}>
            <Texto variante="seccion" color="textoSuave">
              Solución de referencia
            </Texto>
            <Texto>{actividad.solucion}</Texto>
          </Superficie>
          {laTuvoBien === null && (
            <View style={styles.autoevaluacion}>
              <Texto variante="titulo3">¿La tuviste bien?</Texto>
              <View style={styles.botones}>
                <Boton
                  titulo="La tuve bien"
                  variante="secundario"
                  alPresionar={() => setLaTuvoBien(true)}
                />
                <Boton
                  titulo="No la tuve"
                  variante="secundario"
                  alPresionar={() => setLaTuvoBien(false)}
                />
              </View>
            </View>
          )}
        </>
      )}
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  respuesta: {
    ...tipografia.cuerpo,
    minHeight: 120,
    paddingVertical: espacio[5],
    paddingHorizontal: espacio[6],
    borderWidth: 1,
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  solucion: {
    gap: espacio[3],
    padding: espacio[6],
  },
  autoevaluacion: {
    gap: espacio[4],
  },
  botones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[4],
  },
});
