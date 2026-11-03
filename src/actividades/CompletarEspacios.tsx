import { Fragment, useRef, useState, type ComponentRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import CampoEspacio, { type EstadoEspacio } from "../componentes/CampoEspacio";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import { espacio } from "../constantes/tema";
import { esAceptada, partirEnEspacios, textoConRespuestas } from "../utilidades/actividades";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Un trozo de una línea: texto (una palabra con sus espacios) o el espacio n.
type Pieza = { tipo: "texto"; texto: string } | { tipo: "espacio"; indice: number };

// React Native no puede poner un TextInput dentro de un Text: cada línea es
// una fila que se envuelve, hecha de palabras y campos. Los espacios al inicio
// de la línea se conservan como sangría (research de F03, punto 12).
function partirEnLineas(texto: string): Pieza[][] {
  const lineas: Pieza[][] = [[]];
  partirEnEspacios(texto).forEach((trozo, i) => {
    if (i > 0) lineas[lineas.length - 1]!.push({ tipo: "espacio", indice: i - 1 });
    trozo.split("\n").forEach((parte, j) => {
      if (j > 0) lineas.push([]);
      // cada palabra se queda con el espacio que la sigue, para envolver bien
      for (const palabra of parte.match(/\s*\S+\s*|\s+/g) ?? []) {
        lineas[lineas.length - 1]!.push({ tipo: "texto", texto: palabra });
      }
    });
  });
  return lineas;
}

// Completar espacios (spec F03): se escribe en cada espacio y se acepta
// cualquiera de sus respuestas, sin importar mayúsculas, acentos ni espacios
// de más. Se acierta solo si todos los espacios son correctos.
export default function CompletarEspacios({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"completarEspacios">) {
  const { espacios } = actividad;
  const [lineas] = useState(() => partirEnLineas(actividad.texto));
  const [valores, setValores] = useState<string[]>(() => espacios.map(() => ""));
  const [correctos, setCorrectos] = useState<boolean[] | null>(null);
  const campos = useRef<(ComponentRef<typeof TextInput> | null)[]>([]);
  const comprobada = correctos !== null;
  const completo = valores.every((valor) => valor.trim() !== "");
  const acerto = comprobada && correctos.every(Boolean);

  function cambiar(indice: number, valor: string) {
    setValores((antes) => antes.map((anterior, i) => (i === indice ? valor : anterior)));
    alInteractuar();
  }

  function comprobar() {
    if (!completo || comprobada) return;
    setCorrectos(valores.map((valor, i) => esAceptada(valor, espacios[i] ?? { aceptadas: [] })));
  }

  function estadoDe(indice: number): EstadoEspacio {
    if (!comprobada) return "normal";
    return correctos[indice] ? "correcto" : "incorrecto";
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      detalle={acerto ? undefined : textoConRespuestas(actividad)}
      textoBoton="Continuar"
      alPulsar={() => alTerminar(acerto ? "acierto" : "fallo")}
    />
  ) : (
    <BarraRespuesta
      estado="neutro"
      textoBoton="Comprobar"
      deshabilitado={!completo}
      alPulsar={comprobar}
    />
  );

  return (
    <MarcoActividad barra={barra}>
      <Superficie style={styles.panel}>
        {lineas.map((piezas, i) => (
          <View key={i} style={styles.linea}>
            {piezas.length === 0 && <Texto> </Texto>}
            {piezas.map((pieza, j) => (
              <Fragment key={j}>
                {pieza.tipo === "texto" ? (
                  <Texto style={styles.palabra}>{pieza.texto}</Texto>
                ) : (
                  <CampoEspacio
                    ref={(campo) => {
                      campos.current[pieza.indice] = campo;
                    }}
                    valor={valores[pieza.indice] ?? ""}
                    alCambiar={(valor) => cambiar(pieza.indice, valor)}
                    estado={estadoDe(pieza.indice)}
                    esperada={
                      estadoDe(pieza.indice) === "incorrecto"
                        ? espacios[pieza.indice]?.aceptadas[0]
                        : undefined
                    }
                    etiqueta={`Espacio ${pieza.indice + 1} de ${espacios.length}`}
                    deshabilitado={comprobada}
                    returnKeyType={pieza.indice < espacios.length - 1 ? "next" : "done"}
                    alEnviar={() => campos.current[pieza.indice + 1]?.focus()}
                  />
                )}
              </Fragment>
            ))}
          </View>
        ))}
      </Superficie>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: espacio[2],
    padding: espacio[6],
  },
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
