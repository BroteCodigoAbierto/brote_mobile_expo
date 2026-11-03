import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import BloqueCodigo from "../componentes/BloqueCodigo";
import OpcionRespuesta, { type EstadoOpcion } from "../componentes/OpcionRespuesta";
import Texto from "../componentes/Texto";
import { espacio } from "../constantes/tema";
import { mezclar, textoOpcion } from "../utilidades/actividades";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Opción múltiple (spec F03): una sola correcta, opciones mezcladas cada vez
// que aparece la pregunta (en el prototipo la correcta siempre era la primera).
export default function OpcionMultiple({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"opcionMultiple">) {
  const { pregunta, codigo, opciones, correcta } = actividad;
  // se mezclan una sola vez, al montar; cada una recuerda su lugar original
  const [mezcladas] = useState(() =>
    mezclar(opciones.map((opcion, indice) => ({ opcion, indice }))),
  );
  const [elegida, setElegida] = useState<number | null>(null);
  const [comprobada, setComprobada] = useState(false);
  const conSimbolos = opciones.some((opcion) => "simbolo" in opcion);
  const acerto = elegida === correcta;
  const respuestaCorrecta = opciones[correcta];

  function elegir(indice: number) {
    if (comprobada) return;
    setElegida(indice);
    alInteractuar();
  }

  function estadoDe(indice: number): EstadoOpcion {
    if (!comprobada) return indice === elegida ? "seleccionada" : "normal";
    if (indice === correcta) return "correcta";
    return indice === elegida ? "incorrecta" : "normal";
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      detalle={acerto || !respuestaCorrecta ? undefined : textoOpcion(respuestaCorrecta)}
      textoBoton="Continuar"
      alPulsar={() => alTerminar(acerto ? "acierto" : "fallo")}
    />
  ) : (
    <BarraRespuesta
      estado="neutro"
      textoBoton="Comprobar"
      deshabilitado={elegida === null}
      alPulsar={() => setComprobada(true)}
    />
  );

  return (
    <MarcoActividad barra={barra}>
      <Texto variante="titulo2" accessibilityRole="header">
        {pregunta}
      </Texto>
      {codigo && <BloqueCodigo codigo={codigo} />}
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={pregunta}
        style={conSimbolos ? styles.mosaicos : styles.lista}
      >
        {mezcladas.map(({ opcion, indice }) => (
          <OpcionRespuesta
            key={indice}
            estado={estadoDe(indice)}
            {...("simbolo" in opcion ? { simbolo: opcion.simbolo } : { texto: opcion.texto })}
            deshabilitada={comprobada}
            alElegir={() => elegir(indice)}
          />
        ))}
      </View>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  lista: {
    gap: espacio[4],
  },
  mosaicos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[4],
  },
});
