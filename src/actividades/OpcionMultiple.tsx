import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import BloqueCodigo from "../componentes/BloqueCodigo";
import ImagenAmpliable from "../componentes/ImagenAmpliable";
import OpcionRespuesta, { type EstadoOpcion } from "../componentes/OpcionRespuesta";
import Texto from "../componentes/Texto";
import { espacio, medidasImagen } from "../constantes/tema";
import { mezclar, textoOpcion } from "../utilidades/actividades";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Opción múltiple (spec F03): una sola correcta, opciones mezcladas cada vez
// que aparece la pregunta (en el prototipo la correcta siempre era la primera). Desde F13,
// la pregunta puede llevar una imagen y las opciones pueden ser imágenes: mosaicos en filas
// de al menos dos (docs/diseno.md, sección 4).
export default function OpcionMultiple({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"opcionMultiple">) {
  const { pregunta, imagen, codigo, opciones, correcta } = actividad;
  // se mezclan una sola vez, al montar; cada una recuerda su lugar original
  const [mezcladas] = useState(() =>
    mezclar(opciones.map((opcion, indice) => ({ opcion, indice }))),
  );
  const [elegida, setElegida] = useState<number | null>(null);
  const [comprobada, setComprobada] = useState(false);
  const conSimbolos = opciones.some((opcion) => "simbolo" in opcion);
  const conImagenes = opciones.some((opcion) => "imagen" in opcion);
  // el ancho de la rejilla, para repartirlo entre los mosaicos de imagen
  const [ancho, setAncho] = useState(0);
  const columnas = Math.max(
    2,
    Math.floor((ancho + espacio[4]) / (medidasImagen.mosaicoOpcion + espacio[4])),
  );
  // antes de medir la rejilla, sin ancho
  const anchoMosaico = Math.max(0, (ancho - (columnas - 1) * espacio[4]) / columnas);
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
      {...(acerto || !respuestaCorrecta
        ? {}
        : "imagen" in respuestaCorrecta
          ? { lineas: [[{ imagen: respuestaCorrecta.imagen }]] }
          : { detalle: textoOpcion(respuestaCorrecta) })}
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
      {imagen && <ImagenAmpliable imagen={imagen} />}
      {codigo && <BloqueCodigo codigo={codigo} />}
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={pregunta}
        style={conSimbolos || conImagenes ? styles.mosaicos : styles.lista}
        onLayout={(evento) => setAncho(evento.nativeEvent.layout.width)}
      >
        {mezcladas.map(({ opcion, indice }, lugar) =>
          "imagen" in opcion ? (
            <View key={indice} style={{ width: anchoMosaico }}>
              <OpcionRespuesta
                estado={estadoDe(indice)}
                imagen={opcion.imagen}
                lugar={lugar + 1}
                deshabilitada={comprobada}
                alElegir={() => elegir(indice)}
              />
            </View>
          ) : (
            <OpcionRespuesta
              key={indice}
              estado={estadoDe(indice)}
              {...("simbolo" in opcion ? { simbolo: opcion.simbolo } : { texto: opcion.texto })}
              deshabilitada={comprobada}
              alElegir={() => elegir(indice)}
            />
          ),
        )}
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
