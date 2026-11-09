import { useRef, useState, type ComponentRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import CampoEspacio, { type EstadoEspacio } from "../componentes/CampoEspacio";
import Superficie from "../componentes/Superficie";
import TextoConEspacios from "../componentes/TextoConEspacios";
import { espacio } from "../constantes/tema";
import { esAceptada, textoConRespuestas } from "../utilidades/actividades";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Completar espacios (spec F03): se escribe en cada espacio y se acepta
// cualquiera de sus respuestas, sin importar mayúsculas, acentos ni espacios
// de más. Se acierta solo si todos los espacios son correctos.
export default function CompletarEspacios({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"completarEspacios">) {
  const { espacios } = actividad;
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
        <TextoConEspacios
          texto={actividad.texto}
          dibujarEspacio={(indice) => (
            <CampoEspacio
              ref={(campo) => {
                campos.current[indice] = campo;
              }}
              valor={valores[indice] ?? ""}
              alCambiar={(valor) => cambiar(indice, valor)}
              estado={estadoDe(indice)}
              esperada={
                estadoDe(indice) === "incorrecto" ? espacios[indice]?.aceptadas[0] : undefined
              }
              etiqueta={`Espacio ${indice + 1} de ${espacios.length}`}
              deshabilitado={comprobada}
              returnKeyType={indice < espacios.length - 1 ? "next" : "done"}
              alEnviar={() => campos.current[indice + 1]?.focus()}
            />
          )}
        />
      </Superficie>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: espacio[2],
    padding: espacio[6],
  },
});
