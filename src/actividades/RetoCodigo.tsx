import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import BloqueCodigo from "../componentes/BloqueCodigo";
import Boton from "../componentes/Boton";
import CampoCodigo from "../componentes/CampoCodigo";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import { espacio } from "../constantes/tema";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Reto de código (spec F12): escribe su código, ve la solución de referencia y se califica
// él mismo, como en la pregunta abierta. No se ejecuta nada.
export default function RetoCodigo({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"retoCodigo">) {
  const inicial = actividad.codigoInicial ?? "";
  const [codigo, setCodigo] = useState(inicial);
  const [comprobada, setComprobada] = useState(false);
  const [laTuvoBien, setLaTuvoBien] = useState<boolean | null>(null);
  // para comprobar tiene que intentar algo: escribir y cambiar el código inicial
  const sinRespuesta = codigo.trim() === "" || codigo === inicial;

  function escribir(valor: string) {
    setCodigo(valor);
    alInteractuar();
  }

  function comprobar() {
    if (sinRespuesta) return;
    // para que el teclado no tape la solución
    Keyboard.dismiss();
    setComprobada(true);
  }

  // mientras se autoevalúa no hay "Continuar": la acción son sus dos botones
  let barra = null;
  if (!comprobada) {
    barra = (
      <BarraRespuesta
        estado="neutro"
        textoBoton="Comprobar"
        deshabilitado={sinRespuesta}
        alPulsar={comprobar}
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
        {actividad.consigna}
      </Texto>
      <CampoCodigo
        valor={codigo}
        alCambiar={escribir}
        lenguaje={actividad.lenguaje}
        soloLectura={comprobada}
        etiqueta="Tu código"
      />
      {comprobada && (
        <>
          <Superficie tono="suave" style={styles.solucion}>
            <Texto variante="seccion" color="textoSuave">
              Solución de referencia
            </Texto>
            {/* en SQL o Bash, una línea con - es código normal: sin colores de diff */}
            <BloqueCodigo codigo={actividad.solucion} lenguaje={actividad.lenguaje} diff={false} />
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
